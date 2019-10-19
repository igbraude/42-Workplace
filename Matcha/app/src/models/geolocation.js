const client = require("../db/db");

const self = {

    initLocation: async (userId) => {
        await client.query(`
          INSERT INTO geolocation (user_id)
          VALUES ($1);`,
            [userId]);
    },

    updateLocation: async (userId, lat, lng) => {
        await client.query(`
          UPDATE geolocation
          SET lat = $1, lng = $2
          WHERE user_id = $3;`,
            [lat, lng, userId]);
    },

    getUserLocation: async (userId) => {
        const {rows} = await client.query(`
          SELECT lat, lng
          FROM geolocation
          WHERE user_id = $1`,
            [userId]);
        return rows[0]
    },

};

module.exports = self;