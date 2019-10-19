const client = require("../db/db");
const utils = require('../utils/utils');
const { format, render, cancel, register } = require("timeago.js");

const popRange = [0, 25, 50, 75, 100];

const self = {

  getUsername: async (userId) => {
    const {rows} = await client.query(`
            SELECT username
            FROM users
            WHERE user_id = $1;`,
      [userId]);
    return rows[0].username
  },

  // , commonTags, distance
  getMatchProfiles: async (page, userId, blockedList, targetedGender, myGender, age, popularity, distance, tagsList) => {

    // prepare array for gender check
    targetedGender = targetedGender === 'bisexual' ? ['male', 'female', 'bisexual'] : [targetedGender, 'bisexual'];

    // when array empty push dummy to not break the ANY
    if (blockedList.length === 0) {
      blockedList.push('00000000-0000-0000-0000-000000000000');
    }

    // when pass one integer, put it in array
    if (typeof age === "string" || "integer") {
      age = [age]
    }

    // when pass one integer, put it in array
    if (typeof tagsList === "string") {
      tagsList = [tagsList]
    }

    let pageStart = (page - 1) * 6;

    const highPopRange = popRange[+popularity];
    const lowPopRange = popRange[+popularity - 1];

    const {rows} = await client.query(`
      SELECT user_id,
       account_completed,
       popularity_score,
       picture_init,
       username,
       gender,
       sexual_orientation,
       tags,
       age,
       (select picture
        from pictures
        where pictures.user_id = u.user_id
          AND pictures.primary = true) as primary_picture,
       (SELECT round((point(lng, lat) <@>
          point((SELECT lng FROM geolocation WHERE user_id = u.user_id), (SELECT lat FROM geolocation WHERE user_id = u.user_id))) *
          1.60934)
          FROM geolocation
          WHERE user_id = $1) as distance
      FROM users u
      WHERE user_id <> $1
        AND user_id <> ANY ($2)
        AND picture_init = true
        AND account_completed = true
        AND gender = ANY ($3)
        AND sexual_orientation = $4
        AND age = ANY ($5)
        AND (SELECT round((point(lng, lat) <@>
                         point((SELECT lng FROM geolocation WHERE user_id = u.user_id), (SELECT lat FROM geolocation WHERE user_id = u.user_id))) *
                        1.60934)
           FROM geolocation
           WHERE user_id = $1) < $6
        AND tags && $7
        AND popularity_score BETWEEN $8 AND $9
        LIMIT 6
        OFFSET $10
           ;`, [userId, blockedList, targetedGender, myGender, age, distance, tagsList, lowPopRange, highPopRange, pageStart]);
    return rows.map(e => {
      e.tags = utils.tagsCheck(e.tags);
      return e
    })
  },

  getRawProfile: async (userId) => {
    const {rows} = await client.query(`
      SELECT *
      FROM users
      WHERE user_id = $1`, [userId])
    return rows[0]
  },

  getUserPopularityRange: async (userId) => {
    const {rows} = await client.query(`
      SELECT popularity_score
      FROM users
      WHERE user_id = $1`, [userId])
    const popScore = rows[0].popularity_score
    if (popScore) {
      if (popScore <= 25) {
        return 1
      } else if (popScore <= 50) {
        return 2
      } else if (popScore <= 75) {
        return 3
      }else if (popScore <= 100) {
        return 4
      }
    }
    return false
  },

  addBlockedUser: async (userId, blockedUserId) => {
    const {rows} = await client.query(`
            UPDATE users
            SET blocked = array_append(blocked, $1)
            WHERE user_id = $2;`,
      [blockedUserId, userId]);
    return rows
  },

  setPictureInit: async (userId) => {
    const {rows} = await client.query(`
          UPDATE users
          SET picture_init = true
          WHERE user_id = $1;`,
      [userId]);
    return rows
  },

  getEditUser: async (userId, tagsList) => {
    const {rows} = await client.query(`
          SELECT username,
                 email,
                 first_name,
                 last_name,
                 age,
                 gender,
                 sexual_orientation,
                 bio,
                 tags,
                 blocked
          FROM users
          WHERE user_id = $1`,
      [userId]);
    return rows.map(e => {
      e.tags = utils.tagsCheck(e.tags)
      e.tags = tagsList.map((tag) => {
        return ({name: tag, selected: e.tags.includes(tag)})
      });
      return e
    })[0]
  },

  passwordChange: async (password, userId) => {
    const {rows} = await client.query(`
          UPDATE users
          SET password = $1
          WHERE user_id = $2`,
      [await utils.hashSHA512(password), userId]);
    return rows
  },

  updateUser: async (username, first_name, last_name, age, email, gender, sexual_orientation, bio, tags, userId) => {
    const {rows} = await client.query(`
          UPDATE users
          SET username           = $1,
              first_name         = $2,
              last_name          = $3,
              age                = $4,
              email              = $5,
              gender             = $6,
              sexual_orientation = $7,
              bio                = $8,
              tags               = $9,
              account_completed  = true
          WHERE user_id = $10`,
      [username, first_name, last_name, age, email, gender, sexual_orientation, bio, tags, userId]);
    return rows
  },

  getUser: async (userId) => {
    const {rows} = await client.query(`
          SELECT username,
                 email,
                 first_name,
                 last_name,
                 gender,
                 sexual_orientation,
                 bio,
                 tags,
                 age,
                 account_completed,
                 (select picture
                  from pictures
                  where pictures.user_id = users.user_id
                    AND pictures.primary = true)    as picture_primary,
                 ARRAY(select picture
                       from pictures
                       where pictures.user_id = users.user_id
                         AND pictures.primary = false
                       ORDER BY creation_date DESC) as pictures
          FROM users
          WHERE user_id = $1`,
        [userId]);
    return rows.map(e => {
      e.tags = utils.tagsCheck(e.tags)
      return e
    })[0]
  },

  getPublicUser: async (userId) => {
    const {rows} = await client.query(`
          SELECT user_id,
                 username,
                 first_name,
                 last_name,
                 gender,
                 sexual_orientation,
                 account_completed,
                 bio,
                 tags,
                 connected,
                 "timestamp",
                 age,
                 (select picture
                  from pictures
                  where pictures.user_id = users.user_id
                    AND pictures.primary = true)    as picture_primary,
                 ARRAY(select picture
                       from pictures
                       where pictures.user_id = users.user_id
                         AND pictures.primary = false
                       ORDER BY creation_date DESC) as pictures
          FROM users
          WHERE user_id = $1`,
        [userId]);
    return rows.map(e => {
      e.tags = utils.tagsCheck(e.tags);
      e.timestamp = format(e.timestamp);
      return e
    })[0]
  },

  getPicture: async (userId) => {
    const {rows} = await client.query(`
      SELECT picture FROM pictures
      WHERE user_id = $1`, [userId])
    return rows[0]
  },

};

module.exports = self;