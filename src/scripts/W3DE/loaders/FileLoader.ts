export class FileLoader {
    public static async loadAsText(file : File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.readAsText(file);

            reader.onerror = () => {
                return reject;
            }

            reader.onload = () => {
                return resolve(reader.result.toString());
            }
        })
    }
    public static async loadAsDataURL(file : File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.readAsDataURL(file);

            reader.onerror = () => {
                return reject;
            }

            reader.onload = () => {
                return resolve(reader.result.toString());
            }
        })
    }
}