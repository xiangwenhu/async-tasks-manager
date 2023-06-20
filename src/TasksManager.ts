import EventEmitter from "node:events";
import { CommonTask, EVENT_NAME, ManagerOptions, TaskCompleteFun, TaskErrorFun, TaskProgressFun, TaskResult, TasksCancelFun, TasksCompleteFun, TasksCreator } from "./types";
import * as util from "./util";

const DEFAULT_OPTIONS: ManagerOptions = {
    enableDisturb: false,
    maxConcurrent: 5
}


function getEventName(event: EVENT_NAME) {
    return "on" + util.firstToUpper(event);
}

export default class TasksManager extends EventEmitter {
    protected tasks: CommonTask[];
    protected options: ManagerOptions;
    protected workingTaskCount: number = 0;
    protected isRunning: boolean = false;

    constructor(tasks: CommonTask[]) {
        super();
        this.options = Object.assign({}, DEFAULT_OPTIONS);
        this.tasks = [...tasks];
        this.isRunning = false;
    }

    /**
     * 添加任务
     * @param task
     */
    addTasks(tasks: CommonTask | CommonTask[]): void {
        if (!this.options.enableDisturb) {
            return;
        }
        const ts = Array.isArray(tasks) ? tasks : [tasks];
        this.tasks.push(...ts);
        if (!this.isRunning) {
            this.runNextTask();
        }
    }

    /**
     * 删除任务
     * @param taskId
     */
    delTask(taskId: string | number): void {
        if (!this.options.enableDisturb) {
            return;
        }
        const index = this.tasks.findIndex(t => t.id === taskId);
        if (index >= 0) {
            this.tasks = this.tasks.splice(index, 1);
        }
    }

    start(options: ManagerOptions = {}): any {
        if (this.isRunning) {
            return Promise.reject(new Error("tasks is already running"));
        }
        if (this.tasks.length === 0) {
            return Promise.reject(new Error("tasks is empty"));
        }
        this.isRunning = true;
        this.options = Object.assign({}, this.options, options);
        this.runNextTask();
        // return this;
    }

    cancel() {
        this.tasks = [];
        this.dispatch("cancel");
        this.isRunning = false;
    }

    private runNextTask() {
        if (this.tasks.length === 0) {
            return;
        }
        if (this.workingTaskCount >= this.options!.maxConcurrent!) {
            return;
        }
        const task = this.tasks.shift();
        this.doTask(task!);

        if (this.workingTaskCount < this.options?.maxConcurrent!) {
            this._onProgress();
            this.runNextTask();
        }
    }

    protected doTask(task: CommonTask): void {
        try {
            this.workingTaskCount++;
            //@ts-ignore
            const promise = task.task.apply(task.context || null, task.args || []);
            promise.
                then(res => this._onTaskComplete(task, res))
                .catch(err => this._onTaskError(task, err))
        } catch (err: any) {
            this._onTaskError(task, err);
        }
    }

    protected checkComplete() {
        if (this.tasks.length === 0 && this.workingTaskCount === 0) {
            this._onComplete();
            this.isRunning = false;
        }
    }

    public on(event: EVENT_NAME, fun: TaskErrorFun | TaskCompleteFun | TasksCompleteFun | TasksCancelFun | TaskProgressFun) {
        const eName = getEventName(event);
        super.on(eName, fun);
        return this;
    }

    public off(event: EVENT_NAME, fun: TaskErrorFun | TaskCompleteFun | TasksCompleteFun | TasksCancelFun | TaskProgressFun) {
        const eName = getEventName(event);
        super.off(eName, fun);
        return this;
    }

    onProgress(fun: TaskProgressFun) {
        return this.on("progress", fun);
    }

    onTaskError(fun: TaskErrorFun) {
        return this.on("taskError", fun);
    }

    onTaskComplete<R>(fun: TaskCompleteFun<R>) {
        return this.on("taskComplete", fun);
    }

    onComplete(fun: TaskCompleteFun) {
        return this.on("complete", fun);
    }

    onCancel(fun: TasksCancelFun) {
        return this.on("cancel", fun);
    }

    protected dispatch(event: EVENT_NAME, ...args: any[]) {
        if (!this.isRunning) {
            return;
        }
        const eName = getEventName(event);
        super.emit(eName, ...args);
    }


    protected _onProgress() {
        const leftCount = this.tasks.length;
        this.dispatch("progress", leftCount, this.workingTaskCount)
        this.checkComplete();
    }


    protected _onTaskError(task: CommonTask, err: Error): void {
        if (!this.isRunning) {
            return;
        }
        this.workingTaskCount--;
        this.dispatch("taskError", task, err);
        this.runNextTask();
        this._onProgress();

    }

    protected _onTaskComplete(task: CommonTask, result: any) {
        if (!this.isRunning) {
            return;
        }
        this.workingTaskCount--;
        this.dispatch("taskComplete", task, result);

        this.runNextTask();
        this._onProgress();
    }

    protected _onComplete() {
        this.dispatch("complete")
    }
}
