"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.broadcastNewVersion = exports.unsubscribeFromRemoteChanges = exports.subscribeToRemoteChanges = exports.previousInQueue = exports.nextInQueue = exports.connect = void 0;
const io = require("socket.io-client");
const subscribers = [];
let socket = null;
let id = -1;
function connect(url = "http://localhost", port = 5000, namespace = "") {
    socket = io(`${url}:${port}/${namespace}`);
    socket.on('broadcast_spec', function (msg) {
        onExternallyUpdatedSpec(msg);
        console.log(msg);
    });
    socket.on("send_spec", function (msg) {
        if (msg.target !== id) {
            return;
        }
        onExternallyUpdatedSpec(msg);
        console.log(msg);
    });
    id = Math.random();
    socket.emit("register", { "id": id });
}
exports.connect = connect;
function onExternallyUpdatedSpec(message) {
    subscribers.forEach((callback) => callback(message.spec, message.version));
}
;
function nextInQueue(spec, version) {
    socket.emit("get_next", { spec, version, source: id });
}
exports.nextInQueue = nextInQueue;
;
function previousInQueue(spec, version) {
    socket.emit("get_previous", { spec, version, source: id });
}
exports.previousInQueue = previousInQueue;
function subscribeToRemoteChanges(callback) {
    subscribers.push(callback);
}
exports.subscribeToRemoteChanges = subscribeToRemoteChanges;
;
function unsubscribeFromRemoteChanges(callback) {
    const indexInSubscribers = subscribers.indexOf(callback);
    if (indexInSubscribers > -1) {
        subscribers.splice(indexInSubscribers, 1);
    }
}
exports.unsubscribeFromRemoteChanges = unsubscribeFromRemoteChanges;
function broadcastNewVersion(spec, version) {
    socket.emit("update_spec", { spec, version });
}
exports.broadcastNewVersion = broadcastNewVersion;
