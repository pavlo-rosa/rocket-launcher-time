const logger = require('../config/logger')('src/commands/quiz-commands.js');
const { Markup } = require('telegraf');
const { parameterizedString } = require('../utils/utils');
const loadFrame = require('../utils/load-frame');
const quiz = require('../helpers/quiz');
const {
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

async function startQuiz(ctx) {
    const success = await quiz.initGame(ctx.chat.id);
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
    const newFrame = await quiz.calculateNewFrame(ctx.chat.id);
    if (!newFrame) {
        logger.error(ERROR_BISECTION);
        ctx.reply(ERROR_BISECTION, { parse_mode: 'HTML' });
        return;
    }
    return ctx.telegram.sendPhoto(
        ctx.chat.id,
        { url: loadFrame.getURLFrameByID(newFrame) },
        {
            caption: parameterizedString(QUESTION_QUIZ, await quiz.getIncrementedNumQuestion(ctx.chat.id), newFrame),
            parse_mode: 'Markdown',
            reply_markup: Markup.inlineKeyboard([
                Markup.callbackButton('Yes ✅', ANSWER_YES),
                Markup.callbackButton('No ❌', ANSWER_NO),
            ]),
        }
    );
}

async function afirmativeAnswer(ctx) {
    const dataQuestion = await quiz.getCurrentQuestionData(ctx.chat.id)
    await ctx.answerCbQuery();
    await ctx.editMessageCaption(parameterizedString(QUESTION_QUIZ_AFIRMATIVE, dataQuestion.numQuestion, dataQuestion.currentFrame), {
        parse_mode: 'HTML',
    });
    await quiz.checkFinishGame(true, dataQuestion.currentFrame, ctx.chat.id) ? endQuiz(ctx) : generateQuestion(ctx);
}

async function negaiveAnswer(ctx) {
    const dataQuestion = await quiz.getCurrentQuestionData(ctx.chat.id)
    await ctx.answerCbQuery();
    await ctx.editMessageCaption(parameterizedString(QUESTION_QUIZ_NEGATIVE, dataQuestion.numQuestion, dataQuestion.currentFrame), {
        parse_mode: 'HTML',
    });
    await quiz.checkFinishGame(false, dataQuestion.currentFrame, ctx.chat.id) ? endQuiz(ctx) : generateQuestion(ctx);
}

async function endQuiz(ctx) {
    const dataQuestion = await quiz.getCurrentQuestionData(ctx.chat.id)
    ctx.telegram.sendAnimation(ctx.chat.id, 'https://media.giphy.com/media/xT0xezQGU5xCDJuCPe/giphy.gif', {
        caption: parameterizedString(END_GAME, dataQuestion.limitRight),
        parse_mode: 'HTML',
    });
}

module.exports = {
    startQuiz,
    afirmativeAnswer,
    negaiveAnswer,
};
