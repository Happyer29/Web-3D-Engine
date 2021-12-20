import { TextureLoader } from "../loaders/TextureLoader";

export class Material {
    private _texture: HTMLImageElement;

    constructor(texture?: HTMLImageElement) {
        if (texture) this._texture = texture;
    }

    public static async getDefaultMaterial() {
        let texture = await TextureLoader.loadFromUrl("default-texture.jpg");
        return new Material(texture);
    }

    public static async getDefaultTestMaterial() {
        let texture = await TextureLoader.loadFromUrl("/src/assets/textures/NeutralWrapped.jpg");
        return new Material(texture);
    }

    set texture(value: HTMLImageElement) {
        this._texture = value;
    }

    get texture(): HTMLImageElement {
        return this._texture;
    }

    public async setFromURL(URL: string): Promise<Material> {
        this.texture = await TextureLoader.loadFromUrl(URL);
        return this;
    }
}
