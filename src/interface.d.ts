interface LevelCoreOptions {
  difficultyOptions: LevelDifficultyOptions;
  isChase: boolean;
  number: number;
  world: number;
}
interface LevelDifficultyOptions {
  [index: number]: {
    description: string;
    charSet: string;
    wordLength: number;
  };
}
interface Swears {
  [index: string]: number;
}
