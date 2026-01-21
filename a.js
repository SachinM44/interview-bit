//let me write once again
const countTheName = (string) => {
  let result = [];
  for (let i = 0; i < string.length; i++) {
    let char = string[i];
    if (result[char]) {
      result[char]++;
    } else {
      result[char] = 1;
    }
  }
  return result;
};
let string='dhdhhhhdhhd'
console.log(countTheName(string))
