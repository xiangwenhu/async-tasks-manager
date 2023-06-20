## 功能
解决多个异步问题



## 示例
示例代码
```ts
import { create, createPromise } from "../index";

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
```
输出
```txt
剩余任务数量:4, 进行中的任务数量:1
剩余任务数量:3, 进行中的任务数量:2
剩余任务数量:2, 进行中的任务数量:3
剩余任务数量:1, 进行中的任务数量:4
Task error: task-0: Task 0 error
Task error: task-0: Task 0 error
剩余任务数量:0, 进行中的任务数量:4
Task error: task-3: Task 3 error
Task error: task-3: Task 3 error
剩余任务数量:0, 进行中的任务数量:3
Task complete: task-1: 1
Task complete: task-1: 1
剩余任务数量:0, 进行中的任务数量:2
Task complete: task-4: 4
Task complete: task-4: 4
剩余任务数量:0, 进行中的任务数量:1
Task complete: task-2: 2
Task complete: task-2: 2
剩余任务数量:0, 进行中的任务数量:0
Completed
results: [
  {
    success: false,
    id: 0,
    name: 'task-0',
    error: 'Task 0 error',
    extra: { id: 0, uid: 0.7841318043539995 }
  },
  {
    success: false,
    id: 3,
    name: 'task-3',
    error: 'Task 3 error',
    extra: { id: 3, uid: 0.1883135291149982 }
  },
  {
    success: true,
    id: 1,
    name: 'task-1',
    result: 1,
    extra: { id: 1, uid: 0.7387196513922418 }
  },
  {
    success: true,
    id: 4,
    name: 'task-4',
    result: 4,
    extra: { id: 4, uid: 0.8263343642154788 }
  },
  {
    success: true,
    id: 2,
    name: 'task-2',
    result: 2,
    extra: { id: 2, uid: 0.9270247933184399 }
  }
]
```


## TODO
- [ ] 测试用例
- [ ] 子进程