const client = require("../db/db");
const uuidv4 = require('uuid/v4');

const self = {

  deleteRoom: async (userId, targetUserId) => {
    await client.query(`
      DELETE FROM rooms WHERE user1 = $1 AND user2 = $2;`,
          [userId, targetUserId]);
    },

  createRoom: async (userId, targetUserId) => {
    await client.query(`
      INSERT INTO rooms(room_id, first_user, second_user)
      VALUES($1, $2, $3);`,[uuidv4(), userId, targetUserId]);
    },

  selectRoom: async (userId, targetUserId) => {
    const {rows} = await client.query(`
        SELECT room_id, first_user as first_user_id, second_user as second_user_id FROM rooms 
        WHERE (first_user = $1 AND second_user = $2) OR 
        (first_user = $2 AND second_user = $1);`, [userId, targetUserId]);
    if (rows.length > 0) {
      return rows[0]
    } else {
      return undefined
    }
  },
};

module.exports = self;