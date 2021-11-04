import {FileLoader} from "./FileLoader";

export class TextureLoader {
    public static async loadFromUrl(textureURL : string) : Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            let img = new Image();
            img.onload = () => {
                return resolve(img);
            }
            img.onerror = () => {
                return reject;
            }
            img.src = textureURL;
        })
    }
    public static async loadFromFile(file : File) : Promise<HTMLImageElement> {
        let textureURL = await FileLoader.loadAsDataURL(file);
        return TextureLoader.loadFromUrl(textureURL);
    }
}