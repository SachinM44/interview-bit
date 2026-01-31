let count = 0;

setTimeout(() => {
  console.log(count);
}, 0);

for (let i = 0; i < 10000; i++) {
  count++;
}
