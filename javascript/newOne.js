let abc = 100;
if (function xyz() {}) {
  abc = abc + typeof xyz;
}

console.log(abc);
//what will be the output , nd why ?
// 100-function
//reffernce error, why becouse the function is not the number so it will throught an error (abc=ac-typeof(xyz))
//but if u do like this abc= abc + typeof(xyz) it will give 100undifined , why becouse the "=" will concatinate that , and since the function is undefuned

function amx() {}

console.log(typeof amx);
//now it will run becousse it not in : " The name of a function expression is only accessible inside the function body itself"

let obj = {
  name: "sachin",
  func: function () {
    console.log(this.name);
  },
};

const c = obj.func; // becouse here u the copying only the function not the object referancr

obj.func(); // but here its referencing correct to that name

c(); //so it will be undifined here

//output :sachin
//undefined
//             This is another **very important JS concept** — it’s all about **`this` binding**, not the function itself.

// Let’s go step-by-step and correct the mental model.

// ---

// ## ✅ Code

// ```js
// let obj = {
//   name: 'sachin',
//   func: function () {
//     console.log(this.name);
//   }
// };

// const c = obj.func;

// obj.func(); // ?
// c();        // ?
// ```

// ---

// ## ✅ Output

// ```txt
// sachin
// undefined
// ```

// ---

// ## 🔍 Why `obj.func()` works

// ```js
// obj.func();
// ```

// Here, **how the function is called matters**.

// * The function is called **as a method of `obj`**
// * So `this` 👉 `obj`

// Equivalent to:

// ```js
// this === obj
// ```

// Therefore:

// ```js
// this.name === obj.name === "sachin"
// ```

// ✔️ Output: `sachin`

// ---

// ## 🔍 Why `c()` is `undefined`

// ```js
// const c = obj.func;
// c();
// ```

// Here’s the key rule 👇

// > **`this` is decided at call-time, not at definition-time**

// When you do:

// ```js
// const c = obj.func;
// ```

// You are **copying only the function**,
// ❌ NOT the object reference.

// Now when calling:

// ```js
// c();
// ```

// * It’s a **plain function call**
// * Not attached to any object

// ### What is `this` now?

// * In **strict mode** → `this === undefined`
// * In **non-strict mode** → `this === window` (browser)

// Either way:

// ```js
// this.name === undefined
// ```

// ✔️ Output: `undefined`

// ---

// ## 🧠 Visual Representation

// ```js
// obj.func(); // this → obj
// c();        // this → undefined / window
// ```

// ---

// ## ❌ Your comment corrections

// ```js
// const c=obj.func //{sachin} ❌
// ```

// ❌ Incorrect — `c` is **just a function**, not `{sachin}`

// ```js
// c() //{name:sachin} ❌
// ```

// ❌ Incorrect — `this` is **lost**

// ---

// ## 🔥 How to FIX it (Important)

// ### ✅ Option 1: `bind`

// ```js
// const c = obj.func.bind(obj);
// c(); // sachin
// ```

// ---

// ### ✅ Option 2: Arrow function wrapper

// ```js
// const c = () => obj.func();
// c(); // sachin
// ```

// ---

// ### ✅ Option 3: Call / Apply

// ```js
// c.call(obj); // sachin
// ```

// ---

// ## ⚠️ Interview Trap (Very common)

// ```js
// setTimeout(obj.func, 1000); // undefined
// ```

// Fix:

// ```js
// setTimeout(obj.func.bind(obj), 1000);
// ```

// ---

// ## 🧠 One-Line Interview Answer

// > `this` depends on how a function is called.
// > When extracted from an object and called directly, the method loses its object context, so `this` becomes undefined and `this.name` is undefined.

// ---

// If you want, next I can explain:

// * `this` in **arrow functions**
// * `this` in **classes**
// * `this` vs **closures**
// * Why React handlers lose `this`

// Just tell me 👍
