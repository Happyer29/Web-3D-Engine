import { Camera } from "../cameras/Camera";
import { Object3D } from "../core/Object3D";
import { Light } from "../lighting/Light";

export class Scene {
    private itemsToRender: Object3D[] = []; // TODO: SceneGraph with nodes and world/local Matrices.
    private _camera: Camera;
    public get camera(): Camera {
        return this._camera;
    }
    public set camera(value: Camera) {
        this._camera = value;
    }
    private _light: Light;

    public get light(): Light {
        return this._light;
    }
    public set light(value: Light) {
        this._light = value;
    }

    constructor() {
        this.light = new Light()
    }

    public add(item: Object3D) {
        this.itemsToRender.push(item);
    }

    public clear() {
        this.itemsToRender = [];
    }

    public getObjectByIndex(index: number) {
        return this.itemsToRender[index];
    }

    public getItemsToRender() {
        return this.itemsToRender;
    }
}