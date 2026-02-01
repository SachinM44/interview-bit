
can you ex[lain this end to end deeply : JavaScript execution model This page introduces the basic infrastructure of the JavaScript runtime environment. The model is largely theoretical and abstract, without any platform-specific or implementation-specific details. Modern JavaScript engines heavily optimize the described semantics. This page is a reference. It assumes you are already familiar with the execution model of other programming languages, such as C and Java. It makes heavy references to existing concepts in operating systems and programming languages. In this article The engine and the host Agent execution model Realms Stack and execution contexts Job queue and event loop Agent clusters and memory sharing Specifications See also The engine and the host JavaScript execution requires the cooperation of two pieces of software: the JavaScript engine and the host environment. The JavaScript engine implements the ECMAScript (JavaScript) language, providing the core functionality. It takes source code, parses it, and executes it. However, in order to interact with the outside world, such as to produce any meaningful output, to interface with external resources, or to implement security- or performance-related mechanisms, we need additional environment-specific mechanisms provided by the host environment. For example, the HTML DOM is the host environment when JavaScript is executed in a web browser. Node.js is another host environment that allows JavaScript to be run on the server side. While we focus primarily on the mechanisms defined in ECMAScript in this reference, we will occasionally talk about mechanisms defined in the HTML spec, which is often mimicked by other host environments like Node.js or Deno. This way, we can give a coherent picture of the JavaScript execution model as used on the web and beyond. Agent execution model In the JavaScript specification, each autonomous executor of JavaScript is called an agent, which maintains its facilities for code execution: Heap (of objects): this is just a name to denote a large (mostly unstructured) region of memory. It gets populated as objects get created in the program. Note that in the case of shared memory, each agent has its own heap with its own version of a SharedArrayBuffer object, but the underlying memory represented by the buffer is shared. Queue (of jobs): this is known in HTML (and also commonly) as the event loop which enables asynchronous programming in JavaScript while being single-threaded. It's called a queue because it's generally first-in-first-out: earlier jobs are executed before later ones. Stack (of execution contexts): this is what's known as a call stack and allows transferring control flow by entering and exiting execution contexts like functions. It's called a stack because it's last-in-first-out. Every job enters by pushing a new frame onto the (empty) stack, and exits by emptying the stack. These are three distinct data structures that keep track of different data. We will introduce the queue and the stack in more detail in the following sections. To read more about how heap memory is allocated and freed, see memory management. Each agent is analogous to a thread (note that the underlying implementation may or may not be an actual operating system thread). Each agent can own multiple realms (which 1-to-1 correlate with global objects) that can synchronously access each other, and thus needs to run in a single execution thread. An agent also has a single memory model, indicating whether it's little-endian, whether it can be synchronously blocked, whether atomic operations are lock-free, etc. An agent on the web can be one of the following: A Similar-origin window agent, which contains various Window objects which can potentially reach each other, either directly or by using document.domain. If the window is origin-keyed, then only same-origin windows can reach each other. A Dedicated worker agent containing a single DedicatedWorkerGlobalScope. A Shared worker agent containing a single SharedWorkerGlobalScope. A Service worker agent containing a single ServiceWorkerGlobalScope. A Worklet agent containing a single WorkletGlobalScope. In other words, each worker creates its own agent, while one or more windows may be within the same agent—usually a main document and its similar-origin iframes. In Node.js, a similar concept called worker threads is available. The diagram below illustrates the execution model of agents: A diagram consisting of two agents: one HTML page and one worker. Each has its own stack containing execution contexts, heap containing objects, and queue containing jobs. Realms Each agent owns one or more realms. Each piece of JavaScript code is associated with a realm when it's loaded, which remains the same even when called from another realm. A realm consists of the following information: A list of intrinsic objects like Array, Array.prototype, etc. Globally declared variables, the value of globalThis, and the global object A cache of template literal arrays, because evaluation of the same tagged template literal expression always causes the tag to receive the same array object On the web, the realm and the global object are 1-to-1 corresponded. The global object is either a Window, a WorkerGlobalScope, or a WorkletGlobalScope. So for example, every iframe executes in a different realm, though it may be in the same agent as the parent window. Realms are usually mentioned when talking about the identities of global objects. For example, we need methods such as Array.isArray() or Error.isError(), because an array constructed in another realm will have a different prototype object than the Array.prototype object in the current realm, so instanceof Array will wrongly return false. Stack and execution contexts We first consider synchronous code execution. Each job enters by calling its associated callback. Code inside this callback may create variables, call functions, or exit. Each function needs to keep track of its own variable environments and where to return to. To handle this, the agent needs a stack to keep track of the execution contexts. An execution context, also known generally as a stack frame, is the smallest unit of execution. It tracks the following information: Code evaluation state The module or script, the function (if applicable), and the currently executing generator that contains this code The current realm Bindings, including: Variables defined with var, let, const, function, class, etc. Private identifiers like #foo which are only valid in the current context this reference Imagine a program consisting of a single job defined by the following code: js Copy function foo(b) { const a = 10; return a + b + 11; } function bar(x) { const y = 3; return foo(x * y); } const baz = bar(7); // assigns 42 to baz When the job starts, the first frame is created, where the variables foo, bar, and baz are defined. It calls bar with the argument 7. A second frame is created for the bar call, containing bindings for the parameter x and the local variable y. It first performs the multiplication x * y, then calls foo with the result. A third frame is created for the foo call, containing bindings for the parameter b and the local variable a. It first performs the addition a + b + 11, then returns the result. When foo returns, the top frame element is popped out of the stack, and the call expression foo(x * y) resolves to the return value. It then continues execution, which is just to return this result. When bar returns, the top frame element is popped out of the stack, and the call expression bar(7) resolves to the return value. This initializes baz with the return value. We reach the end of the job's source code, so the stack frame for the entrypoint is popped out of the stack. The stack is empty, so the job is considered completed. Generators and reentry When a frame is popped, it's not necessarily gone forever, because sometimes we need to come back to it. For example, consider a generator function: js Copy function* gen() { console.log(1); yield; console.log(2); } const g = gen(); g.next(); // logs 1 g.next(); // logs 2 In this case, calling gen() first creates an execution context which is suspended—no code inside gen gets executed yet. The generator g saves this execution context internally. The current running execution context remains to be the entrypoint. When g.next() is called, the execution context for gen is pushed onto the stack, and the code inside gen is executed until the yield expression. Then, the generator execution context gets suspended and removed from the stack, which returns control back to the entrypoint. When g.next() is called again, the generator execution context is pushed back onto the stack, and the code inside gen resumes from where it left off. Tail calls One mechanism defined in the specification is proper tail call (PTC). A function call is a tail call if the caller does nothing after the call except return the value: js Copy function f() { return g(); } In this case, the call to g is a tail call. If a function call is in tail position, the engine is required to discard the current execution context and replace it with the context of the tail call, instead of pushing a new frame for the g() call. This means that tail recursion is not subject to the stack size limits: js Copy function factorial(n, acc = 1) { if (n <= 1) return acc; return factorial(n - 1, n * acc); } In reality, discarding the current frame causes debugging problems, because if g() throws an error, f is no longer on the stack and won't appear in the stack trace. Currently, only Safari (JavaScriptCore) implements PTC, and they have invented some specific infrastructure to address the debuggability issue. Closures Another interesting phenomenon related to variable scoping and function calls is closures. Whenever a function is created, it also memorizes internally the variable bindings of the current running execution context. Then, these variable bindings can outlive the execution context. js Copy let f; { let x = 10; f = () => x; } console.log(f()); // logs 10 Job queue and event loop An agent is a thread, which means the interpreter can only process one statement at a time. When the code is all synchronous, this is fine because we can always make progress. But if the code needs to perform asynchronous action, then we cannot progress unless that action is completed. However, it would be detrimental to user experience if that halts the whole program—the nature of JavaScript as a web scripting language requires it to be never blocking. Therefore, the code that handles the completion of that asynchronous action is defined as a callback. This callback defines a job, which gets placed into a job queue—or, in HTML terminology, an event loop—once the action is completed. Every time, the agent pulls a job from the queue and executes it. When the job is executed, it may create more jobs, which are added to the end of the queue. Jobs can also be added via the completion of asynchronous platform mechanisms, such as timers, I/O, and events. A job is considered completed when the stack is empty; then, the next job is pulled from the queue. Jobs might not be pulled with uniform priority—for example, HTML event loops split jobs into two categories: tasks and microtasks. Microtasks have higher priority and the microtask queue is drained first before the task queue is pulled. For more information, check the HTML microtask guide. If the job queue is empty, the agent waits for more jobs to be added. "Run-to-completion" Each job is processed completely before any other job is processed. This offers some nice properties when reasoning about your program, including the fact that whenever a function runs, it cannot be preempted and will run entirely before any other code runs (and can modify data the function manipulates). This differs from C, for instance, where if a function runs in a thread, it may be stopped at any point by the runtime system to run some other code in another thread. For example, consider this example: js Copy const promise = Promise.resolve(); let i = 0; promise.then(() => { i += 1; console.log(i); }); promise.then(() => { i += 1; console.log(i); }); In this example, we create an already-resolved promise, which means any callback attached to it will be immediately scheduled as jobs. The two callbacks seem to cause a race condition, but actually, the output is fully predictable: 1 and 2 will be logged in order. This is because each job runs to completion before the next one is executed, so the overall order is always i += 1; console.log(i); i += 1; console.log(i); and never i += 1; i += 1; console.log(i); console.log(i);. A downside of this model is that if a job takes too long to complete, the web application is unable to process user interactions like click or scroll. The browser mitigates this with the "a script is taking too long to run" dialog. A good practice to follow is to make job processing short and, if possible, cut down one job into several jobs. Never blocking Another important guarantee offered by the event loop model is that JavaScript execution is never blocking. Handling I/O is typically performed via events and callbacks, so when the application is waiting for an IndexedDB query to return or a fetch() request to return, it can still process other things like user input. The code that executes after the completion of an asynchronous action is always provided as a callback function (for example, the promise then() handler, the callback function in setTimeout(), or the event handler), which defines a job to be added to the job queue once the action completes. Of course, the guarantee of "never-blocking" requires the platform API to be inherently asynchronous, but some legacy exceptions exist like alert() or synchronous XHR. It is considered good practice to avoid them to ensure the responsiveness of the application. Agent clusters and memory sharing Multiple agents can communicate via memory sharing, forming an agent cluster. Agents are within the same cluster if and only if they can share memory. There is no built-in mechanism for two agent clusters to exchange any information, so they can be regarded as completely isolated execution models. When creating an agent (such as by spawning a worker), there are some criteria for whether it's in the same cluster as the current agent, or a new cluster is created. For example, the following pairs of global objects are each within the same agent cluster, and thus can share memory with each other: A Window object and a dedicated worker that it created. A worker (of any type) and a dedicated worker it created. A Window object A and the Window object of a same-origin iframe element that A created. A Window object and a same-origin Window object that opened it. A Window object and a worklet that it created. The following pairs of global objects are not within the same agent cluster, and thus cannot share memory: A Window object and a shared worker it created. A worker (of any type) and a shared worker it created. A Window object and a service worker it created. A Window object A and the Window object of an iframe element that A created that cannot be same origin-domain with A. Any two Window objects with no opener or ancestor relationship. This holds even if the two Window objects are same origin. For the exact algorithm, check the HTML specification. Cross-agent communication and memory model As aforementioned, agents communicate via memory sharing. On the web, memory is shared via the postMessage() method. The using web workers guide provides an overview of this. Typically, data is passed by value only (via structured cloning), and therefore does not involve any concurrency complications. To share memory, one must post a SharedArrayBuffer object, which can be simultaneously accessed by multiple agents. Once two agents share access to the same memory via a SharedArrayBuffer, they can synchronize executions via the Atomics object. There are two ways to access shared memory: via normal memory access (which is not atomic) and via atomic memory access. The latter is sequentially consistent (which means there is a strict total ordering of events agreed upon by all agents in the cluster), while the former is unordered (which means no ordering exists); JavaScript does not provide operations with other ordering guarantees. The spec provides the following guidelines for programmers working with shared memory: We recommend programs be kept data race free, i.e., make it so that it is impossible for there to be concurrent non-atomic operations on the same memory location. Data race free programs have interleaving semantics where each step in the evaluation semantics of each agent are interleaved with each other. For data race free programs, it is not necessary to understand the details of the memory model. The details are unlikely to build intuition that will help one to better write ECMAScript. More generally, even if a program is not data race free it may have predictable behavior, so long as atomic operations are not involved in any data races and the operations that race all have the same access size. The simplest way to arrange for atomics not to be involved in races is to ensure that different memory cells are used by atomic and non-atomic operations and that atomic accesses of different sizes are not used to access the same cells at the same time. Effectively, the program should treat shared memory as strongly typed as much as possible. One still cannot depend on the ordering and timing of non-atomic accesses that race, but if memory is treated as strongly typed the racing accesses will not "tear" (bits of their values will not be mixed). Concurrency and ensuring forward progress When multiple agents cooperate, the never-blocking guarantee does not always hold. An agent can become blocked, or paused, while waiting for another agent to perform some action. This is different from waiting on a promise in the same agent, because it halts the entire agent and does not allow any other code to run in the meantime—in other words, it cannot make forward progress. To prevent deadlocks, there are some strong restrictions on when and which agents can become blocked. Every unblocked agent with a dedicated executing thread eventually makes forward progress. In a set of agents that share an executing thread, one agent eventually makes forward progress. An agent does not cause another agent to become blocked except via explicit APIs that provide blocking. Only certain agents can be blocked. On the web, this includes dedicated workers and shared workers, but not similar-origin windows or service workers. The agent cluster ensures some level of integrity over the activeness of its agents, in the case of external pauses or terminations: An agent may be paused or resumed without its knowledge or cooperation. For example, navigating away from a window may suspend code execution but preserve its state. However, an agent cluster is not allowed to be partially deactivated, to avoid an agent starving because another agent has been deactivated. For example, shared workers are never in the same agent cluster as the creator window or other dedicated workers. This is because a shared worker's lifetime is independent of documents: if a document is deactivated while its dedicated worker holds a lock, the shared worker is blocked from acquiring the lock until the dedicated worker is reactivated, if ever. Meanwhile other workers trying to access the shared worker from other windows will starve. Similarly, an agent may be terminated by factors external to the cluster. For example, operating systems or users killing a browser process, or the browser force-terminating one agent because it's using too many resources. In this case, all the agents in the cluster get terminated. (The spec also allows a second strategy, which is an API that allows at least one remaining member of the cluster to identify the termination and the agent that was terminated, but this is not implemented on the web.) Specifications Specification ECMAScript® 2026 Language Specification ECMAScript® 2026 Language Specification HTML See also Event loops in the HTML standard What is the Event Loop? in the Node.js docs

Show more
2:21 PM
I'll provide a comprehensive, end-to-end explanation of JavaScript's execution model. This is a complex topic, so I'll break it down systematically.

Overview: The Big Picture
JavaScript's execution model describes how JavaScript code actually runs - from parsing to execution, including how it handles asynchronous operations while being single-threaded. Think of it as the "invisible machinery" that makes your code work.

1. The Engine and The Host
JavaScript execution requires two cooperating pieces:

JavaScript Engine
Implements the ECMAScript specification
Parses and executes your code
Examples: V8 (Chrome/Node.js), SpiderMonkey (Firefox), JavaScriptCore (Safari)
Host Environment
Provides APIs to interact with the outside world
Examples:
Browser: Provides DOM, fetch(), setTimeout(), etc.
Node.js: Provides file system, networking, etc.
Analogy: The engine is like a car's motor, the host is the car's body, wheels, and controls. The motor runs, but you need the rest to actually drive somewhere.

2. Agent Execution Model
An agent is an autonomous executor of JavaScript code. Think of it as a "virtual JavaScript processor."

Each Agent Has Three Core Data Structures:
A. Heap (Memory Storage)
Unstructured region where objects live
Gets populated as you create objects: const obj = {}
Separate for each agent (except SharedArrayBuffer)
B. Queue (Job Queue / Event Loop)
Stores jobs (tasks) waiting to execute
First-in, first-out (FIFO)
Enables asynchronous programming
Example: When you call setTimeout(), a job is added to this queue
C. Stack (Call Stack)
Tracks function execution contexts
Last-in, first-out (LIFO)
Each function call pushes a frame; returning pops it
Visual Example:

javascript
function foo() { return 10; }
function bar() { return foo() + 5; }
bar();

// Stack progression:
// 1. [main]           - program starts
// 2. [main, bar]      - bar() called
// 3. [main, bar, foo] - foo() called
// 4. [main, bar]      - foo() returns
// 5. [main]           - bar() returns
// 6. []               - program ends
Types of Agents on the Web:
Similar-origin window agent: Multiple windows/iframes that can access each other
Dedicated worker agent: One DedicatedWorkerGlobalScope
Shared worker agent: One SharedWorkerGlobalScope
Service worker agent: One ServiceWorkerGlobalScope
Worklet agent: One WorkletGlobalScope
Key Point: Each worker = separate agent. Multiple same-origin windows may share one agent.

3. Realms
A realm is an isolated JavaScript environment with its own global object and intrinsics.

What's in a Realm?
Intrinsic objects: Array, Object, Promise, etc.
Global variables: All var, let, const declarations
globalThis and the global object (window, global, etc.)
Why It Matters:
Different realms have different object identities, even for built-ins:

javascript
// iframe.html creates an array
const iframeArray = iframe.contentWindow.Array;
const mainArray = Array;

iframeArray === mainArray; // false!

// This is why we need:
Array.isArray(iframeArray); // works correctly
On the web: Each iframe, window, or worker = separate realm.

4. Stack and Execution Contexts
An execution context (stack frame) is the smallest unit of execution.

What Each Context Tracks:
Code evaluation state: Which line is executing
Environment: The function, module, or script
Current realm
Bindings: Variables (var, let, const), parameters, this
Example Walkthrough:
javascript
function foo(b) {
  const a = 10;
  return a + b + 11;
}

function bar(x) {
  const y = 3;
  return foo(x * y);
}

const baz = bar(7);
Stack Evolution:

Frame 1 (Global):
Bindings: foo, bar, baz (initially undefined)
Calls bar(7)
Frame 2 (bar):
Bindings: x = 7, y = 3
Calculates x * y = 21
Calls foo(21)
Frame 3 (foo):
Bindings: b = 21, a = 10
Calculates a + b + 11 = 42
Returns 42 → Frame popped
Back to Frame 2 (bar):
Receives 42
Returns 42 → Frame popped
Back to Frame 1 (Global):
baz = 42
Program ends → Frame popped
5. Advanced Stack Concepts
A. Generators and Re-entry
Generators can suspend and resume execution contexts:

javascript
function* gen() {
  console.log(1);
  yield;
  console.log(2);
}

const g = gen();
g.next(); // Logs 1, suspends, pops context
g.next(); // Pushes context back, logs 2
The generator's execution context is saved internally and can be restored.

B. Tail Calls (Proper Tail Call - PTC)
If a function returns only another function call, the engine can replace the current frame instead of adding a new one:

javascript
function factorial(n, acc = 1) {
  if (n <= 1) return acc;
  return factorial(n - 1, n * acc); // Tail call
}
Without PTC: Stack grows with each call → stack overflow at large n
With PTC: Stack stays constant → no stack overflow

Current Status: Only Safari implements this. Chrome/Firefox don't.

C. Closures
Functions "remember" the variable environment where they were created:

javascript
let f;
{
  let x = 10;
  f = () => x;
} // Block exits, but x is kept alive

console.log(f()); // 10 - x is still accessible!
The binding to x outlives the execution context because f holds a reference to it.

6. Job Queue and Event Loop
JavaScript is single-threaded but non-blocking through the event loop.

How It Works:
Synchronous code runs first (one job)
When an asynchronous operation completes (timer, I/O, promise), its callback becomes a job
Jobs are added to the queue
The agent pulls jobs one at a time from the queue
Each job runs to completion before the next
Example:
javascript
console.log('Start');

setTimeout(() => {
  console.log('Timeout');
}, 0);

Promise.resolve().then(() => {
  console.log('Promise');
});

console.log('End');

// Output:
// Start
// End
// Promise
// Timeout
Why this order?

Synchronous code runs: Start, End
Promise callback → Microtask queue (higher priority)
setTimeout callback → Task queue (lower priority)
Microtasks drain first: Promise
Then tasks: Timeout
Job Priorities (HTML Event Loop):
Microtasks: Promise callbacks, queueMicrotask()
Tasks: setTimeout(), I/O, events
Microtasks always run before tasks.

7. Run-to-Completion
Each job runs completely before the next starts. No preemption.

javascript
const promise = Promise.resolve();
let i = 0;

promise.then(() => {
  i += 1;
  console.log(i); // Always logs 1
});

promise.then(() => {
  i += 1;
  console.log(i); // Always logs 2
});
Guaranteed Order: Job 1 completes (i=1, log 1), then Job 2 (i=2, log 2).
Never: i+=1; i+=1; log; log (which would log 2, 2).

Downside:
Long-running jobs block user interaction → "Script unresponsive" dialog.

Best Practice: Break long jobs into smaller ones.

8. Never Blocking
JavaScript execution never blocks on I/O. All blocking operations use callbacks:

javascript
// BAD (blocking - avoid):
const result = syncXHR(); // Blocks entire thread

// GOOD (non-blocking):
fetch(url).then(result => {
  // This runs later as a separate job
});
Exceptions: alert(), synchronous XHR (deprecated).

9. Agent Clusters and Memory Sharing
Multiple agents can share memory, forming an agent cluster.

What Can Share Memory?
Same-origin windows and their iframes
A window and its dedicated workers
Workers and their dedicated sub-workers
What Cannot Share Memory?
Different-origin windows
Shared workers (separate cluster)
Service workers (separate cluster)
Sharing Memory:
javascript
// Create shared memory
const buffer = new SharedArrayBuffer(1024);

// Post to worker
worker.postMessage(buffer);

// Both main thread and worker can now access same memory
Synchronization with Atomics:
javascript
const view = new Int32Array(sharedBuffer);

// Thread 1:
Atomics.store(view, 0, 42);

// Thread 2:
const value = Atomics.load(view, 0); // 42
Memory Model:
Atomic operations: Sequentially consistent (total ordering)
Non-atomic operations: Unordered (can race)
Best Practice: Avoid data races. Use atomics for shared memory.

10. Concurrency and Forward Progress
Blocking:
Some agents can be blocked (paused) waiting for another:

javascript
// In a shared worker:
const result = Atomics.wait(view, 0, 0); // Blocks until notified
Rules:

Only dedicated/shared workers can block
Windows and service workers cannot block
Blocked agents must eventually make progress
Termination:
Agents can be terminated (browser crash, user action)
Entire cluster gets terminated together (to avoid deadlocks)
Summary: The Complete Picture
Engine + Host: Engine runs JS, host provides APIs
Agent: Virtual JS processor with heap, queue, stack
Realm: Isolated environment with global object
Stack: Tracks synchronous function calls (LIFO)
Queue: Stores asynchronous jobs (FIFO)
Event Loop: Pulls jobs from queue, runs to completion
Microtasks vs Tasks: Promises drain before timers
Run-to-Completion: Jobs are atomic, no preemption
Never Blocking: I/O is always async (callbacks/promises)
Clusters: Agents share memory via SharedArrayBuffer
The Mental Model: JavaScript is a single-threaded, event-driven execution environment where synchronous code runs on a stack, asynchronous operations are queued as jobs, and the event loop orchestrates everything while never blocking on I/O.


Inheritance and the prototype chain In programming, inheritance refers to passing down characteristics from a parent to a child so that a new piece of code can reuse and build upon the features of an existing one. JavaScript implements inheritance by using objects. Each object has an internal link

pasted

can you teach me this :

6:02 PM
Complete Guide to JavaScript Inheritance and the Prototype Chain
I'll teach you JavaScript's prototype-based inheritance system from the ground up, building on what you learned about the execution model.

1. The Core Concept: What is Prototypal Inheritance?
In simple terms: Every JavaScript object has a hidden link to another object called its prototype. When you try to access a property that doesn't exist on an object, JavaScript automatically looks for it in the prototype, then the prototype's prototype, and so on.

Why This Matters
Unlike class-based languages (Java, C++), JavaScript doesn't copy behavior to new instances. Instead, objects delegate to their prototypes at runtime.

javascript
const animal = {
  eats: true,
  walk() {
    console.log("Animal walks");
  }
};

const rabbit = {
  jumps: true,
  __proto__: animal  // rabbit's prototype is animal
};

console.log(rabbit.eats);  // true (found in prototype!)
console.log(rabbit.jumps); // true (own property)
rabbit.walk();             // "Animal walks" (inherited method)
What happened?

rabbit doesn't have eats or walk
JavaScript checks rabbit.__proto__ (which is animal)
Finds them there and uses them
2. The Prototype Chain: Following the Links
Every object has an internal [[Prototype]] link. This creates a chain:

javascript
const o = {
  a: 1,
  b: 2,
  __proto__: {
    b: 3,
    c: 4,
    __proto__: {
      d: 5
    }
  }
};

// The chain looks like:
// o ---> {b:3, c:4} ---> {d:5} ---> Object.prototype ---> null

console.log(o.a); // 1 (own property)
console.log(o.b); // 2 (own property shadows prototype's b:3)
console.log(o.c); // 4 (found in first prototype)
console.log(o.d); // 5 (found in second prototype)
console.log(o.e); // undefined (not found anywhere)
Property Lookup Algorithm
When you access obj.property:

Check obj itself → Found? Return it
Check obj.[[Prototype]] → Found? Return it
Check obj.[[Prototype]].[[Prototype]] → Found? Return it
Keep going until [[Prototype]] is null
Return undefined
Property Shadowing
If both an object and its prototype have the same property, the object's own property wins:

javascript
const parent = { x: 10 };
const child = { 
  x: 20,  // shadows parent.x
  __proto__: parent 
};

console.log(child.x); // 20 (not 10)
3. Inheriting Methods and this Binding
Methods are just properties that happen to be functions:

javascript
const parent = {
  value: 2,
  method() {
    return this.value + 1;
  }
};

const child = {
  __proto__: parent
};

console.log(child.method()); // 3
Key Point: When child.method() executes:

The function is found in parent
But this refers to child (the object that called it)
So this.value looks for value on child first
Not found, so it checks child.__proto__.value → finds 2
Now watch this:

javascript
child.value = 10;
console.log(child.method()); // 11 (uses child.value now)
4. Constructor Functions: The Old Way
Manually setting __proto__ for every object is tedious. Constructor functions automate this.

How Constructors Work
javascript
function Box(value) {
  this.value = value;
}

// Add methods to the prototype (shared by all instances)
Box.prototype.getValue = function() {
  return this.value;
};

const box1 = new Box(1);
const box2 = new Box(2);

console.log(box1.getValue()); // 1
console.log(box2.getValue()); // 2

// Both share the SAME function:
console.log(box1.getValue === box2.getValue); // true
What new Does
When you call new Box(1):

Creates a new empty object: {}
Sets its [[Prototype]]: newObj.[[Prototype]] = Box.prototype
Calls Box with this bound to newObj: Box.call(newObj, 1)
Returns the object (unless the constructor explicitly returns something else)
The Prototype Chain with Constructors
javascript
function Box(value) {
  this.value = value;
}

Box.prototype.getValue = function() {
  return this.value;
};

const box = new Box(5);

// Prototype chain:
// box ---> Box.prototype ---> Object.prototype ---> null
Two Important Properties
1. Constructor.prototype (property of the function)

Object that becomes the [[Prototype]] of all instances
Example: Box.prototype
2. instance.[[Prototype]] (internal link of the object)

The actual prototype of the instance
Example: Object.getPrototypeOf(box)
Don't confuse them!

javascript
Box.prototype.constructor === Box; // true (default)
Object.getPrototypeOf(box) === Box.prototype; // true
5. Classes: The Modern Syntax
Classes are syntactic sugar over constructor functions:

javascript
class Box {
  constructor(value) {
    this.value = value;
  }
  
  getValue() {
    return this.value;
  }
}

const box = new Box(5);

// Under the hood, this is still:
// box ---> Box.prototype ---> Object.prototype ---> null
Classes vs Constructor Functions:

javascript
// These are equivalent:

// Constructor function
function Box(value) {
  this.value = value;
}
Box.prototype.getValue = function() {
  return this.value;
};

// Class
class Box {
  constructor(value) {
    this.value = value;
  }
  getValue() {
    return this.value;
  }
}
6. Building Inheritance Chains
With Constructor Functions
javascript
function Animal(name) {
  this.name = name;
}

Animal.prototype.eat = function() {
  console.log(`${this.name} is eating`);
};

function Dog(name, breed) {
  Animal.call(this, name); // Call parent constructor
  this.breed = breed;
}

// Set up inheritance chain
Object.setPrototypeOf(Dog.prototype, Animal.prototype);

Dog.prototype.bark = function() {
  console.log(`${this.name} barks!`);
};

const rex = new Dog("Rex", "Labrador");

// Prototype chain:
// rex ---> Dog.prototype ---> Animal.prototype ---> Object.prototype ---> null

rex.eat();  // "Rex is eating" (inherited from Animal)
rex.bark(); // "Rex barks!" (own to Dog)
console.log(rex.name); // "Rex" (own property)
With Classes (Much Easier!)
javascript
class Animal {
  constructor(name) {
    this.name = name;
  }
  
  eat() {
    console.log(`${this.name} is eating`);
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name); // Call parent constructor
    this.breed = breed;
  }
  
  bark() {
    console.log(`${this.name} barks!`);
  }
}

