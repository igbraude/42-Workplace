const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const session = require('koa-session');
const views = require("koa-views");
const serve = require("koa-static");
const {join} = require("path");
const routes = require("./routes");

const app = new Koa();

app.keys = ['some secret hurr'];

app.use(bodyParser());
app.use(serve(join(__dirname, "..", "public")));

app.use(views(join(__dirname, "views"), {
    map: {
        hbs: "handlebars",
    },
    options: {
        helpers: {
            ternary: function (index, value, options) {
                if(index === value){
                    return options.fn(this);
                } else {
                    return options.inverse(this);
                }

            },
            ifInArray: function (array, value, options) {
                if(array.includes(value)){
                    return options.fn(this);
                } else {
                    return options.inverse(this);
                }
            },
            defaultImage: function (img) {
                if (!img) {
                    return("/img/profile.png")
                } else {
                    return(img)
                }
            },
        },
        partials: {
            header: "header",
            navbar: "nav",
            flash: "flash"
        },
    }
}));

app.use(session(app));
app.use(routes.routes());

module.exports = app;
