const client = require("../db/db");

const self = {

  like: async (userId, targetUserId) => {
    const {rows} = await client.query(`
          SELECT user_id
          FROM likes
          WHERE user_id = $1
          AND liked_user_id = $2;`,
        [userId, targetUserId]);
    if (rows.length) {
      await client.query(`
            UPDATE likes
            SET timestamp = now()
            WHERE user_id = $1
            AND liked_user_id = $2;`,
          [userId, targetUserId]);
    } else {
      await client.query(`
            INSERT INTO likes (user_id, liked_user_id)
            VALUES ($1, $2);`,
          [userId, targetUserId]);
    }
  },

  unLike: async (userId, targetUserId) => {
    const {rows} = await client.query(`
          DELETE
          FROM likes
          WHERE user_id = $1
            AND liked_user_id = $2`,
      [userId, targetUserId]);
    return rows
  },

  getLikedBy: async (userId, blockedList) => {
    const {rows} = await client.query(`
      SELECT l.user_id,
             u.username,
             (select picture
              from pictures
              where pictures.user_id = l.user_id
                AND pictures.primary = true) as primary_picture
      FROM likes l
             left join users u on u.user_id = l.user_id
      WHERE l.liked_user_id = $1
        AND l.user_id <> ANY ($2)
      ORDER BY l.timestamp DESC`, [userId, blockedList]);
    return rows
  },

  getMatch: async (userId, blockedList) => {
    const {rows} = await client.query(`
      SELECT l.user_id,
             u.username,
             (SELECT picture
              FROM pictures
              WHERE pictures.user_id = u.user_id
                AND pictures.primary = true) AS primary_picture
      from likes l
             LEFT JOIN users u ON u.user_id = l.user_id
      WHERE l.liked_user_id = $1
        AND (SELECT count(*)
             FROM likes l2
             WHERE l2.user_id = l.liked_user_id
               AND l2.liked_user_id = l.user_id) = 1
        AND l.user_id <> ANY ($2)`, [userId, blockedList]);
    return rows
  }

};

module.exports = self;