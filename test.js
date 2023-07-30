let checkErrBehavior = true;

function getData() {
    return new Promise((resolve, reject) => {
        if (checkErrBehavior) reject("Errorrrrrr");
        setTimeout(resolve("gotcha", "two"), 1000);
    });
}

function onFulfilled(data) {
    console.log(data);
}

function onRejected(error) {
    console.log(error);
}

const promise = getData();
promise.then(onFulfilled, onRejected);