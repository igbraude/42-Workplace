/*

            Route for chat, 2 route : first --> GET request to list all the users match
                                                POST request for the chat Box

 */
const Router = require("koa-router");
const fileType = require("file-type");
const body = require("koa-body");
const fs = require("fs");
const client = require("../db/db");
const uuidv4 = require('uuid/v4');
const crypto = require('crypto');
const utils = require('../utils/utils');
const flash = require('../utils/flash');
const validator = require('validator');
const mw = require('./middlewares');
const models = require('../models');
const io = require('../sockets/socket')
const notification = ('../sockets/notification')

const router = new Router();

const tagsList = ['Sloth', 'Lust', 'Wrath', 'Envy', 'Pride', 'Gluttony', 'Greed'];

/* chat room with an other users
*/

router.get(/^\/chat\/([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/, mw.isAuth, async (ctx) => {
    try {
        let userIntel = await models.users.getEditUser(ctx.session.userId, tagsList);

        let blockedList = userIntel.blocked;
        if (blockedList.length === 0) {
            blockedList.push('00000000-0000-0000-0000-000000000000');
        }

        await ctx.render("chat.hbs", {
            userId: ctx.session.userId,
            usersMatch: await models.likes.getMatch(ctx.session.userId, userIntel.blocked),
            myName: await models.users.getUsername(ctx.session.userId)
        });

    } catch (err) {
        console.log(`Public profile error: ${err}`);
        flash.registerFlash(ctx, '/profile', 'danger', "사용자가 존재하지 않습니다(user doesn't exist)")
    }
})

/* method post, chat room this is for fetch stuff rend chatMessage.hbs
*/

router.post(/^\/chat\/([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/, mw.isAuth, async (ctx) => {
    try
    {

        let messages = await models.messages.selectMessages(await models.rooms.selectRoom(ctx.session.userId, ctx.params[0]))
        let targetPicture = (await models.users.getPicture(ctx.params[0])).picture.toString()
        let myName = await models.users.getUsername(ctx.session.userId)

        messages = messages.map((element) => {
            return {...element, picture: targetPicture, myName: myName}
        })
        await ctx.render("chatMessage.hbs", {
            userId: ctx.session.userId,
            myName: await models.users.getUsername(ctx.session.userId),
            room: await models.rooms.selectRoom(ctx.session.userId, ctx.params[0]),
            pic: targetPicture,
            messages: messages,
        })
    } catch (err) {
        console.log(`Public profile error: ${err}`);
        flash.registerFlash(ctx, '/404', 'danger', "사용자가 존재하지 않습니다(user doesn't exist)")
    }
})

module.exports = router;