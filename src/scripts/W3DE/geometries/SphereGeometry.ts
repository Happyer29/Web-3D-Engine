import { Geometry } from "./Geometry";


export class SphereGeometry extends Geometry {
    constructor(radius: number = 70, roundness: number = 100) {

        if (radius < 0) throw new Error("Radius must be greater than 0");
        if (roundness < 1 || roundness > 100) throw new Error("Roundness must be in range [1; 100]");

        const width = roundness % 2 == 0 ? roundness : roundness + 1;
        const height = width / 2;

        const positions = [];
        const normals = [];
        const texCoords = [];

        

        function addPoint(x: number, y: number) {
            const u = x / width;
            const v = y / height;
            
            const sin2PIu = Math.sin(2 * Math.PI * u);
            const cos2PIu = Math.cos(2 * Math.PI * u);
            const sinPIv = Math.sin(Math.PI * v);
            const cosPIv = Math.cos(Math.PI * v);

            const ux = cos2PIu * sinPIv;
            const uy = cosPIv;
            const uz = sin2PIu * sinPIv;

            positions.push(radius * ux, radius * uy, radius * uz);
            normals.push(ux, uy, uz);
            texCoords.push(1 - u, v);
        }

        for (let y = 0; y <= height; y++) {
            for (let x = 0; x <= width; x++) {
                // for each rect we need 6 points
                addPoint(x, y);
                addPoint(x + 1, y);
                addPoint(x, y + 1);

                addPoint(x, y + 1,);
                addPoint(x + 1, y);
                addPoint(x + 1, y + 1);
            }
        }

        // build geometry
        super(positions, normals, texCoords)
        this.type = 'SphereGeometry';
    }
}