
export interface InjectFn<TDeps>  {
    <TRet>(func: (deps: TDeps) => TRet): () => TRet
    <TRet, TArg1>(func: (deps: TDeps, arg1: TArg1) => TRet): (arg1: TArg1) => TRet
    <TRet, TArg1, TArg2>(func: (deps: TDeps, arg1: TArg1, arg2: TArg2) => TRet): (arg1: TArg1, arg2: TArg2) => TRet
}

export interface Container<T> {
    define<U>(things: U): Container<T & U>
    combine<U>(container: Container<U>): Container<T & U>;
    inject: InjectFn<T>
}

const thingsSymbol = Symbol('things')

export default function container<T>(things?: T): Container<T> {
    let _things = Object.assign({}, things)
    const methods = {
        define(moreThings) {
            return container(Object.assign(
                {}, _things, moreThings
            ))
        },
        combine(otherContainer) {
            return methods.define(otherContainer[thingsSymbol])
        },
        inject: <InjectFn<T>>function (input: Function) {
            return input.bind(null, _things)
        },
        [thingsSymbol]: _things
    }
    return methods
}
