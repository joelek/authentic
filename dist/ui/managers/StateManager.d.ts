export type Theme = "dark" | "light";
export type HideShow = "hide" | "show";
export declare const StateManager: {
    create(): {
        visible: import("@joelek/bonsai").StateFromAttribute<boolean>;
        passwords: import("@joelek/bonsai").StateFromAttribute<HideShow>;
        theme: import("@joelek/bonsai").StateFromAttribute<Theme>;
        modal_transition: import("@joelek/bonsai").StateFromAttribute<boolean>;
    };
};
export type StateManager = ReturnType<typeof StateManager["create"]>;
