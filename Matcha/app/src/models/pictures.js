const client = require("../db/db");

const self = {

  invalidatePrimary: async (userId) => {
    const {rows} = await client.query(`
          UPDATE pictures
          SET "primary" = false
          WHERE user_id = $1
            AND "primary" = true;`,
      [userId]);
    return rows
  },

  // Always delete the fifth picture of the user
  deleteOldest: async (userId) => {
    const {rows} = await client.query(`
          DELETE
          FROM pictures
          WHERE picture_id in
                (SELECT picture_id
                 FROM pictures
                 WHERE "primary" = false
                   AND user_id = $1
                   AND (SELECT count(*) FROM pictures WHERE user_id = $1) >= 5
                 ORDER BY creation_date
                 LIMIT 1
                );`,
      [userId]);
    return rows
  },

  insert: async (imageId, userId, filename) => {
    const {rows} = await client.query(`
          INSERT INTO pictures (picture_id, user_id, picture, "primary")
          VALUES ($1, $2, $3, true);`,
      [imageId, userId, `/img/${filename}`]);
    return rows
  }

};

module.exports = self;