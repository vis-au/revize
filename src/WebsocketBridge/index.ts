import * as io from 'socket.io-client';

export type UpdateCallback = (spec: any, version: number) => void;

const subscribers: UpdateCallback[] = [];
let socket: any = null;
let id: number = -1;

export function connect(url: string="http://localhost", port: number=5000, namespace: string="") {
  socket = io(`${url}:${port}/${namespace}`);

  socket.on('broadcast_spec', function(msg: any) {
    onExternallyUpdatedSpec(msg);
    console.log("received new broadcasted spec", msg);
  });

  socket.on("set_id", function(msg: any) {
    id = msg.id;
    console.log("received new id", id);
  });

  socket.on("send_spec", function(msg: any) {
    if (msg.target !== id) {
      return;
    }

    onExternallyUpdatedSpec(msg);
    console.log("received new spec", msg);
  });

  socket.on("error", function(msg: any) {
    console.error(msg.message);
  });

  id = Math.random();
  socket.emit("register", {"id": id});
}

function onExternallyUpdatedSpec(message: {spec: any, version: number}) {
  subscribers.forEach((callback: UpdateCallback) => callback(message.spec, message.version));
};

export function subscribeToRemoteChanges(callback: UpdateCallback) {
  subscribers.push(callback);
};

export function unsubscribeFromRemoteChanges(callback: UpdateCallback) {
  const indexInSubscribers = subscribers.indexOf(callback);

  if (indexInSubscribers > -1) {
    subscribers.splice(indexInSubscribers, 1);
  }
};

export function broadcastNewVersion(spec: any, version: any) {
  socket.emit("update_spec", { spec, version });
};

export function sendNewVersion(spec: any, version: any) {
  socket.emit("send_spec", { spec, version });
};
