import { Object3D } from "../core/Object3D";
import { matrix4, Matrix4 } from "../maths/Matrix4";
import { Vector3 } from "../maths/Vector3";
import { Matrix4Utils } from "../utils/Matrix4Utils";

export class Camera {
    private position: Vector3 = new Vector3([0, 0, 0]);
    private target: Vector3 = new Vector3([0, 0, 0]);
    private up: Vector3 = new Vector3([0, 1, 0]);

    private fovInRadians: number = this.degToRad(120);
    private _aspect: number = 16.0 / 9.0;
    private near: number = 1;
    private far: number = 10000;

    private matrix: Matrix4;
    private viewMatrix: Matrix4;
    private projectionMatrix: Matrix4;

    private _viewProjectionMatrix : matrix4;

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
}