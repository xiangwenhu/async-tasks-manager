import TasksManager from "./TasksManager";
import { CommonTask, ManagerOptions, TaskResult } from "./types";

export default class PromiseTasksManager extends TasksManager {
    constructor(tasks: CommonTask[]) {
        super(tasks);
    }

    startPromise<R = any>(options: ManagerOptions = {}): Promise<TaskResult<R>[]> {
        return new Promise((resolve, reject) => {
            const results: TaskResult<R>[] = [];

            function onTaskComplete(task: CommonTask, result: R) {
                console.log(`Task complete: ${task.name}:`, result);
                results.push({
                    success: true,
                    id: task.id,
                    name: task.name,
                    result: result,
                    extra: task.extra
                })
            }

            function onTaskError(task: CommonTask, error: any) {
                console.log(`Task error: ${task.name}:`, error && error.message);
                results.push({
                    success: false,
                    id: task.id,
                    name: task.name,
                    error: error && error.message,
                    extra: task.extra
                })
            }

            const onCancel = () => {
                reject(new Error("cancelled"))
            }

            const onComplete = () => {
                resolve(results);
                super.off("taskError", onTaskError);
                super.off("taskComplete", onComplete);
                super.off("complete", onComplete);
            }

            super
                .onTaskComplete(onTaskComplete)
                .onTaskError(onTaskError)
                .onComplete(onComplete)
                .onCancel(onCancel)
                .start(options);
        })
    }

}