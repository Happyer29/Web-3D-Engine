import { Vector3, vector3 } from "../maths/Vector3";

export class Light {
    private _position: Vector3 = new Vector3([0, 0, 0]);
    private _shininess: number = 100;
    

    constructor(position? : vector3, shininess? : number) {
        if (position) this._position = new Vector3(position);
        if (shininess) this._shininess = shininess;
    }

    public get position(): Vector3 {
        return this._position;
    }
    public set position(value: Vector3) {
        this._position = value;
    }
    public get shininess(): number {
        return this._shininess;
    }
    public set shininess(value: number) {
        this._shininess = value;
    }

}