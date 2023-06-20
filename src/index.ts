import PromiseTasksManager from "./PromiseTasksManager";
import TasksManager from "./TasksManager";
import { TasksCreator } from "./types";

export function create(createFn: TasksCreator): TasksManager {
    const tasks = createFn();
    const manager = new TasksManager(tasks);
    return manager;
}

export function createPromise(createFn: TasksCreator): PromiseTasksManager {
    const tasks = createFn();
    const manager = new PromiseTasksManager(tasks);
    return manager;
}

