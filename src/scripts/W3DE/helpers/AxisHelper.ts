import { Axes } from "../geometries/Axes";
import { Line } from "../objects/Line";
import { Material } from "../W3DE";

export class AxisHelper extends Line {
    constructor(size : number) {
        super(new Axes(size), Material.emptyMaterial());
    }
}