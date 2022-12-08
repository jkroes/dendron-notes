---
id: j31txbrwk66rhawpjsfbxhw
title: JS
desc: ''
updated: 1670441974822
created: 1670393947348
---

# [Promises, async/await](https://javascript.info/async)

# https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Introducing

Asynchronous function
: A function that finishes execution some, possibly a long, time after they are called. The function runs in the background, after returning immediately, to avoid blocking the calling program, or caller. 

Event handler
: A callback function that is called in response to some event. Typically the event and callback function are passed to an event listener. 

Callback function
: A function that is passed into another function, with the expectation that the callback will be called at the appropriate time. 

Promise
: An object returned by an asynchronous function, which represents the current state of the operation. The asynchronous function often continues to execute after the promise is (immediately) returned.

Early asynchronous APIs used event listeners and event handlers, where the event is the completion of an asynchronous function. Modern APIs are based on promises.

With a promise-based API, the asynchronous function starts the operation and returns a Promise object. You can then attach handlers to this promise object, and these handlers will be executed when the operation has succeeded or failed.

