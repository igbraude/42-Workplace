const http = require('http').createServer();
const io = require('socket.io')(http);
const utils = require('../utils/utils');
const client = require("../db/db");
const models = require("../models");

const channel = {
  CHAT_MESSAGE: "chat:message",
};

const handleSocket = (socket, self, getUserId) => {

  socket.on(channel.CHAT_MESSAGE, async ({message, receiver}) => {

    let sender = getUserId();
    if (sender === undefined) return;

    const room = await getRoom(sender, receiver);

    if (room !== undefined) {
      //******************DATABASE MESSSAGE*********************//
      await models.messages.insertMessage(message, room)
      self.getSocketsFromUuid(receiver).concat(self.getSocketsFromUuid(sender))
        .forEach(e => {
          e.emit(channel.CHAT_MESSAGE, {
            message,
            room
          })
        })
      try {
        const message = `you received a new message from <strong>${room.sender.username}</strong>`
        self.broadcastToUserId(receiver, message, socket);
        models.notifications.newNotification(receiver, sender, message)
      } catch (e) {
        console.log(`Message Notification Error: ${e}`)
      }
    }
  });
};


const getRoom = async (sender, receiver) => {

  let room = await models.rooms.selectRoom(sender, receiver);
  if (room !== undefined) {

    room = {
      room_id: room.room_id,
      receiver: {
        id: receiver,
        username: await models.users.getUsername(receiver),
      },
      sender: {
        id: sender,
        username: await models.users.getUsername(sender),
      }
    };
    return room;
  }
  return undefined
};

module.exports = handleSocket;

