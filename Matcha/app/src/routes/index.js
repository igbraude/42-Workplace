const Router = require("koa-router");
const profileRouter = require("./profile");
const connexionRouter = require("./connexion");
const profileEditRouter = require("./profileEdit");
const chatRouter = require("./chat");
const userRouter = require("./user");
const client = require("../db/db");
const mw = require('./middlewares');
const utils = require('../utils/utils');
const models = require('../models');

const router = new Router();

router.use(profileRouter.routes());
router.use(connexionRouter.routes());
router.use(chatRouter.routes());
router.use(userRouter.routes());
router.use(profileEditRouter.routes());

const tagsList = ['Sloth', 'Lust', 'Wrath', 'Envy', 'Pride', 'Gluttony', 'Greed'];

// Redirect to browse page if not connected
router.get('/', mw.isAuth, mw.isCompleted, mw.check404, async (ctx) => {
    if (!ctx.session.userId) {
        ctx.redirect('/connection');
    } else {
        ctx.redirect('/browse?page=1');
    }
});

// Browse page visible if account completed
router.get('/browse', mw.isAuth, mw.isCompleted, mw.check404, async (ctx) => {
    let {age, distance, tags, popularity, page} = ctx.query;
    if (!page) {
        ctx.redirect('/browse?page=1');
    }
    try {
        let userIntel = await models.users.getRawProfile(ctx.session.userId);
        const userTags = userIntel.tags.replace("{", "").replace("}", "").split(",")

        if (age === undefined || age < 18 || age > 25) {
            age = [(userIntel.age - 1 <= 25 ? userIntel.age - 1 : userIntel.age).toString(), (userIntel.age).toString(), (userIntel.age + 1 <= 25 ? userIntel.age + 1 : userIntel.age).toString()];
        }
        if (typeof tags === "string") {
            tags = [tags]
        }
        if (tags === undefined) {
            tags = userTags;
        }
        for (let tag of tags) {
            if (!tagsList.includes(tag)) {
                tags = tagsList;
            }
        }
        if (!distance) {
            distance = 800
        }
        if (!popularity) {
            const userPop = (await models.users.getUserPopularityRange(ctx.session.userId)).toString()
            popularity = userPop === 'false' ? '1' : userPop
        }

        let matchList = await models.users.getMatchProfiles(
            page,
            ctx.session.userId,
            userIntel.blocked,
            userIntel.sexual_orientation,
            userIntel.gender,
            age,
            popularity,
            distance,
            tags
        );

        await ctx.render("browse.hbs", {
            isNext: matchList.length === 6,
            userId: ctx.session.userId,
            users: matchList,
            page: page,
            age: age,
            tags: tags,
            distance: distance,
            popularity: popularity
        });
    } catch (err) {
        // console.log(`ERROR RENDER MAIN PAGE: ${err}`);
    }
});

module.exports = router;
