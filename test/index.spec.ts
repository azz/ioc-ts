import 'mocha'
import {expect} from 'chai'

import container from '../lib/index';

describe('inject', () => {
    let _container = container()
    beforeEach(() => {
        _container = container()
    })

    it('sends correct args', () => {
        let called = false
        function doThing(deps, x: number, y: string) {
            called = true
            expect(x).to.equal(1)
            expect(y).to.equal('2')
        }

        const realDoThing = _container.inject(doThing)
        realDoThing(1, '2')
        expect(called).to.be.true
    })

    it('passes in deps', () => {
        let dep1 = 1
        const finalContainer = _container.define({ dep1 })

        function doThing({ dep1 }: { dep1: number }, arg1, arg2) {
            expect(dep1).to.equal(1)
            return 1
        }

        const realDoThing = finalContainer.inject(doThing)
        realDoThing(null, null)
    })

    it('passes in multiple deps', () => {
        let dep1 = 1
        let dep2 = 'str'
        const finalContainer = _container.define({ 
            dep1,
            dep2,
        })

        function doThing({ dep1, dep2 }: { dep1: number, dep2: string },
            arg1, arg2
        ) {
            expect(dep2).to.equal('str')
        }

        const realDoThing = finalContainer.inject(doThing)
        realDoThing(null, null)
    })

    it('does not cross-contaminate containers', () => {
        const c1 = container({ x: 'foo' })
        const c2 = container({ y: 42 })
        const c3 = container({ x: 'bar' })

        function needsXFoo(deps: { x: string }) {
            expect(deps.x).to.equal('foo')
        }
        function needsXBar(deps: { x: string }) {
            expect(deps.x).to.equal('bar')
        }
        function needsY(deps: { y: number }) {
            expect(deps.y).to.equal(42)
        }
        function needsXandY(deps: { x: string, y: number }) {
            expect(deps.x).to.equal('foo')
            expect(deps.y).to.equal(42)
        }

        c1.inject(needsXFoo)()
        // c1.inject(needsY)() // expected compiler error
        c2.inject(needsY)()
        // c2.inject(needsXFoo)() // expected compiler error

        c3.inject(needsXBar)()
    })
})

describe('combine', () => {
    it('can combine two containers', () => {
        const c1 = container({ x: 'foo' })
        const c2 = container({ y: 'bar' })

        const c3 = c1.combine(c2)

        function xAndY({ x, y }, arg: number) {
            expect(x).to.equal('foo')
            expect(y).to.equal('bar')
            expect(arg).to.equal(1)
        }

        c3.inject(xAndY)(1);
    })

    it('does not mutate input containers', () => {
        const c1 = container({ b: 3, x: 'foo' })
        const c2 = container({ a: 3, y: 'bar' })

        const c3 = c1.combine(c2)

        function hasNoY(deps: { x: string }) {
            expect(deps['y']).to.be.undefined
        }
        function hasY({ y }: { y: string }) {
            expect(y).not.to.be.undefined
        }
        function hasNoX(deps: { y: string }) {
            expect(deps['x']).to.be.undefined
        }
        function hasX({ x }: { x: string }) {
            expect(x).not.to.be.undefined
        }

        c1.inject(hasNoY)()
        c2.inject(hasNoX)()
        c2.inject(hasY)()
        c1.inject(hasX)()
    })
})

describe('demo', () => {
    // File: area.ts
    /*export default*/ function area(deps: { PI: number }, r: number) {
        return 2 * deps.PI * r
    }
    /*export*/ type AreaFunction = (radius: number) => number

    // File main.ts
    // import foo from './foo'
    const runtimeContainer = container({
        PI: Math.PI,
        somethingElse: 'foo'
    })

    it('integrates successfully', () => {
        function render(getArea: AreaFunction) {
            expect(getArea(42)).to.equal(Math.PI * 2 * 42)
        }

        const _area = runtimeContainer.inject(area)
        render(_area)
    })

    it('can be mocked', () => {
        const mockContainer = runtimeContainer.define({
            PI: 0
        })

        function render(getArea: AreaFunction) {
            expect(getArea(42)).to.equal(0)
        }

        const _area = mockContainer.inject(area)
        render(_area)
    })

})