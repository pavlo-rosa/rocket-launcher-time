const { Markup } = require('telegraf');

const { WELLCOME_MESSAGE, START_BUTTON, SETTINGS_MESSAGE, HELP_MESSAGE } = require('../resources/messages-properties');

async function wellcome(ctx) {
    const keyboardMenu = Markup.keyboard([[START_BUTTON]])
        .oneTime()
        .resize()
        .extra();
    ctx.reply(WELLCOME_MESSAGE, keyboardMenu);
}

async function editSettings(ctx) {
    ctx.reply(SETTINGS_MESSAGE);
}

async function getHelpInfo(ctx) {
    ctx.reply(HELP_MESSAGE);
}

module.exports = {
    wellcome,
    getHelpInfo,
    editSettings,
};
