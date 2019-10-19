const http = require('http').createServer();
const io = require('socket.io')(http);
const utils = require('../utils/utils');
const client = require("../db/db");
const models = require("../models");

const geolocationHandler = require("./geolocation");
const chatHandler = require("./chat");

let uuidToSockets = {};
let queue = [];

io.on('connection', function (socket) {

  let verified = false;
  let uuid = undefined;

  socket.on("geolocation", async (geolocation) => geolocationHandler(verified, uuid, geolocation, socket));

  chatHandler(socket, self, () => uuid);

  socket.on("init", async jwt => {
    if (!verified) {
      const decoded = utils.verifyJwt(jwt);
      if (decoded === undefined) {
        return
      }
      const uuidFromData = decoded.data;
      self.registerSocket(uuidFromData, socket);
      uuid = uuidFromData;
      verified = true;
      await client.query(`UPDATE users SET connected = true WHERE user_id = $1;`,
        [uuid]);
    }
  });

  socket.on("disconnect", async () => {
    const userId = uuid;
    if (verified) {
      self.unRegisterSocket(uuid, socket);
      verified = false;
      uuid = undefined;
    }
    if (self.getSocketsFromUuid(userId).length === 0) {
      await client.query(`UPDATE users SET connected = false, timestamp = now() WHERE user_id = $1;`,
        [userId]);
    }
  });
});

const self = {

  queueAdd: (userId, message) => {
    queue.push({userId, message})
  },

  registerSocket: (uuid, socket) => {
    if (!uuidToSockets[uuid]) {
      uuidToSockets[uuid] = [socket]
    } else {
      uuidToSockets[uuid] = [socket, ...uuidToSockets[uuid]]
    }
  },

  unRegisterSocket: (uuid, socket) => {
    if (uuidToSockets[uuid]) {
      uuidToSockets[uuid] = uuidToSockets[uuid].filter(s => socket.id !== s.id)
      if (!uuidToSockets[uuid].length) {
        delete uuidToSockets[uuid]
      }
    }
  },

  queueCheck: () => {
    queue = queue.filter(notification => {
      const sockets = self.getSocketsFromUuid(notification.userId);
      if (sockets.length >= 1) {
        self.broadcastToUserId(notification.userId, notification.message);
        return false
      }
      return true
    })
  },

  broadcastToUserId: (userId, message) => {
    const socketFromUuid = self.getSocketsFromUuid(userId);
    if (socketFromUuid.length === 0) {
      self.queueAdd(userId, message)
    }
    socketFromUuid.forEach((socket) => {
      socket.emit("notifications", message)
    })
  },

  getSocketsFromUuid: (uuid) => {
    if (uuidToSockets[uuid]) {
      return (uuidToSockets[uuid])
    } else {
      return []
    }
  },

};


http.listen(process.env['SOCKET_PORT'], function () {
  console.log('listening socket.io server on :3001');
});

module.exports = self;
