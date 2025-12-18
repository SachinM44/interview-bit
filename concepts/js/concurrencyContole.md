### What is **Concurrency Control** in JavaScript?

**Concurrency control** in JavaScript means **managing multiple asynchronous operations** so that:

* they run in the **correct order**,
* **don’t conflict** with each other, and
* **don’t overwhelm resources** (API, DB, UI thread).

Even though JavaScript is **single-threaded**, it can handle **concurrent async tasks** using the **event loop**.

---

## Why is Concurrency Control Needed?

Without control:

* Multiple API calls may fire at once and overload the backend
* Race conditions can occur
* Shared state may become inconsistent
* UI may update with stale data

---

## Common Concurrency Problems in JS

### 1️⃣ Race Condition

```js
let data;

fetchData1().then(res => data = res);
fetchData2().then(res => data = res);
```

❌ Whichever finishes last overwrites `data`

---

## Ways to Control Concurrency in JavaScript

---

## 1️⃣ Sequential Execution (Control order)

```js
async function runSequentially() {
  await task1();
  await task2();
  await task3();
}
```

✅ Tasks run **one after another**
❌ Slower

---

## 2️⃣ Parallel Execution (No control)

```js
await Promise.all([task1(), task2(), task3()]);
```

✅ Fast
❌ No limit, may overload APIs

---

## 3️⃣ Limited Concurrency (Most Important ⭐)

Run **only N tasks at a time**

```js
async function withLimit(tasks, limit) {
  const results = [];
  const executing = [];

  for (const task of tasks) {
    const p = task().then(res => {
      executing.splice(executing.indexOf(p), 1);
      return res;
    });

    results.push(p);
    executing.push(p);

    if (executing.length >= limit) {
      await Promise.race(executing);
    }
  }

  return Promise.all(results);
}
```

Usage:

```js
withLimit([task1, task2, task3, task4], 2);
```

✅ Prevents API flooding
✅ Real-world interview favorite

---

## 4️⃣ Mutex / Lock (Critical Sections)

Used when **shared state** must not be modified simultaneously.

```js
let locked = false;

async function criticalSection() {
  while (locked) {
    await new Promise(r => setTimeout(r, 10));
  }

  locked = true;
  // critical work
  locked = false;
}
```

✅ Prevents race conditions
❌ Rare but important concept

---

## 5️⃣ Debouncing & Throttling (UI concurrency)

### Debounce

```js
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
```

Use case: search input

---

### Throttle

```js
function throttle(fn, limit) {
  let inThrottle = false;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
```

Use case: scroll, resize

---

## 6️⃣ Queue-Based Concurrency (Advanced)

```js
class TaskQueue {
  constructor(limit) {
    this.limit = limit;
    this.running = 0;
    this.queue = [];
  }

  run(task) {
    return new Promise(res => {
      this.queue.push({ task, res });
      this.next();
    });
  }

  next() {
    if (this.running >= this.limit || !this.queue.length) return;

    const { task, res } = this.queue.shift();
    this.running++;
    task().then(result => {
      this.running--;
      res(result);
      this.next();
    });
  }
}
```

---

## Concurrency Control in React / React Native

### Example: Prevent multiple API calls

```js
let inFlight = false;

async function fetchData() {
  if (inFlight) return;
  inFlight = true;

  try {
    await apiCall();
  } finally {
    inFlight = false;
  }
}
```

---

## Interview One-Line Answer 🧠

> **Concurrency control in JavaScript is the technique of managing multiple asynchronous operations to prevent race conditions, control execution order, and limit parallel tasks despite JS being single-threaded.**

---

## Key Takeaways

✔ JS is single-threaded but async is concurrent
✔ Use `async/await`, `Promise.all`, queues, locks
✔ Limit concurrency for APIs
✔ Prevent race conditions on shared state