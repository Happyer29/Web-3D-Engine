import { Point3 } from "../maths/Point3";
import { Mesh } from "./Mesh";

export class Scene {
    private meshes: Mesh[];
    private lines: Object[]; // todo Line class
    private points: Point3[];

    private ambientLight : Object; // todo Light class

    constructor() {

    }

    public addMesh(mesh: Mesh) {
        this.meshes.push(mesh);
    }

    public addLine(line: Object) { // todo Line class
        this.lines.push(line);
    }

    public addPoint(point: Point3) {
        this.points.push(point);
    }

    public getMeshByIndex(index : number) {
        return this.meshes[index];
    }
    public getLineByIndex(index : number) {
        return this.lines[index];
    }
    public getPointByIndex(index : number) {
        return this.points[index];
    }

}