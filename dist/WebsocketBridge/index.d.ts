export declare type UpdateCallback = (spec: any, version: number) => void;
export declare function connect(url?: string, port?: number, namespace?: string): void;
export declare function nextInQueue(spec: any, version: any): void;
export declare function previousInQueue(spec: any, version: any): void;
export declare function subscribeToRemoteChanges(callback: UpdateCallback): void;
export declare function unsubscribeFromRemoteChanges(callback: UpdateCallback): void;
export declare function broadcastNewVersion(spec: any, version: any): void;
