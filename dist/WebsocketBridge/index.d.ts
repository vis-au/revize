export declare type UpdateCallback = () => void;
export declare function connect(url?: string, port?: number, namespace?: string): void;
export declare function onExternallyUpdatedSpec(): void;
export declare function subscribeToRemoteChanges(callback: UpdateCallback): void;
export declare function unsubscribeFromRemoteChanges(callback: UpdateCallback): void;
export declare function broadcastNewVersion(spec: any): void;
