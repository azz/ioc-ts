export interface InjectFn<TDeps> {
    <TRet>(func: (deps: TDeps) => TRet): () => TRet;
    <TRet, TArg1>(func: (deps: TDeps, arg1: TArg1) => TRet): (arg1: TArg1) => TRet;
    <TRet, TArg1, TArg2>(func: (deps: TDeps, arg1: TArg1, arg2: TArg2) => TRet): (arg1: TArg1, arg2: TArg2) => TRet;
}
export interface Container<T> {
    define<U>(things: U): Container<T & U>;
    combine<U>(container: Container<U>): Container<T & U>;
    inject: InjectFn<T>;
}
export default function container<T>(things?: T): Container<T>;
