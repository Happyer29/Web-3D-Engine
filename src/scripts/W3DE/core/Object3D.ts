import { Geometry } from "../geometries/Geometry";
import { Material } from "../materials/Material";
import { Vector3 } from "../W3DE";

export class Object3D {
    private _geometry: Geometry;
    private _material: Material;
    private _type: string;

    private _scale: number[] = [1, 1, 1];
    private _rotation: number[] = [0, 0, 0];
    private _translation: number[] = [0, 0, 0];

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
        this._scale = [x, y, z];
    }

    public setRotation(x: number, y: number, z: number) {
        this._rotation = [x, y, z];
    }

    public setTranslation(x: number, y: number, z: number) {
        this._translation = [x, y, z];
    }

    get scale(): number[] {
        return this._scale;
    }

    get rotation(): number[] {
        return this._rotation;
    }

    get translation(): number[] {
        return this._translation;
    }
}