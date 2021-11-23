import { FileLoader } from "./FileLoader";

export class TextureLoader {
    public static async loadFromUrl(URL: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            let img = new Image();
            img.onload = () => {
                return resolve(img);
            }
            img.onerror = () => {
                return reject;
            }
            img.src = URL;
        })
    }
    public static async loadFromFile(file: File): Promise<HTMLImageElement> {
        return TextureLoader.loadFromUrl(await FileLoader.loadAsDataURL(file));
    }
}