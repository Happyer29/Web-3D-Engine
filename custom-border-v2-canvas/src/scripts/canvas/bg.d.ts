interface plus {
    position?: 'topLeft' | "bottomLeft";
}
interface line {
    position?: 'top' | "left" | "bottom";
}
export declare class bg {
    private width;
    private height;
    private stage;
    private layer;
    private color;
    private config;
    constructor();
    createSector(posX: number, posY: number): import("konva/lib/Group").Group;
    createPlus(plusInfo: plus): any;
    createLine(lineInfo: line): any;
}
export {};
