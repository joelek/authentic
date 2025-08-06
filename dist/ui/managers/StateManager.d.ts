export type Theme = "dark" | "light";
export declare const StateManager: {
    create(): {
        visible: import("@joelek/bonsai").StateFromAttribute<boolean>;
        theme: import("@joelek/bonsai").StateFromAttribute<Theme>;
    };
};
export type StateManager = ReturnType<typeof StateManager["create"]>;
