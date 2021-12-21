import { Geometry } from "../geometries/Geometry";
import { Material } from "../materials/Material";
import { SceneNode } from "../scenes/SceneNode";
import { Vector3 } from "../maths/Vector3";
import { Matrix4Utils } from "../utils/Matrix4Utils";
import { Matrix4 } from "../maths/Matrix4";

export class Object3D {
    private _geometry: Geometry;
    private _material: Material;
    private _type: string;

    private _scale: Vector3 = new Vector3([1, 1, 1]);
    private _rotation: Vector3 = new Vector3([0, 0, 0]);
    private _translation: Vector3 = new Vector3([0, 0, 0]);

    private parent = null;
    private children : Object3D[] = [];

    private modelViewMatrix = new Matrix4().identityMatrix();
    private normalMatrix = new Matrix4().identityMatrix();

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
        this._scale = new Vector3([x, y, z]);
    }
    public setScaleX(x: number) {
        this._scale = new Vector3([x, this.scale[1], this.scale[2]]);
    }
    public setScaleY(y: number) {
        this._scale = new Vector3([this.scale[0], y, this.scale[2]]);
    }
    public setScaleZ(z: number) {
        this._scale = new Vector3([this.scale[0], this.scale[1], z]);
    }
    public setScaleAll(scale : number) {
        this._scale = new Vector3([scale, scale, scale]);
    }

    public setRotation(x: number, y: number, z: number) {
        this._rotation = new Vector3([x, y, z]);
    }
    public setRotationX(x: number) {
        this._rotation = new Vector3([x, this.rotation[1], this.rotation[2]]);
    }
    public setRotationY(y: number) {
        this._rotation = new Vector3([this.rotation[0], y, this.rotation[2]]);
    }
    public setRotationZ(z: number) {
        this._rotation = new Vector3([this.rotation[0], this.rotation[1], z]);
    }
    public setRotationAll(rotation : number) {
        this._rotation = new Vector3([rotation, rotation, rotation]);
    }

    public setTranslation(x: number, y: number, z: number) {
        this._translation = new Vector3([x, y, z]);
    }
    public setTranslationX(x: number) {
        this._translation = new Vector3([x, this.translation[1], this.translation[2]]);
    }
    public setTranslationY(y: number) {
        this._translation = new Vector3([this.translation[0], y, this.translation[2]]);
    }
    public setTranslationZ(z: number) {
        this._translation = new Vector3([this.translation[0], this.translation[1], z]);
    }
    public setTranslationAll(translation : number) {
        this._translation = new Vector3([translation, translation, translation]);
    }


    get scale(): number[] {
        return Array.from(this._scale.positionArr);
    }

    get rotation(): number[] {
        return Array.from(this._rotation.positionArr);
    }

    get translation(): number[] {
        return Array.from(this._translation.positionArr);
    }
    public toDefaultTRS() {
        this.setRotationAll(0);
        this.setTranslationAll(0);
        this.setScaleAll(1);
    }
}