import { TextureLoader } from "../loaders/TextureLoader";

export class Material {
    private _texture: HTMLImageElement;

    constructor(texture: HTMLImageElement = null) {
        if (texture) this._texture = texture;
        else this.setDefaultMaterial();
    }

    public static async getDefaultMaterial(): Promise<Material> {
        let texture = await TextureLoader.loadFromUrl("default-texture.jpg");
        return new Material(texture);
    }

    private setDefaultMaterial(){
        Material.getDefaultMaterial().then((material) => {
            this._texture = material.texture;
        })
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
