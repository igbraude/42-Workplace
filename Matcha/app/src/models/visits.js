const client = require("../db/db");

const self = {

  getPopularityScore: async (userId) => {
    const {rows} = await client.query(`
        SELECT popularity_score
        FROM users
        WHERE user_id = $1;`, [userId])
    return rows[0].popularity_score
  },

  setPopularityScore: async (userId) => {
    const visitedCount = (await client.query(`SELECT COUNT(*) FROM visits WHERE visited_user_id = $1`, [userId])).rows[0].count
    const allUserCount = (await client.query(`SELECT COUNT(*) FROM users`)).rows[0].count
    if (visitedCount === "0" || allUserCount === "0") {
      return 0
    } else {
      const likeCount = (await client.query(`SELECT COUNT(*) FROM likes WHERE liked_user_id = $1`, [userId])).rows[0].count
      const popularityScore = ((((likeCount/allUserCount)/(visitedCount/allUserCount))*100).toFixed(1))
      await client.query(`
        UPDATE users
        SET popularity_score = $1
        WHERE user_id = $2;`, [popularityScore, userId])
    }
  },

  newVisit: async (visitedUserId, visitorUserId) => {
    const {rows} = await client.query(`
          SELECT visited_user_id
          FROM visits
          WHERE visited_user_id = $1
          AND visitor_user_id = $2;`,
        [visitedUserId, visitorUserId]);
    if (rows.length) {
      await client.query(`
            UPDATE visits
            SET date = now()
            WHERE visited_user_id = $1
            AND visitor_user_id = $2;`,
          [visitedUserId, visitorUserId]);
    } else {
      await client.query(`
          INSERT INTO visits (visited_user_id, visitor_user_id)
          VALUES ($1, $2);
--           ON CONFLICT (
--              visited_user_id,
--              visitor_user_id)
--              DO UPDATE SET "date" = now();`,
          [visitedUserId, visitorUserId]);
    }
  },

  getVisitors: async (userId, blockedList) => {
    const {rows} = await client.query(`
      SELECT v.visitor_user_id as user_id,
             u.username,
             (select picture
              from pictures
              where pictures.user_id = v.visitor_user_id
                AND pictures.primary = true) as primary_picture
      FROM visits v
             left join users u on u.user_id = v.visitor_user_id
      WHERE v.visited_user_id = $1
      AND user_id <> ANY ($2)
      ORDER BY v.date DESC`, [userId, blockedList]);
    return rows
  }

};

module.exports = self;