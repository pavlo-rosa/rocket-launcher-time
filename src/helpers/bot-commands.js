const { Markup } = require('telegraf');
const { parameterizedString } = require('../utils/utils');
const loadFrame = require('../utils/load-frame');
const quiz = require('./quiz');
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
    END_GAME,
} = require('../resources/messages-properties');

async function wellcome(ctx) {
    const keyboardMenu = Markup.keyboard([[START_BUTTON]])
        .oneTime()
        .resize()
        .extra();
    ctx.reply(WELLCOME_MESSAGE, keyboardMenu);
}

async function startQuiz(ctx) {
    const success = await quiz.initGame(ctx);
    if (!success) {
        ctx.reply(ERROR_URL, { parse_mode: 'HTML' });
        return;
    }
    const keyboardMenu = Markup.keyboard([[RESTART_BUTTON]])
        .oneTime()
        .resize()
        .extra();
    ctx.reply(START_GAME_MESSAGE, keyboardMenu);
    generateQuestion(ctx);
}

async function generateQuestion(ctx) {
    const newFrame = quiz.calculateNewFrame();
    if (!newFrame) {
        console.error(ERROR_BISECTION);
        ctx.reply(ERROR_BISECTION, { parse_mode: 'HTML' });
        return;
    }
    return ctx.telegram.sendPhoto(
        ctx.chat.id,
        { url: loadFrame.getURLFrameByID(newFrame) },
        {
            caption: parameterizedString(QUESTION_QUIZ, quiz.getIncrementedNumQuestion(), newFrame),
            parse_mode: 'Markdown',
            reply_markup: Markup.inlineKeyboard([
                Markup.callbackButton('Yes ✅', ANSWER_YES),
                Markup.callbackButton('No ❌', ANSWER_NO),
            ]),
        }
    );
}

async function afirmativeAnswer(ctx) {
    const dataQuestion = quiz.getCurrentQuestionData()
    await ctx.answerCbQuery();
    await ctx.editMessageCaption(parameterizedString(QUESTION_QUIZ_AFIRMATIVE, dataQuestion.numQuestion, dataQuestion.currentFrame), {
        parse_mode: 'HTML',
    });
    quiz.checkFinishGame(true, dataQuestion.currentFrame) ? endQuiz(ctx) : generateQuestion(ctx);
}

async function negaiveAnswer(ctx) {
    const dataQuestion = quiz.getCurrentQuestionData()
    await ctx.answerCbQuery();
    await ctx.editMessageCaption(parameterizedString(QUESTION_QUIZ_NEGATIVE, dataQuestion.numQuestion, dataQuestion.currentFrame), {
        parse_mode: 'HTML',
    });
    quiz.checkFinishGame(false, dataQuestion.currentFrame) ? endQuiz(ctx) : generateQuestion(ctx);
}

async function endQuiz(ctx) {
    const dataQuestion = quiz.getCurrentQuestionData()
    ctx.telegram.sendAnimation(ctx.chat.id, 'https://media.giphy.com/media/xT0xezQGU5xCDJuCPe/giphy.gif', {
        caption: parameterizedString(END_GAME, dataQuestion.limitRight),
        parse_mode: 'HTML',
    });
}

module.exports = {
    wellcome,
    startQuiz,
    afirmativeAnswer,
    negaiveAnswer,
};
