const Router = require("koa-router");
const validator = require('validator');
const utils = require('../utils/utils');
const flash = require('../utils/flash');
const mw = require('./middlewares');
const models = require('../models');

const router = new Router();

const tagsList = ['Sloth', 'Lust', 'Wrath', 'Envy', 'Pride', 'Gluttony', 'Greed'];

// Render edit profile
router.get(`/profile/edit`, mw.isAuth, async (ctx) => {
  try {
    await ctx.render("profileEdit.hbs", {
      flash: await flash.loadFlash(ctx),
      userId: ctx.session.userId,
      user: await models.users.getEditUser(ctx.session.userId, tagsList)
    });
  } catch (err) {
    console.log(err);
    flash.registerFlash(ctx, '/profile/edit', 'danger', err)
  }
});

// Edit profile
router.post(`/profile/edit`, mw.isAuth, async (ctx) => {
  if (ctx.request.body.type === 'alterProfile') {
    const fields = ["username", "first_name", "last_name", "age", "email", "gender", "sexual_orientation", "bio", "tags"];
    for (let field of fields) {
      if (!ctx.request.body.hasOwnProperty(field)) {
        flash.registerFlash(ctx, '/profile/modify', 'danger', "잘못된 입력란(invalid field.s)");
        return
      }
    }
    const isEmpty = Object.keys(ctx.request.body).reduce((accumulator, key) => {
      if (key !== 'tags' && validator.isEmpty(ctx.request.body[key]))
        return (true);
      else
        return (accumulator)
    }, false);
    const {username, first_name, last_name, age, email, gender, sexual_orientation, bio, tags} = ctx.request.body;
    if (isEmpty) {
      flash.registerFlash(ctx, '/profile/edit', 'danger', "빈 필드(empty field.s)");
      return
    }
    if (await utils.usernameExist(username, ctx.session.userId)) {
      flash.registerFlash(ctx, '/profile/edit', 'danger', "사용자 이름은 이미 사용 중입니다(the username is already taken)");
      return
    }
    if (age < 18 || age > 25) {
      flash.registerFlash(ctx, '/connexion', 'danger', "생년월일(invalid age)");
      return
    }
    if (!validator.isEmail(email)) {
      flash.registerFlash(ctx, '/profile/edit', 'danger', "잘못된 이메일(invalid email)");
      return
    }
    if (!["male", "female", "bisexual"].includes(gender)) {
      flash.registerFlash(ctx, '/profile/edit', 'danger', "성별이 잘못되었습니다(invalid gender)");
      return
    }
    if (!["male", "female", "bisexual"].includes(sexual_orientation)) {
      flash.registerFlash(ctx, '/profile/edit', 'danger', "성적 취향이 잘못되었습니다(invalid sexual orientation)");
      return
    }
    if (bio.length > 140) {
      flash.registerFlash(ctx, '/profile/edit', 'danger', "보이 너무 깁니다(bio too long)");
      return
    }
    for (let tag of tags) {
      if (!tagsList.includes(tag)) {
        flash.registerFlash(ctx, '/profile/edit', 'danger', "잘못된 태그(invalid tags)")
        return
      }
    }
    try {
      await models.users.updateUser(username, first_name, last_name, age, email, gender, sexual_orientation, bio, tags, ctx.session.userId);
      flash.registerFlash(ctx, '/profile', 'success', "성공으로 수정 된 계정(account modified with success)")
    } catch (err) {
      flash.registerFlash(ctx, '/profile/edit', 'danger', err)
    }


  } else if (ctx.request.body.type === 'changePassword') {
    const {password} = ctx.request.body;
    if (!ctx.request.body.hasOwnProperty("password")) {
      flash.registerFlash(ctx, '/profile/modify', 'danger', "누락 된 암호(missing password)");
      return
    }
    const mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
    if (!password.match(mediumRegex)) {
      flash.registerFlash(ctx, '/profile/edit', 'danger', "약한 암호(weak password)");
      return
    }
    await models.users.passwordChange(password, ctx.session.userId);
    flash.registerFlash(ctx, '/profile', 'success', "성공으로 수정 된 비밀번호(password modified with success)")


  } else if (ctx.request.body.type === 'changeLocation') {
    const {lat, lng} = ctx.request.body;
    const coordinatesRegex = new RegExp("^-?[0-9]{1,3}(?:\\.[0-9]{1,10})?$");
    if (!lat.match(coordinatesRegex) || !lng.match(coordinatesRegex)) {
      flash.registerFlash(ctx, '/profile/edit', 'danger', "좌표 형식이 잘못되었습니다(Wrong coordinates format)");
      return
    }
    models.geolocation.updateLocation(ctx.session.userId, lat, lng);
    flash.registerFlash(ctx, '/profile', 'success', "성공적으로 수정 된 위치 정보(geolocation modified with success)")
  }
});

module.exports = router;