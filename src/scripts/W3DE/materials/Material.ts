import { TextureLoader } from "../loaders/TextureLoader";
import { Vector4 } from "../maths/Vector4";

export class Material {
    private _texture: HTMLImageElement;
    private _color: Vector4 = new Vector4([0.5, 0, 0.2, 1]);

    public get color(): Vector4 {
        return this._color;
    }
    public set color(value: Vector4) {
        this._color = value;
    }


    constructor(texture?: HTMLImageElement, color?: Vector4) {

        if (texture) {this._texture = texture} else this.setDefaultMaterial();
        if (color) this._color = color;
        
    }

    public isEmpty() {
        return !Boolean(this.texture);
    }

    public static async defaultMaterial(): Promise<Material> {
        let texture = await TextureLoader.loadFromUrl("default-texture.jpg");
        return new Material(texture);
    }
    
    public static emptyMaterial() {
        return new Material(undefined);
    }

    public static async fromURL(url : string): Promise<Material> {
        let texture = await TextureLoader.loadFromUrl(url);
        return new Material(texture);
    }

    private setDefaultMaterial() {
        Material.defaultMaterial().then((material) => {
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
