import {Geometry} from "../core/Geometry";
import {Mesh} from "../core/Mesh";
import {Material} from "../core/Material";
import {TextureLoader} from "../loaders/TextureLoader";

export class ObjectParser {
    public static async parseObjectFromString(objURL: string, textureURL? : string): Promise<Mesh> {
        // because indices are base 1 let's just fill in the 0th data
        const objPositions = [[0, 0, 0]];
        const objTextureCoordinates = [[0, 0]];
        const objNormals = [[0, 0, 0]];

        // same order as `f` indices
        const objVertexData = [
            objPositions,
            objTextureCoordinates,
            objNormals,
        ];

        // same order as `f` indices
        let webglVertexData = [
            [],   // positions
            [],   // texcoords
            [],   // normals
        ];

        function addVertex(vert) {
            const ptn = vert.split('/');
            ptn.forEach((objIndexStr, i) => {
                if (!objIndexStr) {
                    return;
                }
                const objIndex = parseInt(objIndexStr);
                const index = objIndex + (objIndex >= 0 ? 0 : objVertexData[i].length);
                webglVertexData[i].push(...objVertexData[i][index]);
            });
        }

        enum ObjTokens {
            COMMENT = "#",
            VERTEX = "v",
            NORMAL = "vn",
            TEXTURE_COORDINATE = "vt",
            FACE = "f"
        }

        let lines = objURL.split(/\r\n|\n/);

        lines.forEach((line) => {
            if (line === '' || line.startsWith(ObjTokens.COMMENT)) {
                return;
            }
            let lineData = line.split(" ").filter(e => e);

            let token = lineData.shift();
            switch (token) {
                case ObjTokens.VERTEX : {
                    objPositions.push(lineData.map(parseFloat));
                    break;
                }
                case ObjTokens.NORMAL : {
                    objNormals.push(lineData.map(parseFloat));
                    break;
                }
                case ObjTokens.TEXTURE_COORDINATE : {
                    objTextureCoordinates.push(lineData.map(parseFloat));
                    break;
                }
                case ObjTokens.FACE : {
                    const numTriangles = lineData.length - 2;
                    for (let tri = 0; tri < numTriangles; ++tri) {
                        addVertex(lineData[0]);
                        addVertex(lineData[tri + 1]);
                        addVertex(lineData[tri + 2]);
                    }
                    break;
                }
                default : {
                    console.warn('unhandled keyword:', token);  // eslint-disable-line no-console
                }
            }
        })


        let material;
        if (!textureURL) {
            material = await Material.createDefaultMaterial();
        } else {
            material = new Material(await TextureLoader.loadFromUrl(textureURL));
        }
        return new Promise((resolve, reject) => {
            if (!material || !webglVertexData[0]) return reject;
            return resolve(new Mesh(new Geometry(webglVertexData[0], webglVertexData[1], webglVertexData[2]), material));
        });
    }
}