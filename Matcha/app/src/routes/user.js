const Router = require("koa-router");
const validator = require('validator');
const client = require("../db/db");
const uuidv4 = require('uuid/v4');
const crypto = require('crypto');
const utils = require('../utils/utils');
const flash = require('../utils/flash');
const mw = require('./middlewares');

const router = new Router();

// disconnect user
router.get("/user/disconnect", mw.isAuth, mw.check404, async (ctx) => {
  await client.query(`UPDATE users SET connected = false, timestamp = now() WHERE user_id = $1;`,
    [ctx.session.userId]);
  delete ctx.session.userId;
  ctx.redirect('/connexion');
});

// Update the profile to verified
router.get(/^\/verification\/([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/, mw.check404, async (ctx) => {
  try {
    await client.query(`UPDATE users SET verified = true, verification_token = $1 WHERE verification_token = $2;`,
      [uuidv4(), ctx.params[0]]);
    ctx.redirect('/connexion');
  } catch(err) {
    console.log(`ERROR CAN'T FIND THE USER: ${err}`);
  }
});

// render the forgotPassword page
router.get(/^\/user\/change-password\/([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/, mw.check404, async (ctx) => {
  await ctx.render("recoverPassword.hbs", {
    flash: await flash.loadFlash(ctx)
  });
});

// apply the new password
router.post(/^\/user\/change-password\/([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/, mw.check404, async (ctx) => {
  const {newPassword, confirmNewPassword} = ctx.request.body;
  if (ctx.request.body.type === 'changePassword') {
    if (!newPassword || !confirmNewPassword) {
      flash.registerFlash(ctx, `/user/change-password/${ctx.params[0]}`, 'danger', "비밀번호가 필요합니다(password required)")
      return
    }
    if (newPassword !== confirmNewPassword) {
      flash.registerFlash(ctx, `/user/change-password/${ctx.params[0]}`, 'danger', "비밀번호가 일치하지 않습니다(new password don't match)")
      return
    }
    const mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
    if (!newPassword.match(mediumRegex)) {
      flash.registerFlash(ctx, `/user/change-password/${ctx.params[0]}`, 'danger', "약한 암호, 대문자, 소문자 및 숫자 필요(weak password, need uppercase, lowercase and number)")
      return
    }
    await client.query(`UPDATE users SET password = $1, verification_token = $2 WHERE verification_token = $3;`,
      [await utils.hashSHA512(newPassword), uuidv4(), ctx.params[0]]);
    flash.registerFlash(ctx, '/connexion', 'success', "암호가 성공적으로 복구되었습니다(password recovered successfully)")
  } else {
    console.log('ERR SET NEW PASSWORD')
  }
});

// Delete user
router.get(`/user/delete`, mw.isAuth, mw.check404, async (ctx) => {
  try {
    await Promise.all([
      client.query(`DELETE FROM users WHERE user_id = $1;`,
        [ctx.session.userId]),
      client.query(`DELETE FROM pictures WHERE user_id = $1;`,
        [ctx.session.userId])
    ])
    delete ctx.session.userId;
    flash.registerFlash(ctx, '/connexion', 'success', "프로필이 성공적으로 삭제되었습니다(profile deleted successfully)")
  } catch (err) {
    flash.registerFlash(ctx, '/connexion', 'danger', "사용자 프로필 삭제 금지(can't delete user profile)")
  }
});

module.exports = router;