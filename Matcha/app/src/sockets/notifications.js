const models = require("../models");
const io = require('./socket');


const self = {
  like: async (userId, targetUserId) => {
    const message = `<strong>${await models.users.getUsername(userId)}</strong> 님이 내 프로필을 좋아했습니다(like your profile)`;
    io.broadcastToUserId(targetUserId, message);

    models.notifications.newNotification(targetUserId, userId, message)
  },

  visit: async (userId, targetUserId) => {
    const message = `<strong>${await models.users.getUsername(userId)}</strong> 님이 내 프로필을 보았습니다(has seen your profile)`;
    io.broadcastToUserId(targetUserId, message);

    models.notifications.newNotification(targetUserId, userId, message)
  },

  match: async (userId, targetUserId) => {
    const message = `<strong>${await models.users.getUsername(userId)}</strong> 너와 일치 해(you got a match)`;
    io.broadcastToUserId(targetUserId, message);

    models.notifications.newNotification(targetUserId, userId, message)
  },

  unmatch: async (userId, targetUserId) => {
    const message = `<strong>${await models.users.getUsername(userId)}</strong> 가 당신의 경기를 취소했습니다(revoke your match)`;
    io.broadcastToUserId(targetUserId, message);

    models.notifications.newNotification(targetUserId, userId, message)
  },
};

module.exports = self;