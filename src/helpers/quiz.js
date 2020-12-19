const loadFrame = require('../utils/load-frame');

let numQuestion = 0;
let maxFrames = 0;
let limitRight = 0;
let limitLeft = 0;
let mid = 0;

async function initGame() {
    numQuestion = 0;
    maxFrames = await loadFrame.getMaxFrames();
    if (maxFrames >= 1) {
        limitRight = maxFrames - 1;
        return true;
    } else {
        return false;
    }
}

function calculateNewFrame() {
    if (limitRight < 1) {
        return null;
    }
    mid = Math.trunc((limitLeft + limitRight) / 2);
    return mid;
}

function getIncrementedNumQuestion() {
    //TODO: by chatID
    return ++numQuestion;
}

function checkFinishGame(previousAnswer, previousFrame) {
    console.log(`---->: ${limitLeft} - ${limitRight} || Mid: ${mid} | ${previousAnswer}`);
    if (!previousAnswer) {
        limitLeft = previousFrame;
    } else {
        limitRight = previousFrame;
    }
    if (limitLeft + 1 < limitRight) {
        //Generate new question
        return false;
    } else {
        //End Game
        return true;
    }
}

function getCurrentQuestionData() {
    return {
        numQuestion,
        currentFrame: mid,
        limitLeft,
        limitRight,
    };
}

module.exports = {
    initGame,
    calculateNewFrame,
    getIncrementedNumQuestion,
    checkFinishGame,
    getCurrentQuestionData,
};
