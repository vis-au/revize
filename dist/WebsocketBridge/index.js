"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.broadcastNewVersion = exports.unsubscribeFromRemoteChanges = exports.subscribeToRemoteChanges = exports.onExternallyUpdatedSpec = exports.connect = void 0;
const io = require("socket.io-client");
const subscribers = [];
let socket = io();
function connect(url = "http://localhost", port = 5000, namespace = "") {
    socket = io(`${url}:${port}/${namespace}`);
    socket.on('broadcast_spec', function (msg) {
        onExternallyUpdatedSpec();
        console.log(msg);
    });
    socket.emit("register", {});
}
exports.connect = connect;
function onExternallyUpdatedSpec() {
    subscribers.forEach((callback) => callback());
}
exports.onExternallyUpdatedSpec = onExternallyUpdatedSpec;
;
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
function broadcastNewVersion(spec) {
    socket.emit("update_spec", { spec });
}
exports.broadcastNewVersion = broadcastNewVersion;
