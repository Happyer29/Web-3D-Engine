import { Controls } from "../controls/Controls";
import { Key, KEY_EVENTS } from "../controls/Key";
import { Mouse, MOUSE_EVENTS } from "../controls/Mouse";
import { Object3D } from "../core/Object3D";
import { matrix4, Matrix4 } from "../maths/Matrix4";
import { Vector3 } from "../maths/Vector3";
import { Matrix4Utils } from "../utils/Matrix4Utils";
import { Scene } from "../W3DE";

export class Camera {
    private position: Vector3 = new Vector3([0, 0, 0]);
    private target: Vector3 = new Vector3([1, 0, 0]);
    private up: Vector3 = new Vector3([0, 1, 0]);

    private fovInRadians: number = this.degToRad(90);
    private _aspect: number = 16.0 / 9.0;
    private near: number = 1;
    private far: number = 10000;

    private matrix: Matrix4;
    private viewMatrix: Matrix4;
    private projectionMatrix: Matrix4;

    private _viewProjectionMatrix : matrix4;

    private controls : Controls;

    public getPositionAsArray() {
        return Array.from(this.position.positionArr);
    }
    constructor(cameraPosition?: Vector3, target?: Vector3, up?: Vector3, options?: {
        fovInRadians?: number,
        aspect?: number,
        near?: number,
        far?: number
    }) {
        if (cameraPosition) this.position = cameraPosition;
        if (target) this.target = target;
        if (up) this.up = up;

        if (options) {
            if (options.fovInRadians) this.fovInRadians = options.fovInRadians;
            if (options.aspect) this._aspect = options.aspect;
            if (options.near) this.near = options.near;
            if (options.far) this.far = options.far;
        }

        this.matrix = new Matrix4(Matrix4Utils.lookAt(this.position, this.target, this.up));
        this.viewMatrix = new Matrix4(Matrix4Utils.inverse(this.matrix.matrix));
        this.projectionMatrix = new Matrix4(Matrix4Utils.perspective(this.fovInRadians, this._aspect, this.near, this.far));
        this._viewProjectionMatrix = Matrix4Utils.multiplication(this.projectionMatrix.matrix, this.viewMatrix.matrix);
    }

    public get viewProjectionMatrix() {
        return this._viewProjectionMatrix;
    }

    private degToRad(deg: number) // TO Math.js
    {
        return deg * (Math.PI / 180);
    }

    public set aspect(aspect : number) {
        this._aspect = aspect;
    }

    public updateMatrix(matrix : Matrix4) {
        this.matrix = matrix;
        this.viewMatrix = new Matrix4(Matrix4Utils.inverse(this.matrix.matrix));
        this._viewProjectionMatrix = Matrix4Utils.multiplication(this.projectionMatrix.matrix, this.viewMatrix.matrix);
    }

    public translate(x: number, y: number, z: number) {
        this.updateMatrix(new Matrix4(Matrix4Utils.translate(this.matrix.matrix, x, y, z)));

    }
    public rotate(x: number, y: number) {
        this.updateMatrix(new Matrix4(Matrix4Utils.xRotate(this.matrix.matrix, x)).yRotate(y));
    }
    public setTranslation(x: number, y: number, z: number) {
        this.updateMatrix(new Matrix4(Matrix4Utils.translation(x, y, z)));
    }
    public rotateQ(x: number, y: number) {
        this.updateMatrix(new Matrix4(Matrix4Utils.xRotate(this.matrix.matrix, x)).yRotate(y));
    }

    public attachControls(controls : Controls) {
        this.controls = controls;
    }

    public attachDefaultControls() {

        let mouse = new Mouse();
        mouse.sensitivity = 30;
        let toggleZModeKey = new Key("z");
        let toggleCModeKey = new Key("c");

        let translateZ = (event : WheelEvent) => {
            if (!toggleZModeKey.isPressed) this.translate(0, 0, event.deltaY / 25);
        }

        let rotateXY = (event : MouseEvent) => {
            if (mouse.isDragging && toggleCModeKey.isPressed) {
                let dX = (event.pageX - mouse.old_x) * 2 * Math.PI / 1000 * mouse.sensitivity;
                let dY = (event.pageY - mouse.old_y) * 2 * Math.PI / 1000 * mouse.sensitivity;

                mouse.old_x = event.pageX;
                mouse.old_y = event.pageY;

                this.rotate(dY, dX);
            }
        }
        let aKey = new Key("a").setFunction(KEY_EVENTS.KEY_DOWN, () => {
            if (toggleCModeKey.isPressed)
                this.translate(-10, 0, 0)
        }
        );
        let dKey = new Key("d").setFunction(KEY_EVENTS.KEY_DOWN, () => {
            if (toggleCModeKey.isPressed)
                this.translate(10, 0, 0)
        }
        );
        let wKey = new Key("w").setFunction(KEY_EVENTS.KEY_DOWN, () => {
            if (toggleCModeKey.isPressed)
                this.translate(0, 10, 0)
        }
        );
        let sKey = new Key("s").setFunction(KEY_EVENTS.KEY_DOWN, () => {
            if (toggleCModeKey.isPressed)
                this.translate(0, -10, 0)
        }
        );

        mouse.setFunction(MOUSE_EVENTS.MOUSE_WHEEL, translateZ);
        mouse.setFunction(MOUSE_EVENTS.MOUSE_MOVE, rotateXY);
        
        this.controls = new Controls(mouse, aKey, dKey, wKey, sKey, toggleZModeKey, toggleCModeKey);
        this.controls.addListenersToWindow();
    }
}