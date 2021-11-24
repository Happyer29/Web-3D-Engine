import { Geometry } from "../geometries/Geometry";
import { Material } from "../materials/Material";

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
    public setScaleX(x: number) {
        this._scale = [x, this.scale[1], this.scale[2]];
    }
    public setScaleY(y: number) {
        this._scale = [this.scale[0], y, this.scale[2]];
    }
    public setScaleZ(z: number) {
        this._scale = [this.scale[0], this.scale[1], z];
    }
    public setScaleAll(scale : number) {
        this._scale = [scale, scale, scale];
    }

    public setRotation(x: number, y: number, z: number) {
        this._rotation = [x, y, z];
    }
    public setRotationX(x: number) {
        this._rotation = [x, this.rotation[1], this.rotation[2]];
    }
    public setRotationY(y: number) {
        this._rotation = [this.rotation[0], y, this.rotation[2]];
    }
    public setRotationZ(z: number) {
        this._rotation = [this.rotation[0], this.rotation[1], z];
    }
    public setRotationAll(rotation : number) {
        this._rotation = [rotation, rotation, rotation];
    }

    public setTranslation(x: number, y: number, z: number) {
        this._translation = [x, y, z];
    }
    public setTranslationX(x: number) {
        this._translation = [x, this.translation[1], this.translation[2]];
    }
    public setTranslationY(y: number) {
        this._translation = [this.translation[0], y, this.translation[2]];
    }
    public setTranslationZ(z: number) {
        this._translation = [this.translation[0], this.translation[1], z];
    }
    public setTranslationAll(translation : number) {
        this._translation = [translation, translation, translation];
    }


    get scale(): number[] {
        return this._scale;
    }

    get scaleX() {
        return this._scale[0];
    }
    get scaleY() {
        return this._scale[1];
    }
    get scaleZ() {
        return this._scale[2];

    }

    get rotation(): number[] {
        return this._rotation;
    }

    get rotationX() {
        return this._rotation[0];
    }
    get rotationY() {
        return this._rotation[1];
    }
    get rotationZ() {
        return this._rotation[2];

    }


    get translation(): number[] {
        return this._translation;
    }

    get translationX() {
        return this._translation[0];
    }
    get translationY() {
        return this._translation[1];
    }
    get translationZ() {
        return this._translation[2];

    }
}