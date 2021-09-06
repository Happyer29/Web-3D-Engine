interface plus {
    position?: 'topLeft' | 'bottomLeft' | 'topRight' | 'bottomRight';
}
interface line {
    position?: 'top' | 'left' | 'bottom' | 'right';
}
export declare class bg {
    private width;
    private height;
    private stage;
    private layer;
    private color;
    private config;
    constructor();
    createFirstSector(): import("konva/lib/Group").Group;
    createSector(posX: number, posY: number): import("konva/lib/Group").Group;
    createPlus(plusInfo: plus): import("konva/lib/shapes/Line").Line<{
        points: number[];
        stroke: string;
        strokeWidth: number;
    }>;
    createLine(lineInfo: line): any;
    private render;
}
export {};
