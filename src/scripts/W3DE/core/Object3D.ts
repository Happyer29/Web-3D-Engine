import { Geometry } from "../geometries/Geometry";
import { Material } from "../materials/Material";
import { Vector3 } from "../W3DE";

export class Object3D {
    private _geometry: Geometry;
    private _material: Material;
    private _type: string;

    private scale: number[] = [1, 1, 1];
    private rotation: number[] = [0, 0, 0];
    private translation: number[] = [0, 0, 0];

    constructor(geometry: Geometry, material?: Material) {
        this._geometry = geometry;
        if (material) this._material = material;
    }

    public get geometry(): Geometry {
        return this._geometry;
    }

    public get material(): Material {
        return this._material;
    }

    public get type(): string {
        return this._type;
    }
    public set type(value: string) {
        this._type = value;
    }

    public set material(value: Material) {
        this._material = value;
    }

    public setScale(x: number, y: number, z: number) {
        this.scale = [x, y, z];
    }

    public setRotation(x: number, y: number, z: number) {
        this.rotation = [x, y, z];
    }

    public setTranslation(x: number, y: number, z: number) {
        this.translation = [x, y, z];
    }

}