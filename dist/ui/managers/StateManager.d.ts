export declare const StateManager: {
    create(): {
        visible: import("@joelek/bonsai").StateFromAttribute<boolean>;
    };
};
export type StateManager = ReturnType<typeof StateManager["create"]>;
