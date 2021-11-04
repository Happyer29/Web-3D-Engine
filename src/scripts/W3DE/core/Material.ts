export class Material {
    private _texture: HTMLImageElement;


    constructor(texture: HTMLImageElement) {
        this._texture = texture;
    }

    set texture(value: HTMLImageElement) {
        this._texture = value;
    }

    get texture(): HTMLImageElement {
        return this._texture;
    }
}