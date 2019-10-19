const models = require('../models');

const handleSocket = (verified, uuid, {lat, lng}, socket) => {

    models.geolocation.updateLocation(uuid, lat, lng)
        .catch(err => {
            console.log(`err set geolocation: ${err}`)
        })
};

module.exports = handleSocket