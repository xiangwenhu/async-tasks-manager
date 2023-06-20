export type AsyncTask<R = any> = () => Promise<R>;

export interface TaskInfo<T> {
    /**
     * 任务id
     */
    id?: number | string;
    /**
     * 任务名
     */
    name?: string;
    /**
     * 任务
     */
    task: T,
    /**
     * 额外的数据，结果集可以用来排序等
     */
    extra?: any,
    /**
     * 函数执行时的参数
     */
    args?: any[],
    /**
     * 任务执行上下文
     */
    context?: any,
}


export interface TaskResult<R = any, E = Error, EE = any> {
    /**
     * 任务id
     */
    id?: number | string;
    /**
     * 任务名
     */
    name?: string;
    /**
     * 是否成功
     */
    success: boolean;
    /**
     * 结果
     */
    result?: R;
    /**
     * 异常信息
     */
    error?: E;
    /**
     * 额外的数据
     */
    extra?: EE
}

export type CommonTask<T = any> = TaskInfo<AsyncTask<T>>;

export interface ManagerOptions {
    /**
     * 可以被干扰
     */
    enableDisturb?: boolean;
    /**
     * 最大并行任务数量
     */
    maxConcurrent?: number;
    // /**
    //  * 发生错误时的回调
    //  * @param task
    //  */
    // onTaskError?<T>(task: CommonTask<T>, error: Error | string): void;

    // /**
    //  * 当某个任务完成
    //  * @param task
    //  * @param result
    //  */
    // onTaskComplete?<T = any, R = any>(task: CommonTask<T>, result: R): void;

    // /**
    //  * 当任务数量为0
    //  */
    // onComplete?(): void;
    // /**
    //  * 取消的时候
    //  */
    // onCancel?(): void;
    // /**
    //  * 进度变化
    //  * @param left 
    //  * @param running 
    //  */
    // onProgress?(left: number, running: number): void;
}


export type TasksCreator = (...args: any[]) => CommonTask[];

export type TaskErrorFun<E = Error> = (task: CommonTask, error: E) => void;
export type TaskCompleteFun<R = any> = (task: CommonTask, result: R) => void;
export type TaskProgressFun = (left: number, running: number) => void;
export type TasksCompleteFun = () => void;
export type TasksCancelFun = () => void;

export type EVENT_NAME = "progress" | "taskError" | "taskComplete" | "complete" | "cancel";
