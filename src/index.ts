import AsyncTasksManager from "./AsyncTasksManager";
import TasksManager from "./TasksManager";
import { TasksCreator } from "./types";

export function create(createFn: TasksCreator): TasksManager {
    const tasks = createFn();
    const manager = new TasksManager(tasks);
    return manager;
}

export function createPromise(createFn: TasksCreator): AsyncTasksManager {
    const tasks = createFn();
    const manager = new AsyncTasksManager(tasks);
    return manager;
}

