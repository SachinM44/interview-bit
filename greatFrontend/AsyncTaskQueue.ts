// ///here what we have to do is u need to build the system that runs the task where with cucorency count (means number of the task that you need) and but it can pus it  to limit , that task task maneger can able to run the task only with the limit , and and (means the cuncurencly==0), where it can run both the task and the if anything fails it will it will grasfully resolve it easily ,
// 179. Implement AsyncTaskQueue
// JavaScript
// met this in an interview?
//  11
// Add to my list
// Share

// easy  883 accepted / 2449 tried

//  Well done!You have solved it!unsubmit

// ads via Carbon
// Check out the latest remote job listings from the leading job board for designers, developers, and creative pros.
// ads via Carbon
// Design and implement an AsyncTaskQueue class that manages the execution of asynchronous tasks with a specified maximum concurrency limit. The queue should execute tasks in the order they are added (FIFO) and ensure that no more than the specified number of tasks run concurrently. If a task’s Promise rejects, the rejection should be silently ignored, allowing the queue to continue processing remaining tasks.

// class AsyncTaskQueue {
//     constructor(concurrency) {
//         // Initialize the queue with the specified concurrency limit
//     }
//     queue(task) {
//         // Add an async task to the queue
//     }
// }
// Example usage

// const queue = new AsyncTaskQueue(2); // Allow up to 2 tasks to run concurrently
// // Example async tasks
// const task1 = () => new Promise((resolve) => setTimeout(() => resolve("Task 1 done"), 1000));
// const task2 = () => new Promise((resolve, reject) => setTimeout(() => reject("Task 2 failed"), 500));
// const task3 = () => new Promise((resolve) => setTimeout(() => resolve("Task 3 done"), 200));
// // Queue tasks
// queue.queue(task1); // Starts immediately
// queue.queue(task2); // Starts immediately (concurrency = 2)
// queue.queue(task3); // Waits until one of the first two tasks completes
// prev

class AsyncTaskQueue {
  public tasks: (() => Promise<void>)[] = [];
  public runningTaskCount: number;
  public concurrency: number;
  constructor(concurrency: number) {
    /// you need more custrocture which needs the all things
    this.tasks = [];
    this.concurrency = concurrency;
    this.runningTaskCount = 0;
  }

  queue(task: () => Promise<void>) {
    this.tasks.push(task);
    /// once you push it to ques next call the nextRun method to  push that task to execution task and so this ques method will push into that
    this.nextTask();
  }

  nextTask() {
    if (this.runningTaskCount < this.concurrency && this.tasks.length > 0) {
      ////remove the first task from task , and push it to executionStack
      const task = this.tasks.shift()!;

      this.runningTaskCount++;
      this.executionStack(task);
    }
  }

  executionStack(task: () => Promise<void>) {
    task()
      .then(() => {})
      .catch(() => {})
      .finally(() => {
        this.runningTaskCount--;
        this.nextTask();
      });
  }
}
