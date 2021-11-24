export class Geometry {
    private _position: number[];
    private _texcoord?: number[]; // TODO: Implement Vector2
    private _normal?: number[];
    private _type?: string;

    constructor(position: number[] = [], textureCoordinates?: number[], normal?: number[]) {
        this._position = position;
        if (textureCoordinates) this._texcoord = textureCoordinates;
        if (normal) this._normal = normal;
    }

    get position(): number[] {
        return this._position;
    }

    get texcoord(): number[] {
        return this._texcoord;
    }

    get normal(): number[] {
        return this._normal;
    }

    public set position(value: number[]) {
        this._position = value;
    }

    public set texcoord(value: number[]) {
        this._texcoord = value;
    }

    public set normal(value: number[]) {
        this._normal = value;
    }

    public get type(): string {
        return this._type;
    }

    public set type(value: string) {
        this._type = value;
    }
    
    public static emptyGeometry(): Geometry {
        return new Geometry([], [], []);
    }
}