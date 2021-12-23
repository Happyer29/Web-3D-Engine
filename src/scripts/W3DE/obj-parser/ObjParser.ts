import { Geometry } from "../geometries/Geometry";
import { Mesh } from "../objects/Mesh";
import { Material } from "../materials/Material";
import { TextureLoader } from "../loaders/TextureLoader";
import { FileLoader, Vector3 } from "../W3DE";

export class ObjParser {

    private readonly objPositions: number[][] = [[0, 0, 0]];
    private readonly objTextureCoordinates: number[][] = [[0, 0]];
    private readonly objNormals: number[][] = [[0, 0, 0]];

    private readonly objVertexData: number[][][] = [
        this.objPositions,
        this.objTextureCoordinates,
        this.objNormals,
    ];

    private webglVertexData: number[][] = [
        [],   // positions
        [],   // texcoords
        [],   // normals
    ];

    private addVertex(vertex: string) {
        const vertexInfo = vertex.split('/');
        vertexInfo.forEach((objIndexStr, i) => {
            if (!objIndexStr) {
                return;
            }
            const objIndex = parseInt(objIndexStr);
            const index = objIndex + (objIndex >= 0 ? 0 : this.objVertexData[i].length);
            this.webglVertexData[i].push(...this.objVertexData[i][index]);
        });
    }

    public async parseObjFromFile(file: File) {
        let fileText = await FileLoader.loadAsText(file);
        return this.parseObjFromString(fileText)
    }

    public parseObjFromString(objString: string): Geometry {

        enum ObjTokens {
            COMMENT = "#",
            VERTEX = "v",
            NORMAL = "vn",
            TEXTURE_COORDINATE = "vt",
            FACE = "f"
        }

        let lines = objString.split(/\r\n|\n/);

        lines.forEach((line) => {
            if (line === '' || line.startsWith(ObjTokens.COMMENT)) {
                return;
            }
            let lineData = line.split(" ").filter(e => e);

            let token = lineData.shift();
            switch (token) {
                case ObjTokens.VERTEX: {
                    this.objPositions.push(lineData.map(parseFloat));
                    break;
                }
                case ObjTokens.NORMAL: {
                    this.objNormals.push(lineData.map(parseFloat));
                    break;
                }
                case ObjTokens.TEXTURE_COORDINATE: {
                    this.objTextureCoordinates.push(lineData.map(parseFloat));
                    break;
                }
                case ObjTokens.FACE: {
                    const numTriangles = lineData.length - 2;
                    for (let tri = 0; tri < numTriangles; ++tri) {
                        this.addVertex(lineData[0]);
                        this.addVertex(lineData[tri + 1]);
                        this.addVertex(lineData[tri + 2]);
                    }
                    break;
                }
                default: {
                    console.warn('Unhandled keyword:', token);
                }
            }
        })
        if (this.webglVertexData[2].length == 0) {
            //    this.webglVertexData[2] = this.normalize(this.webglVertexData[0]);
            // //     const numTriangles = this.webglVertexData[0].length - 2;
            // //     const positions = this.webglVertexData[0];
            // //     for (let tri = 0; tri < numTriangles; ++tri) {
            // //         let p0 = positions[0];
            // //         let p1 = positions[tri + 1];
            // //         let p2 = positions[tri + 2];
            // //         let length = (p0 + p1 + p2) / 3;
            // //         if (length < 0.00001) this.webglVertexData[2].push(0)
            // //         else this.webglVertexData[2].push((p1 - p0 ) * (p2 - p1) / length);
            // //     }



            for (let i = 0; i < this.webglVertexData[0].length; i += 1) {
                let pA = new Vector3([this.webglVertexData[0][i + 0], this.webglVertexData[0][i + 1], this.webglVertexData[0][i + 2]]);
                let pB = new Vector3([this.webglVertexData[0][i + 1], this.webglVertexData[0][i + 2], this.webglVertexData[0][i + 3]]);
                let pC = new Vector3([this.webglVertexData[0][i + 2], this.webglVertexData[0][i + 3], this.webglVertexData[0][i + 4]]);

                let cb = Vector3.minus(pC, pB);
                let ab = Vector3.minus(pA, pB);
                cb = Vector3.cross(cb, ab);
                
                let cbArr = cb.positionArr;

                this.webglVertexData[2].push(cbArr[0], cbArr[1], cbArr[2]);
                this.webglVertexData[2].push(cbArr[0], cbArr[1], cbArr[2]);
                this.webglVertexData[2].push(cbArr[0], cbArr[1], cbArr[2]);
                cb = Vector3.normalization(cb)
                this.webglVertexData[2].push(cbArr[0], cbArr[1], cbArr[2]);
                this.webglVertexData[2].push(cbArr[0], cbArr[1], cbArr[2]);
                this.webglVertexData[2].push(cbArr[0], cbArr[1], cbArr[2]);

            }
        }

        // console.log(new Geometry(this.webglVertexData[0], this.webglVertexData[1], this.webglVertexData[2]))
        return new Geometry(this.webglVertexData[0], this.webglVertexData[1], this.webglVertexData[2])
    }

    private normalize(arr: number[]) {
        var ratio = Math.max(...arr) / 100;

        arr = arr.map(v => Math.round(v / ratio));

        return arr;
    }
}