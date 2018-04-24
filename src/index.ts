const fs = require('fs');
const levelData = require('./levels');
const words = require('./words');

var SWEARS: Swears = {
  ass: 1,
  bj: 1,
  die: 1,
  fag: 1,
  fu: 1,
  kkk: 1,
  tit: 1,
  xxx: 1,
  bum: 1,
}

var MIN_WORD_COUNT = 12

/**
 * Find the minimum number of characters selected from letters that can be used to produce MIN_WORD_COUNT unique combinations of length.
 */
function subsetSize(letters: string[], length: number) {
  for (var i = 2; i <= letters.length; i++) {
    if (Math.pow(i, length) > MIN_WORD_COUNT) {
      return i;
    }
  }
  throw new Error(`Cannot create ${MIN_WORD_COUNT} words of length ${length} with only ${letters.length} letters`);
}

/**
 * Generate a random array of characters consisting of num members of letters.
 */
function chooseLetters(letters: string[], num: number): string[] {
  var ret: string[] = [];
  letters = letters.slice();
  for (var i = 0; i < num; i++) {
    var index = Math.floor(letters.length * Math.random());
    ret.push(letters.splice(index, 1)[0]);
  }
  return ret;
}

/**
 * Recursive function that generates random combinations of words. The specified size value limits the total number of words generated based on the size of letters and necessary word length.
 */
function getCombos(
  letters: string[],
  length: number,
  size: number,
  results: string[],
  prefix: string
): string[] {
  var letterSet = chooseLetters(letters, size);
  if (length) {
    for (var i = 0; i < size; i++) {
      getCombos(letters, length - 1, size, results, prefix + letterSet[i]);
    }
  } else if (!(prefix in SWEARS)) {
    results.push(prefix);
  }
  return results;
}

levelData.levels.forEach((level: LevelCoreOptions) => {

  var outputText: string = '';
  for (let difficultyLevel in level.difficultyOptions) {
    var charSet: string = level.difficultyOptions[difficultyLevel].charSet;
    var wordLength: number = level.difficultyOptions[difficultyLevel].wordLength;
    var re = new RegExp([
      '^[',
      charSet,
      ']{',
      wordLength,
      '}$'
    ].join(''));
    var shortWordList: string[] = words.wordList.filter((word: string) => re.test(word));
    if (shortWordList.length < MIN_WORD_COUNT) {
      shortWordList = [];
      var letters = charSet.split('');
      var size = subsetSize(letters, wordLength);
      getCombos(letters, wordLength, size, shortWordList, '');
      shortWordList.forEach((word: string) => {
        outputText += word + ','
      });
    }
    outputText = outputText.slice(0, -1);
    outputText += '\n';
  }
  if (outputText !== '') fs.writeFileSync(`output/level${level.number}.csv`, outputText);

});