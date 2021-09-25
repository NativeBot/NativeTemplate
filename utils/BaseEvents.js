const on = {};
const once = {};
const check = (event, callable) => {
    if(typeof event !== "symbol" && typeof event !== "string") throw new Error("Event name should be string or symbol!");
    if(!on[event]) on[event] = [];
    if(!once[event]) once[event] = [];
    if(typeof callable !== "function") throw new Error("Callable should be a function!")
};
module.exports = {
    on: (event, callable) => {
        module.exports.emit(module.exports.CREATE_EVENT, event, callable, module.exports.TYPE_ON)
        check(event, callable);
        on[event] = [...(on[event] || []), callable];
    },
    once: (event, callable) => {
        module.exports.emit(module.exports.CREATE_EVENT, event, callable, module.exports.TYPE_ONCE)
        check(event, callable);
        (once[event] = [...once[event], callable]);
    },
    off: (event, callable) => {
        check(event, callable);
        (on[event] = [...on[event]].filter(i => i !== callable));
        [...once[event]].filter(i => i !== callable);
        module.exports.emit(module.exports.REMOVE_EVENT, event, callable)
    },
    emit: (event, ...args) => {
        check(event, ()=>{});
        [...on[event], ...once[event]].forEach(i => i(...args));
        delete once[event];
        if (event !== module.exports.EMIT_EVENT)
            module.exports.emit(module.exports.EMIT_EVENT, event, ...args);
    },
    TYPE_ON: Symbol("on"),
    TYPE_ONCE: Symbol("once"),
    CREATE_EVENT: Symbol("createEvent"),
    REMOVE_EVENT: Symbol("removeEvent"),
    EMIT_EVENT: Symbol("emitEvent"),
};