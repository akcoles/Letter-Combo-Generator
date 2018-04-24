"use strict";
var fs = require('fs');
var levelData = require('./levels');
var words = require('./words');
var SWEARS = {
    ass: 1,
    bj: 1,
    die: 1,
    fag: 1,
    fu: 1,
    kkk: 1,
    tit: 1,
    xxx: 1,
    bum: 1,
};
var MIN_WORD_COUNT = 12;
function subsetSize(letters, length) {
    for (var i = 2; i <= letters.length; i++) {
        if (Math.pow(i, length) > MIN_WORD_COUNT) {
            return i;
        }
    }
    throw new Error("Cannot create " + MIN_WORD_COUNT + " words of length " + length + " with only " + letters.length + " letters");
}
function chooseLetters(letters, num) {
    var ret = [];
    letters = letters.slice();
    for (var i = 0; i < num; i++) {
        var index = Math.floor(letters.length * Math.random());
        ret.push(letters.splice(index, 1)[0]);
    }
    return ret;
}
function getCombos(letters, length, size, results, prefix) {
    var letterSet = chooseLetters(letters, size);
    if (length) {
        for (var i = 0; i < size; i++) {
            getCombos(letters, length - 1, size, results, prefix + letterSet[i]);
        }
    }
    else if (!(prefix in SWEARS)) {
        results.push(prefix);
    }
    return results;
}
levelData.levels.forEach(function (level) {
    var outputText = '';
    for (var difficultyLevel in level.difficultyOptions) {
        var charSet = level.difficultyOptions[difficultyLevel].charSet;
        var wordLength = level.difficultyOptions[difficultyLevel].wordLength;
        var re = new RegExp([
            '^[',
            charSet,
            ']{',
            wordLength,
            '}$'
        ].join(''));
        var shortWordList = words.wordList.filter(function (word) { return re.test(word); });
        if (shortWordList.length < MIN_WORD_COUNT) {
            shortWordList = [];
            var letters = charSet.split('');
            var size = subsetSize(letters, wordLength);
            getCombos(letters, wordLength, size, shortWordList, '');
            shortWordList.forEach(function (word) {
                outputText += word + ',';
            });
        }
        outputText = outputText.slice(0, -1);
        outputText += '\n';
    }
    if (outputText !== '')
        fs.writeFileSync("output/level" + level.number + ".csv", outputText);
});
//# sourceMappingURL=index.js.map