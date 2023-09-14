const zero = "0";
const number = "123456789";
const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const lower = "abcdefghijkmnopqrstuvwxyz";

function generate(dictionary: string, length: number, unique: boolean = true) {
  const result: Array<string> = [];
  do {
    const index: number = Math.floor(Math.random() * dictionary.length + 1);
    const character: string = dictionary[index - 1];
    if (unique) {
      if (result[result.length - 1] !== character) {
        result.push(character);
      }
    } else {
      result.push(character);
    }
  } while (result.length !== length);
  return result.join("");
};

export function generateCode(length: number = 6) {
  return generate(zero + number, length, false);
}

export function generateNumber(length: number = 48) {
  return generate(lower + upper + number, length);
}
