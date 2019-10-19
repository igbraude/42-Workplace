const client = require("../db/db");
const flash = require('../utils/flash');

module.exports = {

  isAuth: async (ctx, next) => {
    if (!ctx.session.userId) {
      flash.registerFlash(ctx, '/connexion', 'danger', "연결된 사용자 없음(no user connected)")
    } else {
      await next()
    }
  },

  isCompleted: async (ctx, next) => {
    const {rows} = await client.query(`SELECT account_completed, picture_init FROM users WHERE user_id = $1;`,
      [ctx.session.userId]);
    if (rows.length && rows[0].account_completed === false && rows[0].picture_init === false) {
      flash.registerFlash(ctx, '/profile', 'danger', "귀하의 계정이 완료되지 않았습니다(your account isn't completed)")
    } else {
      await next()
    }
  },

  check404: async (ctx, next) => {
    try {
      await next();
      const status = ctx.status || 404;
      if (status === 404) {
        await ctx.render('404.hbs')
      }
    } catch (err) {
      console.log('404 MIDDLEWARE ERROR')
    }
  }

};