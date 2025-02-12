const STATE = {
    FULFILLED: "FULFILLED",
    REJECTED: "REJECTED",
    PENDING: "PENDING"
};

class CustomPromise {
    constructor(executor) {
        this._data = null;
        this._state = STATE.PENDING;
        this._handlers = [];

        let resolve = (result) => {
            queueMicrotask(() => {
                if (this._state !== STATE.PENDING) return;

                this._state = STATE.FULFILLED;
                this._data = result;
                this._handlers.forEach(callback => {
                    try {
                        const value = callback.onFulfilled(result);
                        callback.resolve(value);
                    } catch (error) {
                        callback.reject(error);
                    }
                });
                this._handlers = [];
            });
        }

        let reject = (error) => {
            queueMicrotask(() => {
                if (this._state !== STATE.PENDING) return;

                this._state = STATE.REJECTED;
                this._data = error;
                this._handlers.forEach(callback => {
                    try {
                        callback.onRejected(error);
                    } catch (error) {
                        callback.reject(error);
                    }
                });
                this._handlers = [];
            });
        }

        try {
            executor(resolve, reject);
        } catch (error) {
            reject(error);
        }
    }

    then(onFulfilled, onRejected) {
        return new CustomPromise((resolve, reject) => {
            if (this._state === STATE.FULFILLED) {
                queueMicrotask(() => {
                    try {
                        const result = onFulfilled ? onFulfilled(this._data) : this._data;
                        resolve(result);
                    } catch (error) {
                        reject(error);
                    }
                });
            } else if (this._state === STATE.REJECTED) {
                queueMicrotask(() => {
                    try {
                        const result = onRejected ? onRejected(this._data) : this._data;
                        resolve(result);
                    } catch (error) {
                        reject(error);
                    }
                });
            } else {
                this._handlers.push({
                    onFulfilled: (value) => {
                        try {
                            const result = onFulfilled ? onFulfilled(value) : value;
                            resolve(result);
                        } catch (error) {
                            reject(error);
                        }
                    },
                    onRejected: (reason) => {
                        try {
                            const result = onRejected ? onRejected(reason) : reason;
                            resolve(result);
                        } catch (error) {
                            reject(error);
                        }
                    },
                    resolve,
                    reject
                });
            }
        });
    }


    catch(onRejected) {
        return this.then(null, onRejected);
    };

    finally(onFinally) {
        return this.then(
            (value) => {
                return CustomPromise.resolve(onFinally()).then(() => value);
            },
            (reason) => {
                return CustomPromise.resolve(onFinally()).then(() => { throw reason; });
            }
        );
    };

    static resolve(value) {
        return new CustomPromise((resolve) => resolve(value));
    };

    static reject(reason) {
        return new CustomPromise((_, reject) => reject(reason));
    };
}

const getPromise = (data) => {
    return new CustomPromise((resolve, reject) => {
        setTimeout(() => {
            data ? resolve('Promise resolved') :
                reject('Promise rejected');
        }, 1000);
    });
};

getPromise(1).then((data) => {
    console.log(data);
}).catch((error) => {
    console.log(error);
});


module.exports = CustomPromise;