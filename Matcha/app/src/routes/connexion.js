const Router = require("koa-router");
const client = require("../db/db");
const uuidv4 = require('uuid/v4');
const crypto = require('crypto');
const models = require('../models');
const nodemailer = require('nodemailer');
const utils = require('../utils/utils');
const flash = require('../utils/flash');
const validator = require('validator');
const fetch = require('node-fetch');
const mw = require('./middlewares');

const router = new Router();

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'matcha.42lyon@gmail.com',
    pass: 'e7PYuP<d'
  }
});

// render connexion screen
router.get("/connexion", mw.check404, async (ctx) => {
  await ctx.render("connexion.hbs", {
    flash: await flash.loadFlash(ctx),
    userId: ctx.session.userId,
    disableLinks: true,
    connexion: true
  });
});

// handle connexion request
router.post(`/connexion`, mw.check404, async (ctx) => {
  if (ctx.request.body.type === 'login') {
    const {username, password} = ctx.request.body;

    const {rows} = await client.query(`SELECT user_id, verified FROM users WHERE username = $1 AND password = $2;`,
      [username, await utils.hashSHA512(password)]);

    if (rows.length && rows[0].verified) {

      ctx.session.userId = rows[0].user_id;

      const regex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;
      const ip = ctx.request.ip;

      // Check if user IP correct
      if (ip.match(regex)) {
        // Get geolocation from IP
        const res = await fetch(`http://api.ipstack.com/${ip}?access_key=d46ad43e66157ab1609b7ee72464b7a9`);
        const data = await res.json();
        // Insert geolocation in DB
        if (data.latitude || data.longitude) {
          await models.geolocation.updateLocation(ctx.session.userId, data.latitude, data.longitude);
        }
      }


      await client.query(`UPDATE users SET connected = true WHERE user_id = $1;`,
        [rows[0].user_id]);

      let jwt = utils.signJwt(rows[0].user_id);
      ctx.cookies.set('jwt', jwt, { signed: true, httpOnly: false });

      flash.registerFlash(ctx, '/profile', 'success', "다시 환영(Welcome back)");
    } else {
    flash.registerFlash(ctx, '/connexion', 'danger', "잘못된 사용자 이름 또는 암호(wrong username or password)")
    }
  }

  else if (ctx.request.body.type === 'register') {
    const {username, first_name, last_name, age, email, password, re_pass} = ctx.request.body;
    if (!username) {
      flash.registerFlash(ctx, '/connexion', 'danger', "사용자 이름 누락(missing username)")
      return
    }
    const {rows} = await client.query(`SELECT username FROM users WHERE username = $1;`,
      [username]);
    if (rows.length) {
      flash.registerFlash(ctx, '/connexion', 'danger', "이미 사용중인 이름입니다(username already taken)")
      return
    }
    if (!first_name) {
      flash.registerFlash(ctx, '/connexion', 'danger', "이름이 필요하다(first name required)")
      return
    }
    if (!last_name) {
      flash.registerFlash(ctx, '/connexion', 'danger', "성이 필요하다(last name required)")
      return
    }
    if (age < 18 || age > 25) {
      flash.registerFlash(ctx, '/connexion', 'danger', "생년월일(invalid age)")
      return
    }
    if (!email) {
      flash.registerFlash(ctx, '/connexion', 'danger', "이메일이 필요합니다(email required)")
      return
    }
    if (!validator.isEmail(email)) {
      flash.registerFlash(ctx, '/connexion', 'danger', "잘못된 형식의 이메일(wrong format email)")
      return
    }
    if (!password || !re_pass) {
      flash.registerFlash(ctx, '/connexion', 'danger', "비밀번호가 필요합니다(password required)")
      return
    }
    if (password !== re_pass) {
      flash.registerFlash(ctx, '/connexion', 'danger', "비밀번호가 일치하지 않습니다(password don't match)")
      return
    }
    const mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
    if (!password.match(mediumRegex)) {
      flash.registerFlash(ctx, '/connexion', 'danger', "약한 암호, 대문자, 소문자 및 숫자 필요(weak password, need uppercase, lowercase and number)")
      return
    }
    const confirmation_token = uuidv4();
    const userId = uuidv4();
    await client.query(`INSERT INTO users (user_id, username, age, password, email, verification_token, first_name, last_name) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
      [userId, username, age, await utils.hashSHA512(password), email, confirmation_token, first_name, last_name]);
    try {
      let mailOptions = {
        from: 'matcha.42lyon@gmail.com',
        to: email,
        subject: 'Sending Email using Node.js',
        text: `Confirm your account by clicking on the link: http://localhost:3000/verification/${confirmation_token}`
      };
      await transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
          flash.registerFlash(ctx, '/connexion', 'danger', "이메일 전송 문제(problem sending email)")
        }
      });
    } catch(err) {
      flash.registerFlash(ctx, '/connexion', 'danger', "이메일 전송 문제(problem sending email)")
      return
    }

    models.geolocation.initLocation(userId);

    flash.registerFlash(ctx, '/connexion', 'success', "사용자가 성공적으로 생성되었습니다(user created successfully)")
  }

  else if (ctx.request.body.type === 'forgotPassword') {
    const {email} = ctx.request.body;
    try {
      const {rows} = await client.query(`SELECT verification_token FROM users WHERE email = $1;`,
        [email]);
      let mailOptions = {
        from: 'matcha.42lyon@gmail.com',
        to: email,
        subject: 'Sending Email using Node.js',
        text: `Change your password by clicking on th link: http://localhost:3000/user/change-password/${rows[0].verification_token}`
      };
      await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          flash.registerFlash(ctx, '/connexion', 'danger', "이메일 전송 문제(problem sending email)")
        }
      });
    } catch(err) {
      flash.registerFlash(ctx, '/connexion', 'danger', "이메일 전송 문제(problem sending email)")
      return
    }
    flash.registerFlash(ctx, '/connexion', 'success', "암호가 성공적으로 변경되었습니다(password changed successfully)")
  }
});

module.exports = router;
