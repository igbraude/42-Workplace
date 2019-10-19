const Router = require("koa-router");
const fileType = require("file-type");
const body = require("koa-body");
const fs = require("fs");
const uuidv4 = require('uuid/v4');
const utils = require('../utils/utils');
const flash = require('../utils/flash');
const mw = require('./middlewares');
const models = require('../models');
const nodemailer = require('nodemailer');
const notif = require("../sockets/notifications");

const router = new Router();

const tagsList = ['Sloth', 'Lust', 'Wrath', 'Envy', 'Pride', 'Gluttony', 'Greed'];

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'matcha.42lyon@gmail.com',
    pass: 'e7PYuP<d'
  }
});

// Render user profile
router.get(`/profile`, mw.isAuth, mw.check404, async (ctx) => {
  try {
    await models.visits.setPopularityScore(ctx.session.userId);
    const {lat, lng} = await models.geolocation.getUserLocation(ctx.session.userId);
    let userIntel = await models.users.getEditUser(ctx.session.userId, tagsList);

    let blockedList = userIntel.blocked;
    if (blockedList.length === 0) {
      blockedList.push('00000000-0000-0000-0000-000000000000');
    }

    await ctx.render("profile.hbs", {
      userId: ctx.session.userId,
      loggedUser: true,
      flash: await flash.loadFlash(ctx),
      match: await models.likes.getMatch(ctx.session.userId, userIntel.blocked),
      visitorsProfiles: await models.visits.getVisitors(ctx.session.userId, userIntel.blocked),
      likedProfiles: await models.likes.getLikedBy(ctx.session.userId, userIntel.blocked),
      user: await models.users.getUser(ctx.session.userId),
      popularity: await models.visits.getPopularityScore(ctx.session.userId),
      lat: lat,
      lng: lng
    });
  } catch (err) {
    console.log(`User profile error: ${err}`);
    flash.registerFlash(ctx, '/connexion', 'danger', "잘못된 프로필(erroneous profile)")
  }
});

// Render public profile
router.get(/^\/profile\/([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/, mw.isAuth, mw.check404, async (ctx) => {

  if (!(await utils.isUserCompleted(ctx.params[0], ctx))) {
    return
  }
  await models.visits.newVisit(ctx.params[0], ctx.session.userId);
  await notif.visit(ctx.session.userId, ctx.params[0]);

  try {
    await ctx.render("profile.hbs", {
      flash: await flash.loadFlash(ctx),
      userId: ctx.session.userId,
      liked: await utils.isUserLiked(ctx.session.userId, ctx.params[0]),
      hasLiked: await utils.hasUserLikedMe(ctx.session.userId, ctx.params[0]),
      match: await utils.isMatch(ctx.session.userId, ctx.params[0]),
      loggedUser: false,
      user: await models.users.getPublicUser(ctx.params[0]),
      popularity: await models.visits.getPopularityScore(ctx.params[0]),
      lat: undefined,
      lng: undefined
    });
  } catch (err) {
    console.log(`Public profile error: ${err}`);
  flash.registerFlash(ctx, '/profile', 'danger', "사용자가 존재하지 않습니다(user doesn't exist)")
  }
});

// Handle like user
router.post(/^\/profile\/like\/([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/, mw.isAuth, mw.check404, async (ctx) => {
  if ((await utils.isUserCompleted(ctx.params[0], ctx)) && ctx.request.body.type === 'like') {
    await models.likes.like(ctx.session.userId, ctx.params[0]);

     if (await utils.isMatch(ctx.session.userId, ctx.params[0])) {
       await notif.match(ctx.session.userId, ctx.params[0]);
       await models.rooms.createRoom(ctx.session.userId, ctx.params[0])
     } else {
       await notif.like(ctx.session.userId, ctx.params[0]);
     }

  }

  ctx.redirect(`/profile/${ctx.params[0]}`)
});

// Handle unlike user
router.post(/^\/profile\/unlike\/([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/, mw.isAuth, mw.check404, async (ctx) => {
  if ((await utils.isUserCompleted(ctx.params[0], ctx)) && ctx.request.body.type === 'unlike') {
    await models.likes.unLike(ctx.session.userId, ctx.params[0]);

    if (await utils.isMatch(ctx.session.userId, ctx.params[0])) {
      await notif.unmatch(ctx.session.userId, ctx.params[0]);
      await models.rooms.deleteRoom(ctx.session.userId, ctx.params[0])
    }
  }
  ctx.redirect(`/profile/${ctx.params[0]}`)
});

// Handle block user
router.post(/^\/profile\/block\/([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/, mw.isAuth, mw.check404, async (ctx) => {
  if ((await utils.isUserCompleted(ctx.params[0], ctx)) && ctx.request.body.type === 'block') {
    await models.users.addBlockedUser(ctx.session.userId, ctx.params[0])
    await models.rooms.deleteRoom(ctx.session.userId, ctx.params[0])
  }
  ctx.redirect(`/profile/${ctx.params[0]}`)
});

// Handle reported user
router.post(/^\/profile\/report\/([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/, mw.isAuth, mw.check404, async (ctx) => {
  if ((await utils.isUserCompleted(ctx.params[0], ctx)) && ctx.request.body.type === 'report') {
    try {
      let mailOptions = {
        from: 'matcha.42lyon@gmail.com',
        to: 'antoine.audrain@outlook.fr',
        subject: 'MATCHA REPORT !!!',
        text: `The user: ${ctx.params[0]} has been reported as fake account!!!`
      };
      await transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
          flash.registerFlash(ctx, `/profile/${ctx.params[0]}`, 'danger', "이메일 전송 문제(problem sending report email)")
        }
      });
    } catch(err) {
      flash.registerFlash(ctx, `/profile/${ctx.params[0]}`, 'danger', "이메일 전송 문제(problem sending report email)");
      return
    }
  }
  ctx.redirect(`/profile/${ctx.params[0]}`)
});

// Handle upload picture
router.post(`/profile`, body({multipart: true}), mw.isAuth, mw.check404, async (ctx) => {
  if (ctx.request.body.type === 'upload' && ctx.request.files.fileToUpload) {
    const avatar = ctx.request.files.fileToUpload;
    if (avatar.size > 2000000) {
      flash.registerFlash(ctx, '/profile', 'danger', "파일 크기 한도에 도달했습니다(file size limit reached)");
      return
    }
    const read = fs.readFileSync(avatar.path);
    let type = fileType(read);
    if (!type) {
      flash.registerFlash(ctx, '/profile', 'danger', "선택된 이미지 없음(none image selected)");
      return
    }
    let ext = type.ext;
    if (!['png', 'jpeg', 'jpg'].includes(ext)) {
      flash.registerFlash(ctx, '/profile', 'danger', "잘못된 파일 확장명(wrong file extension)");
      return
    }
    try {
      const imageId = uuidv4();
      const filename = `${imageId}.${ext}`;

      fs.createReadStream(avatar.path).pipe(fs.createWriteStream(__dirname + `/../../public/img/${filename}`));

      await models.pictures.invalidatePrimary(ctx.session.userId);

      await models.pictures.deleteOldest(ctx.session.userId);

      await models.pictures.insert(imageId, ctx.session.userId, filename);

      await models.users.setPictureInit(ctx.session.userId);

      flash.registerFlash(ctx, '/profile', 'success', "성공한 프로필 사진 업로드(profile picture uploaded with success)")

    } catch (err) {
      flash.registerFlash(ctx, '/profile', 'danger', err)
    }
  }
});

module.exports = router;