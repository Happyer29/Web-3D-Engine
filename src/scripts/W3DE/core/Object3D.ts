import { Geometry } from "../geometries/Geometry";
import { Material } from "../materials/Material";
import { Vector3 } from "../maths/Vector3";
import { Matrix4 } from "../maths/Matrix4";
import { Controls } from "../controls/Controls";
import { Mouse, MOUSE_EVENTS } from "../controls/Mouse";
import { Key, KEY_EVENTS } from "../controls/Key";

export class Object3D {
    private _geometry: Geometry;
    private _material: Material;
    private _type: string;

    private _scale: Vector3 = new Vector3([1, 1, 1]);
    private _rotation: Vector3 = new Vector3([0, 0, 0]);
    private _translation: Vector3 = new Vector3([0, 0, 0]);

    private _parent : Object3D;

    private _matrix: Matrix4 = new Matrix4().identityMatrix();
    public get matrix(): Matrix4 {
        return this._matrix;
    }
    public set matrix(value: Matrix4) {
        this._matrix = value;
    }

    public get parent() {
        return this._parent;
    }
    public set parent(value) {
        this._parent = value;
    }
    private children: Object3D[] = [];

    private controls: Controls;
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
    public setScaleAll(scale: number) {
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
    public setRotationAll(rotation: number) {
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
    public setTranslationAll(translation: number) {
        this._translation = new Vector3([translation, translation, translation]);
    }


    get scale(): number[] {
        return Array.from(this._scale.positionArr);
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
        return Array.from(this._rotation.positionArr);
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
        return Array.from(this._translation.positionArr);
    }
    public toDefaultTRS() {
        this.setRotationAll(0);
        this.setTranslationAll(0);
        this.setScaleAll(1);
    }

    public attachControls(controls: Controls) {
        this.controls = controls;
    }

    public attachDefaultControls() {

        let mouse = new Mouse();
        mouse.sensitivity = 30;
        let toggleZModeKey = new Key("z");
        let toggleCModeKey = new Key("c");

        let rotateZ = (event: WheelEvent) => {
            if (toggleZModeKey.isPressed) {
                this.setRotationZ(this.rotation[2] + event.deltaY / 25)
            } else if (!toggleCModeKey.isPressed) {
                this.setTranslationZ(this.translation[2] + event.deltaY / 25)
            }
        }

        let rotateXY = (event: MouseEvent) => {
            if (mouse.isDragging) {
                let dX = (event.pageX - mouse.old_x) * 2 * Math.PI / 1000 * mouse.sensitivity;
                let dY = (event.pageY - mouse.old_y) * 2 * Math.PI / 1000 * mouse.sensitivity;

                mouse.old_x = event.pageX;
                mouse.old_y = event.pageY;

                if (!toggleCModeKey.isPressed) {
                    this.setRotationX(this.rotation[0] + dY);
                    this.setRotationY(this.rotation[1] + dX);
                }
            }
        }

        let aKey = new Key("a").setFunction(KEY_EVENTS.KEY_DOWN, () => {
            if (!toggleCModeKey.isPressed) {
                console.log("object");

                this.setTranslationX(this.translation[0] - 10);
            }
        }
        );
        let dKey = new Key("d").setFunction(KEY_EVENTS.KEY_DOWN, () => {
            if (!toggleCModeKey.isPressed)
                this.setTranslationX(this.translation[0] + 10);
        }
        );
        let wKey = new Key("w").setFunction(KEY_EVENTS.KEY_DOWN, () => {
            if (!toggleCModeKey.isPressed)
                this.setTranslationY(this.translation[1] + 10);
        }
        );
        let sKey = new Key("s").setFunction(KEY_EVENTS.KEY_DOWN, () => {
            if (!toggleCModeKey.isPressed)
                this.setTranslationY(this.translation[1] - 10);
        }
        );

        mouse.setFunction(MOUSE_EVENTS.MOUSE_WHEEL, rotateZ);
        mouse.setFunction(MOUSE_EVENTS.MOUSE_MOVE, rotateXY);

        this.controls = new Controls(mouse, toggleCModeKey, toggleZModeKey, aKey, dKey, wKey, sKey);
        this.controls.addListenersToWindow();
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