import { Object3D } from "../core/Object3D";
import { Light } from "../lighting/Light";

export class Scene {
    private _itemsToRender: Object3D[] = []; // TODO: SceneGraph with nodes and world/local Matrices.

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
        this._itemsToRender.push(item);
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