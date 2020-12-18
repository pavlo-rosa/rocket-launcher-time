const { Router, Markup, Extra } = require("telegraf");
const { parseStr, parameterizedString } = require("./utils");
const loadFrame = require("./load-frame");
const {
  WELLCOME_MESSAGE,
  RESTART_BUTTON,
  START_BUTTON,
  START_GAME_MESSAGE,
  ANSWER_YES,
  ANSWER_NO,
  QUESTION_QUIZ,
  QUESTION_QUIZ_AFIRMATIVE,
  QUESTION_QUIZ_NEGATIVE,
  ERROR_URL,
  ERROR_BISECTION,
} = require("./quiz-strings");

let numQuestion;
let maxFrames;
let currentFrame;

async function wellcome(ctx) {
  const keyboardMenu = Markup.keyboard([[START_BUTTON]])
    .oneTime()
    .resize()
    .extra();
  ctx.reply(WELLCOME_MESSAGE, keyboardMenu);
}

async function startQuiz(ctx) {
  numQuestion = 0;
  maxFrames = await loadFrame.getMaxFrames();
  currentFrame = maxFrames;
  if (!maxFrames) {
    ctx.reply(ERROR_URL, { parse_mode: "HTML" });
  }
  console.log(`Num. Frames: ${maxFrames}`);
  const keyboardMenu = Markup.keyboard([[RESTART_BUTTON]])
    .oneTime()
    .resize()
    .extra();
  ctx.reply(START_GAME_MESSAGE, keyboardMenu);
  generateQuestion(ctx);
}
let left = 0;
let right = 0;
function getNewFrame(numFrames, ctx) {
  if (numFrames < 1) {
    console.error(ERROR_BISECTION);
    ctx.reply(ERROR_BISECTION, { parse_mode: "HTML" });
    return;
  }

  left = 0;
  right = numFrames === maxFrames ? numFrames - 1 : numFrames;

  let mid = Math.trunc((left + right) / 2);
  console.log((left + right) / 2);
  // console.log(mid)
  return mid;
}
function checkIfFinishOrGenerateNewQuestion(ctx) {
  console.log(left+1 + " < "+ currentFrame)
  if (left + 1 < currentFrame) {
    generateQuestion(ctx);
  } else {
    endQuiz(ctx);
  }
}

async function endQuiz(ctx) {
  ``;
  ctx.reply(`Found! Take-off = ${currentFrame}`);
}
async function generateQuestion(ctx) {
  numQuestion++;
  currentFrame = getNewFrame(currentFrame, ctx);
  return ctx.telegram.sendPhoto(
    ctx.chat.id,
    { url: loadFrame.getURLFrameByID(currentFrame) },
    {
      caption: parameterizedString(QUESTION_QUIZ, numQuestion, currentFrame),
      parse_mode: "Markdown",
      reply_markup: Markup.inlineKeyboard([
        Markup.callbackButton("Yes ✅", ANSWER_YES),
        Markup.callbackButton("No ❌", ANSWER_NO),
      ]),
    }
  );
}

async function afirmativeAnswer(ctx) {
  await ctx.answerCbQuery();
  await ctx.editMessageCaption(
    parameterizedString(QUESTION_QUIZ_AFIRMATIVE, numQuestion, currentFrame),
    {
      parse_mode: "HTML",
    }
  );
  await checkIfFinishOrGenerateNewQuestion(ctx);
}

async function negaiveAnswer(ctx) {
  await ctx.answerCbQuery();
  await ctx.editMessageCaption(
    parameterizedString(QUESTION_QUIZ_NEGATIVE, numQuestion, currentFrame),
    {
      parse_mode: "HTML",
    }
  );
  await checkIfFinishOrGenerateNewQuestion(ctx);
}

async function test(ctx) {
  ctx.reply("THIS IS A TEST");
}

module.exports = {
  wellcome,
  startQuiz,
  afirmativeAnswer,
  negaiveAnswer,
  test,
};
