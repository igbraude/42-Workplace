const client = require("../db/db");

const self = {

  newNotification: async (userId, triggerUserId, message) => {
    await client.query(`
          INSERT INTO notifications (user_id, trigger_user_id, message)
          VALUES ($1, $2, $3);`,
      [userId, triggerUserId, message]);
  },

  getNotification: async (userId) => {
    const {rows} = await client.query(`
          SELECT
          FROM likes user_id,
               trigger_user_id,
               message
          WHERE user_id = $1
          ORDER BY creation_date DESC;`,
      [userId]);
    return rows[0]
  },

};

module.exports = self;