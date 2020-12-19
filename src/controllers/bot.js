const config = require('../config/config');
const { Telegraf } = require('telegraf');
const { startQuiz, afirmativeAnswer, negaiveAnswer } = require('../commands/quiz-commands');
const { wellcome, editSettings, getHelpInfo } = require('../commands/basic-commands');
const {
    RESTART_BUTTON,
    START_BUTTON,
    ANSWER_YES,
    ANSWER_NO,
    SETTINGS,
    HELP,
    RESTART_GAME
} = require('../resources/messages-properties');
const redis = require('../helpers/redis').client;

const bot = new Telegraf(config.BOT_TOKEN);

bot.start(wellcome);
bot.hears(START_BUTTON, startQuiz);
bot.hears(RESTART_BUTTON, startQuiz);
bot.command(RESTART_GAME, startQuiz);
bot.action(ANSWER_YES, afirmativeAnswer);
bot.action(ANSWER_NO, negaiveAnswer);
bot.command(SETTINGS, editSettings);
bot.command(HELP, getHelpInfo);

module.exports = bot;
