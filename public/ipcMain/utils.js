
function IPC(message, handler, async = true) {
    let wrappedHandler;
    if (async)
        wrappedHandler = async (_event, ...params) => handler(...params);
    else
        wrappedHandler = (_event, ...params) => handler(...params);
    return [message, wrappedHandler];
}

module.exports = { IPC }  