const { Telegraf } = require("telegraf");
// const RedisSession = require('telegraf-session-redis');
const {
  start,
  startQuiz,
  wellcome,
  afirmativeAnswer,
  negaiveAnswer,
} = require("./quiz");
const {
  RESTART_BUTTON,
  START_BUTTON,
  ANSWER_YES,
  ANSWER_NO,
} = require("./resources/messages-properties");

// const conf = require('ocore/co/nf.js');

const bot = new Telegraf(process.env.BOT_TOKEN);
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
bot.action(ANSWER_YES, afirmativeAnswer);
bot.action(ANSWER_NO, negaiveAnswer);
// bot.command("quiz", async (ctx) => {
//   return generateQuestion(ctx);
// });

// bot.on('callback_query', quiz);

module.exports = bot;
