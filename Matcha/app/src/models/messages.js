const client = require("../db/db");
const uuidv4 = require('uuid/v4');
const { format, render, cancel, register } = require("timeago.js");

const self = {
    insertMessage: async (message, room) => {
      await client.query(`
      INSERT INTO messages(sender, receiver, message, room_id, message_id)
      VALUES ($1, $2, $3, $4, $5);`,[room.sender.username, room.receiver.username, message, room.room_id, uuidv4()]);
    },

    selectMessages: async (room) => {
        if (room != undefined) {
            const {rows} = await client.query(`
                SELECT * FROM messages 
                WHERE room_id = $1
                ORDER BY date;`, [room.room_id]);
            return rows.map(e => {
                e.date = format(e.date)
                return e
            })

        }else
            return undefined
    },
};

module.exports = self;