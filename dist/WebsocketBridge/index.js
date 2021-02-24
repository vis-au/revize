"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNewVersion = exports.broadcastNewVersion = exports.unsubscribeFromRemoteChanges = exports.subscribeToRemoteChanges = exports.connect = void 0;
const io = require("socket.io-client");
const subscribers = [];
let socket = null;
let id = -1;
function connect(url = "http://localhost", port = 5000, namespace = "") {
    socket = io(`${url}:${port}/${namespace}`);
    socket.on('broadcast_spec', function (msg) {
        onExternallyUpdatedSpec(msg);
        console.log("received new broadcasted spec", msg);
    });
    socket.on("set_id", function (msg) {
        id = msg.id;
        console.log("received new id", id);
    });
    socket.on("send_spec", function (msg) {
        if (msg.target !== id) {
            return;
        }
        onExternallyUpdatedSpec(msg);
        console.log("received new spec", msg);
    });
    socket.on("error", function (msg) {
        console.error(msg.message);
    });
    id = Math.random();
    socket.emit("register", { "id": id });
}
exports.connect = connect;
function onExternallyUpdatedSpec(message) {
    subscribers.forEach((callback) => callback(message.spec, message.version));
}
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
;
function broadcastNewVersion(spec, version) {
    socket.emit("update_spec", { spec, version });
}
exports.broadcastNewVersion = broadcastNewVersion;
;
function sendNewVersion(spec, version) {
    socket.emit("send_spec", { spec, version });
}
exports.sendNewVersion = sendNewVersion;
;
