const CustomPromise = require("../CustomPromise.js");

const DEFAULT_VALUE = "default"

function promise({ value = DEFAULT_VALUE, fail = false } = {}) {
    return new CustomPromise((resolve, reject) => {
        fail ? reject(value) : resolve(value)
    })
}

describe("then", () => {
    it("with no chaining", () => {
        const res = promise();
        return res.then(v => expect(v).toEqual(DEFAULT_VALUE))
    })

    it("with multiple thens for same promise", () => {
        const checkFunc = v => expect(v).toEqual(DEFAULT_VALUE)
        const mainPromise = promise()
        const promise1 = mainPromise.then(checkFunc)
        const promise2 = mainPromise.then(checkFunc)
        return Promise.allSettled([promise1, promise2])
    })

    it("with then and catch", () => {
        const checkFunc = v => expect(v).toEqual(DEFAULT_VALUE)
        const failFunc = v => expect(1).toEqual(2)
        const resolvePromise = promise().then(checkFunc, failFunc)
        const rejectPromise = promise({ fail: true }).then(failFunc, checkFunc)
        return Promise.allSettled([resolvePromise, rejectPromise])
    })

    it("with chaining", () => {
        return promise({ value: 3 })
            .then(v => v * 4)
            .then(v => expect(v).toEqual(12))
    })
})

describe("catch", () => {
    it("with no chaining", () => {
        return promise({ fail: true }).catch(v => expect(v).toEqual(DEFAULT_VALUE))
    })

    it("with multiple catches for same promise", () => {
        const checkFunc = v => expect(v).toEqual(DEFAULT_VALUE)
        const mainPromise = promise({ fail: true })
        const promise1 = mainPromise.catch(checkFunc)
        const promise2 = mainPromise.catch(checkFunc)
        return Promise.allSettled([promise1, promise2])
    })

    it("with chaining", () => {
        return promise({ value: 3 })
            .then(v => {
                throw v * 4
            })
            .catch(v => expect(v).toEqual(12))
    })
})

describe("static methods", () => {
    it("resolve", () => {
        return CustomPromise.resolve(DEFAULT_VALUE).then(v =>
            expect(v).toEqual(DEFAULT_VALUE)
        )
    })

    it("reject", () => {
        return CustomPromise.reject(DEFAULT_VALUE).catch(v =>
            expect(v).toEqual(DEFAULT_VALUE)
        )
    })
})

