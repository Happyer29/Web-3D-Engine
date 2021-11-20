import { TextureLoader } from "../loaders/TextureLoader";

export class Material {
    private _texture: HTMLImageElement;

    constructor(texture: HTMLImageElement) {
        this._texture = texture;
    }

    public static async getDefaultMaterial() {
        let texture = await TextureLoader.loadFromUrl("default-texture.jpg");
        return new Material(texture);
    }

    set texture(value: HTMLImageElement) {
        this._texture = value;
    }

    get texture(): HTMLImageElement {
        return this._texture;
    }
}