const rex = new Dog("Rex", "Labrador");
rex.eat();  // Works the same way
7. Built-in Prototypes
Every data type has a prototype with built-in methods:

javascript
// Arrays
const arr = [1, 2, 3];
// arr ---> Array.prototype ---> Object.prototype ---> null

arr.push(4);  // method from Array.prototype
arr.toString(); // method from Object.prototype

// Objects
const obj = {a: 1};
// obj ---> Object.prototype ---> null

obj.hasOwnProperty('a'); // method from Object.prototype

// Functions
function fn() {}
// fn ---> Function.prototype ---> Object.prototype ---> null

fn.call();  // method from Function.prototype
fn.toString(); // method from Object.prototype
Why Array.isArray() Exists
javascript
const arr1 = [1, 2];
const iframe = document.querySelector('iframe');
const arr2 = iframe.contentWindow.Array(1, 2);

// Different realms = different Array prototypes!
arr2 instanceof Array; // false (different Array!)
Array.isArray(arr2);   // true (checks internal type)
8. Common Patterns and Gotchas
Creating Objects with Different Prototypes
javascript
// 1. Object literal
const obj1 = {a: 1};
// obj1 ---> Object.prototype ---> null

// 2. Constructor function
function MyObj() {}
const obj2 = new MyObj();
// obj2 ---> MyObj.prototype ---> Object.prototype ---> null

