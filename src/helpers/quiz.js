const loadFrame = require('../utils/load-frame');
const redis = require('../helpers/redis');

async function initGame(chatId) {
    const keyCache = `chat_${chatId}`;
    const maxFrames = await loadFrame.getMaxFrames();
    if (maxFrames >= 1) {
        limitRight = maxFrames - 1;
        redis.setCache(keyCache, { numQuestion: 0, maxFrames, limitLeft: 0, limitRight, currentFrame: 0 });
        return true;
    } else {
        redis.setCache(keyCache, null);
        return false;
    }
}

async function calculateNewFrame(chatId) {
    const keyCache = `chat_${chatId}`;
    let data = await redis.getCache(keyCache);

    if (!data || data.limitRight < 1 ) {
        return null;
    }
    mid = Math.trunc((data.limitLeft + data.limitRight) / 2);

    data.currentFrame = mid;
    redis.setCache(keyCache, data);
    return mid;
}

async function getIncrementedNumQuestion(chatId) {
    const keyCache = `chat_${chatId}`;
    let data = await redis.getCache(keyCache);

    data.numQuestion = data.numQuestion + 1;

    redis.setCache(keyCache, data);

    return data.numQuestion;
}

async function checkFinishGame(previousAnswer, previousFrame, chatId) {
    const keyCache = `chat_${chatId}`;
    let data = await redis.getCache(keyCache);

    if (!previousAnswer) {
        data.limitLeft = previousFrame;
    } else {
        data.limitRight = previousFrame;
    }

    redis.setCache(keyCache, data);

    if (data.limitLeft + 1 < data.limitRight) {
        //Generate new question
        return false;
    } else {
        //End Game
        return true;
    }
}

async function getCurrentQuestionData(chatId) {
    const keyCache = `chat_${chatId}`;
    return await redis.getCache(keyCache);
}

module.exports = {
    initGame,
    calculateNewFrame,
    getIncrementedNumQuestion,
    checkFinishGame,
    getCurrentQuestionData,
};
