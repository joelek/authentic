export type Theme = "dark" | "light";
export declare const StateManager: {
    create(): {
        visible: import("@joelek/bonsai").StateFromAttribute<boolean>;
        theme: import("@joelek/bonsai").StateFromAttribute<Theme>;
        modal_transition: import("@joelek/bonsai").StateFromAttribute<boolean>;
    };
};
export type StateManager = ReturnType<typeof StateManager["create"]>;
