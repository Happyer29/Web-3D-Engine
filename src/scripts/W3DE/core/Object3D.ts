import { Geometry } from "../geometries/Geometry";
import { Material } from "../materials/Material";

export class Object3D {
    private _geometry: Geometry;
    private _material: Material;
    private _type: string;

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
    
}