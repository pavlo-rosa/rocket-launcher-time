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
  END_GAME
} = require("./quiz-strings");

let numQuestion;
let maxFrames;

let limitLeft = 0;
let limitRight = 0;
let mid = 0;

async function wellcome(ctx) {
  const keyboardMenu = Markup.keyboard([[START_BUTTON]])
    .oneTime()
    .resize()
    .extra();
  ctx.reply(WELLCOME_MESSAGE, keyboardMenu);
}

async function startQuiz(ctx) {
  endQuiz(ctx)
  numQuestion = 0;
  maxFrames = await loadFrame.getMaxFrames();
  maxFrames >= 1
    ? (limitRight = maxFrames - 1)
    : ctx.reply(ERROR_URL, { parse_mode: "HTML" });

  const keyboardMenu = Markup.keyboard([[RESTART_BUTTON]])
    .oneTime()
    .resize()
    .extra();
  ctx.reply(START_GAME_MESSAGE, keyboardMenu);
  generateQuestion(ctx);
}

async function generateQuestion(ctx) {
  function getNewFrame(ctx) {
    if (limitRight < 1) {
      console.error(ERROR_BISECTION);
      ctx.reply(ERROR_BISECTION, { parse_mode: "HTML" });
      return;
    }

    mid = Math.trunc((limitLeft + limitRight) / 2);

    // console.log(`Bisection: ${limitLeft} - ${limitRight} || Mid: ${mid}`)
    return mid;
  }

  numQuestion++;
  return ctx.telegram.sendPhoto(
    ctx.chat.id,
    { url: loadFrame.getURLFrameByID(getNewFrame(ctx)) },
    {
      caption: parameterizedString(QUESTION_QUIZ, numQuestion, mid),
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
    parameterizedString(QUESTION_QUIZ_AFIRMATIVE, numQuestion, mid),
    {
      parse_mode: "HTML",
    }
  );
  await checkIfFinishOrGenerateNewQuestion(ctx, true);
}

async function negaiveAnswer(ctx) {
  await ctx.answerCbQuery();
  await ctx.editMessageCaption(
    parameterizedString(QUESTION_QUIZ_NEGATIVE, numQuestion, mid),
    {
      parse_mode: "HTML",
    }
  );
  await checkIfFinishOrGenerateNewQuestion(ctx, false);
}

function checkIfFinishOrGenerateNewQuestion(ctx, previousAnswer) {
  console.log(`---->: ${limitLeft} - ${limitRight} || Mid: ${mid} | ${previousAnswer}`)
  if (!previousAnswer) {
    limitLeft = mid;
  }else {
    limitRight = mid
  }
  if (limitLeft + 1 < limitRight) {
    generateQuestion(ctx);
  } else {
    endQuiz(ctx);
  }
}

async function endQuiz(ctx) {
  ctx.telegram.sendAnimation(ctx.chat.id, "https://media.giphy.com/media/xT0xezQGU5xCDJuCPe/giphy.gif", {
    caption: parameterizedString(END_GAME, limitRight),
    parse_mode: "HTML"
  })
}

module.exports = {
  wellcome,
  startQuiz,
  afirmativeAnswer,
  negaiveAnswer,
};
