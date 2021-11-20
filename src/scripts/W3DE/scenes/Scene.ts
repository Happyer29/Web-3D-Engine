import { Object3D } from "../core/Object3D";

export class Scene {
    private itemsToRender: Object3D[];

    private _ambientLight: Object; // todo Light class

    public get ambientLight(): Object {
        return this._ambientLight;
    }

    constructor() {
        // set ambientLight to default
    }

    public changeAmbientLight(ambientLight: Object) { // todo Light class
        this._ambientLight = ambientLight;
    }

    public add(item: Object3D) {
        this.itemsToRender.push(item);
    }

    public clear() {
        this.itemsToRender = [];
    }
}