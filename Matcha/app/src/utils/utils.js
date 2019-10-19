const client = require("../db/db");
const crypto = require('crypto');
const flash = require('../utils/flash');
const jwt =  require('jsonwebtoken');

const self = {

  isUsername: async (username) => {
    const {rows} = await client.query(`SELECT COUNT(*) FROM users WHERE username = $1;`,
        [username]);
    if (rows[0].count > 0) {
      return true
    }
    return false
  },

  isUserVerified: async (userId) => {
    const {rows} = await client.query(`SELECT verified FROM users WHERE user_id = $1;`,
      [userId]);
    if (rows[0].verified) {
      return true
    }
    return false
  },

  usernameExist: async (username, userId) => {
    if (userId) {
      const {rows} = await client.query(`SELECT username FROM users WHERE user_id != $1 AND username = $2`,
        [userId, username]);
      return (rows.length > 0)
    } else {
      const {rows} = await client.query(`SELECT username FROM users WHERE username = $1`,
        [username]);
      return (rows.length > 0)
    }
  },

  hashSHA512: async (password) => {
    return (crypto.createHash('sha512').update(password).digest().toString('hex'))
  },

  tagsCheck: (tagsList) => {
    if (tagsList)
      return tagsList.match(/[\w.-]+/g).map(String)
    else
      return []
  },

  isUserLiked: async (userId, likedUserId) => {
    const {rows} = await client.query(`SELECT COUNT(*) FROM likes WHERE user_id = $1 AND liked_user_id = $2`, [userId, likedUserId]);
    return rows[0].count > 0
  },

  hasUserLikedMe: async (userId, likedUserId) => {
    const {rows} = await client.query(`SELECT COUNT(*) FROM likes WHERE user_id = $1 AND liked_user_id = $2`, [likedUserId, userId]);
    return rows[0].count > 0
  },

  isMatch: async (userId, targetUserId) => {
    if ((await self.isUserLiked(userId, targetUserId)) && (await self.hasUserLikedMe(userId, targetUserId))) {
      return(true)
    } else {
      return(false)
    }
  },

  isUserCompleted: async (userId, ctx) => {
    const {rows} = await client.query(`SELECT account_completed, picture_init FROM users WHERE user_id = $1;`,
      [userId]);
    if (rows.length && (!rows[0].account_completed || !rows[0].picture_init)) {
      flash.registerFlash(ctx, '/profile', 'danger', "이 계정은 아직 사용할 수 없습니다(this account is not available yet)")
      return(false)
    } else {
      return(true)
    }
  },

  signJwt: (userId) => {
    return jwt.sign({
      exp: Math.floor(Date.now() / 1000) + (60 * 6000000),
      data: userId
    }, 'Park Bo-young');
  },

  verifyJwt: (token) => {
    try {
      return jwt.verify(token, 'Park Bo-young');
    } catch(err) {
      return undefined
    }
  }

};

module.exports = self;