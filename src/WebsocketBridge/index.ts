import * as io from 'socket.io-client';

export type UpdateCallback = () => void;

const subscribers: UpdateCallback[] = [];
let socket = io();

export function connect(url: string="http://localhost", port: number=5000, namespace: string="") {
  socket = io(`${url}:${port}/${namespace}`);

  socket.on('broadcast_spec', function(msg: any) {
    onExternallyUpdatedSpec();
    console.log(msg)
  });

  socket.emit("register", {});
}

export function onExternallyUpdatedSpec() {
  subscribers.forEach((callback: UpdateCallback) => callback());
};

export function subscribeToRemoteChanges(callback: UpdateCallback) {
  subscribers.push(callback);
};

export function unsubscribeFromRemoteChanges(callback: UpdateCallback) {
  const indexInSubscribers = subscribers.indexOf(callback);

  if (indexInSubscribers > -1) {
    subscribers.splice(indexInSubscribers, 1);
  }
}

export function broadcastNewVersion(spec: any) {
  socket.emit("update_spec", { spec });
}
