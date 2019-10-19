const client = require("../db/db");

/*
    All Messages request  need a Limit , offset. On scroll request for next message is send
 */

const self = {

    allMessages: async (room_id) => {
        console.log(room_id)
        const {rows} = await client.query(`
        SELECT * FROM messages WHERE room_id = $1
        ORDER BY date DESC;` ,
        [room_id]);
        return rows
    },

    addMessages: async (username, target_username, message, room_id, message_id) => {
        const {rows} = await client.query(`
        INSERT INTO messages (username, receiver, message, room_id)
        VALUES ($1, $2, $3, $4, $5);`,
            [username, target_username, message, room_id, message_id]);
        return rows
    },
};

module.exports = self;