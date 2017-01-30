# ioc.ts

TypeScript Dependency Injection

## Features

 * [x] Type safe
 * [x] Tiny (614 bytes before minification or compression)
 * [x] No classes required
 * [x] Supports multiple containers

## Install

```bash
npm i -S ioc-ts
```

## API

Import:

```
import container from 'ioc-ts'
```

### `container(deps?: { [key: string]: any }): Container`

Create a container, optionally specifying dependencies.

Dependencies should be an object. Returns the container.

```ts
const c = container({
    x: 'foo',
    y: 'bar',
})
```

### `Container#define(deps?: { [key: string]: any }): Container`

Add additional dependencies to a container. Does not mutate underlying
container. Can be chained.

```ts
const c = container({ x: 'foo' }).define({ y: 1 }).define({ z: true })
// c now has x, y and z.
```

### `Container#combine(container: Container): Container`

Combine the dependencies of two containers. Does not mutate underlying
container. Can be chained.

```ts
const c1 = container({ x: 'foo' })
const c2 = container({ y: 1 })
const c = container({ z: true }).combine(c1).combine(c2)
// c now has x, y and z.
```

### `Container#inject(fn: Function): Function`

Inject a function with dependencies from a container.

Container must type-match the dependencies of the target function.

Target function must specify dependencies as the first argument.

```ts
function iNeedDependencies(deps: { x: string }, arg1: number) {
    console.log(deps.x, arg1)
}

const c = container({ x: 'foo' })
const iHasDependencies = c.inject(iNeedDependencies)
iHasDependencies(42) // logs 'foo', 42
```
