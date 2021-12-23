import { Camera } from "../cameras/Camera";
import { Object3D } from "../core/Object3D";
import { AmbientLight } from "../lighting/AmbientLight";
import { PointLight } from "../lighting/PointLight";

import { Vector3 } from "../W3DE";

export class Scene {
    private _itemsToRender: Object3D[] = []; // TODO: SceneGraph with nodes and world/local Matrices.
    public get itemsToRender(): Object3D[] {
        return this._itemsToRender;
    }
    public set itemsToRender(value: Object3D[]) {
        this._itemsToRender = value;
    }
    private _camera: Camera;

    public get camera(): Camera {
        return this._camera;
    }
    public set camera(value: Camera) {
        this._camera = value;
    }

    private _light: PointLight; // todo multiple lightning sources

    public get light(): PointLight {
        return this._light;
    }
    public set light(value: PointLight) {
        this._light = value;
    }

    private _ambientLight: AmbientLight = new AmbientLight(0.01, new Vector3([1, 1, 1]));

    public get ambientLight(): AmbientLight {
        return this._ambientLight;
    }
    public set ambientLight(value: AmbientLight) {
        this._ambientLight = value;
    }

    constructor() {
    }

    public add(item: Object3D) {
        this._itemsToRender.push(item);
    }

    public attachCamera(camera: Camera) {
        this._camera = camera;
        return this;
    }

    public clear() {
        this._itemsToRender = [];
    }

    public getObjectByIndex(index: number) {
        return this._itemsToRender[index];
    }

    public getItemsToRender() {
        return this._itemsToRender;
    }
}