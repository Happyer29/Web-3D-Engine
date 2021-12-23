import { Geometry } from "./Geometry";

export class PlaneGeometry extends Geometry {

    constructor() {
        super();



        const positions = [];
        const normals = [];
        const texcoords = [];
        function addPoint(zs, xs) {
            const u = zs / 1000;
            const v = xs / 1000;
            positions.push(
                1000 * u - 1000 * 0.5,
                0,
                1000 * v - 1000 * 0.5);
            normals.push(0, 1, 0);
            texcoords.push(u, v);
            }
        

        for (let x = 0; x < 1000; x++) {
            for (let y = 0; y < 1000; y++) {
                addPoint(x, y);
                addPoint(x + 1, y);
                addPoint(x, y + 1);
                addPoint(x + 1, y + 1);
                addPoint(x, y + 1,);
                addPoint(x + 1, y);
                
            }
            
        }

        this.position = positions;
        this.texcoord = texcoords;
        this.normal = normals;
    }
}