// 3. Object.create()
const proto = {b: 2};
const obj3 = Object.create(proto);
// obj3 ---> proto ---> Object.prototype ---> null

// 4. Object with null prototype
const obj4 = Object.create(null);
// obj4 ---> null (no prototype at all!)
obj4.toString(); // Error! No Object.prototype
Checking Properties
javascript
const parent = {a: 1};
const child = Object.create(parent);
child.b = 2;

// Wrong way:
if (child.a) {} // true, but checks prototype too

// Right way for own properties:
child.hasOwnProperty('a'); // false
child.hasOwnProperty('b'); // true

// Modern way:
Object.hasOwn(child, 'a'); // false
Object.hasOwn(child, 'b'); // true

// To get own properties only:
Object.keys(child); // ['b']
Object.getOwnPropertyNames(child); // ['b']
Mutating Prototypes (Don't Do This!)
javascript
// BAD: Reassigning prototype breaks existing instances
function Box(value) {
  this.value = value;
}

const box1 = new Box(1);

// This breaks box1!
Box.prototype = {
  getValue() { return this.value; }
};

const box2 = new Box(2);

box2.getValue(); // Works
box1.getValue(); // Error! box1 has old prototype
Instead, mutate the existing prototype:

javascript
Box.prototype.getValue = function() {
  return this.value;
};
// Now all instances, old and new, get the method
9. Performance Considerations
Long Prototype Chains Are Slow
javascript
// Avoid deep chains:
// obj ---> p1 ---> p2 ---> p3 ---> p4 ---> p5 ---> ...

// Accessing nonexistent properties is especially slow:
obj.nonExistent; // Traverses entire chain, finds nothing
Property Enumeration
javascript
const parent = {a: 1};
const child = Object.create(parent);
child.b = 2;

// for...in loops over ALL enumerable properties (including inherited):
for (let key in child) {
  console.log(key); // 'b', 'a'
}

// Use hasOwnProperty to filter:
for (let key in child) {
  if (child.hasOwnProperty(key)) {
    console.log(key); // 'b' only
  }
}
10. Advanced Concepts
Closures + Prototypes
javascript
function createCounter() {
  let count = 0;
  
  function Counter() {}
  
  Counter.prototype.increment = function() {
    count++; // Closure over count
    return count;
  };
  
  return new Counter();
}

const c1 = createCounter();
const c2 = createCounter();

c1.increment(); // 1
c1.increment(); // 2
c2.increment(); // 1 (separate closure)
Changing Prototypes at Runtime
javascript
function Box(value) {
  this.value = value;
}

Box.prototype.getValue = function() {
  return this.value;
};

const box = new Box(10);
console.log(box.getValue()); // 10

// Change the method for ALL instances:
Box.prototype.getValue = function() {
  return this.value * 2;
};

console.log(box.getValue()); // 20 (instantly updated!)
11. Practical Examples
Example 1: Simple Inheritance
javascript
class Shape {
  constructor(color) {
    this.color = color;
  }
  
  describe() {
    return `A ${this.color} shape`;
  }
}

class Circle extends Shape {
  constructor(color, radius) {
    super(color);
    this.radius = radius;
  }
  
  area() {
    return Math.PI * this.radius ** 2;
  }
  
  describe() {
    return `A ${this.color} circle with radius ${this.radius}`;
  }
}

const c = new Circle('red', 5);
console.log(c.describe()); // "A red circle with radius 5"
console.log(c.area());     // 78.54...
Example 2: Mixins (Multiple Inheritance)
javascript
// Mixins allow adding behaviors from multiple sources
const canEat = {
  eat() {
    console.log(`${this.name} is eating`);
  }
};

const canWalk = {
  walk() {
    console.log(`${this.name} is walking`);
  }
};

class Person {
  constructor(name) {
    this.name = name;
  }
}

// Mix in behaviors
Object.assign(Person.prototype, canEat, canWalk);

const john = new Person('John');
john.eat();  // "John is eating"
john.walk(); // "John is walking"
Summary: Key Takeaways
Every object has a [[Prototype]] that it delegates to
Prototype chain: obj ---> prototype ---> ... ---> Object.prototype ---> null
Property lookup walks the chain until found or reaches null
this always refers to the calling object, even when the method is inherited
Constructor functions automatically set [[Prototype]] via .prototype
Classes are syntactic sugar over constructor functions
Inheritance is created by linking prototypes: Object.setPrototypeOf() or extends
Shared methods go on the prototype; instance data goes on the object
Never mutate built-in prototypes (except for polyfills)
Performance: Avoid deep chains and unnecessary prototype lookups
Would you like me to elaborate on any specific aspect, or create exercises to test your understanding?
