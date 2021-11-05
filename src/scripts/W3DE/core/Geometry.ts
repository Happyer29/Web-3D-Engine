export class Geometry {
    private _position : number[];
    private _texcoord?: number[];
    private _normal?: number[];


    constructor(position: number[], textureCoordinates?: number[], normal?: number[]) {
        this._position = position;
        if (textureCoordinates) this._texcoord = textureCoordinates;
        if (normal) this._normal = normal;
    }

}