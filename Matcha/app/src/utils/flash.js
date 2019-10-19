module.exports = {

  registerFlash: async (ctx, path, type, message) => {
    ctx.session.flashMessage = {type: type, message: message}
    ctx.redirect(path)
  },

  loadFlash: async (ctx) => {
    if (ctx.session.hasOwnProperty("flashMessage")) {
      let flash = ctx.session.flashMessage;
      delete ctx.session.flashMessage;
      return flash;
    }
    return undefined;
  },

};