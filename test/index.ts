import { create, createPromise } from "../src/index";

const tasks = Array.from({ length: 5 }, (v, index) => {
    return index
}).map(index => {
    return {
        id: index,
        name: "task-" + index,
        task: () => new Promise((resolve, reject) => {
            if (index % 3 === 0) {
                throw new Error("Task " + index + " error")
            }
            setTimeout(() => resolve(index), Math.random() * 5 * 1000);
        }),
        extra: {
            id: index,
            uid: Math.random()
        }
    }
})

const tasksManager = createPromise(() => {
    return tasks;
});


tasksManager
    .onProgress((leftCount: number, runningCount: number) => {
        console.log(`剩余任务数量:${leftCount}, 进行中的任务数量:${runningCount}`);
    })
    .onTaskComplete((task, result) => {
        console.log(`Task complete: ${task.name}:`, result);
    })
    .onComplete(() => {
        console.log("Completed");
    })
    .onTaskError((task, error: any) => {
        console.log(`Task error: ${task.name}:`, error && error.message);
    })
    .onCancel(() => {
        console.log("Cancelled");
    })
    .startPromise().then(results => {
        console.log("results:", results)
    })

setTimeout(() => {
    // tasksManager.cancel();
}, 2000)