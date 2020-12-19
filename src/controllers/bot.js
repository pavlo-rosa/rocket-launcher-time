const config = require('../config/config');
const { Telegraf } = require('telegraf');
// const RedisSession = require('telegraf-session-redis');
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

// const conf = require('ocore/co/nf.js');

const bot = new Telegraf(config.BOT_TOKEN);

// const session = new RedisSession({
// 	store: {
// 		host: conf.botRedisSessionHost,
// 		port: conf.botRedisSessionPort,
// 	}
// });

// bot.use(session.middleware());
bot.start(wellcome);
bot.hears(START_BUTTON, startQuiz);
bot.hears(RESTART_BUTTON, startQuiz);
bot.command(RESTART_GAME, startQuiz);
bot.action(ANSWER_YES, afirmativeAnswer);
bot.action(ANSWER_NO, negaiveAnswer);
bot.command(SETTINGS, editSettings);
bot.command(HELP, getHelpInfo);
// bot.command("quiz", async (ctx) => {
//   return generateQuestion(ctx);
// });

// bot.on('callback_query', quiz);

module.exports = bot;
