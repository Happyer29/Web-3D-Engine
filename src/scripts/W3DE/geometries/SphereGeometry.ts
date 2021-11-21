import { Object3D } from "../core/Object3D";
import { Material } from "../materials/Material";
import { Vector3 } from "../maths/Vector3";
import { Geometry } from "./Geometry";

export class SphereGeometry extends Geometry {
  constructor(radius: number = 1,
    subdivisionsAxis = 32,
    subdivisionsHeight = 16,
    opt_startLatitudeInRadians?: number,
    opt_endLatitudeInRadians?: number,
    opt_startLongitudeInRadians?: number,
    opt_endLongitudeInRadians?: number) {

    opt_startLatitudeInRadians = opt_startLatitudeInRadians || 0;
    opt_endLatitudeInRadians = opt_endLatitudeInRadians || Math.PI;
    opt_startLongitudeInRadians = opt_startLongitudeInRadians || 0;
    opt_endLongitudeInRadians = opt_endLongitudeInRadians || (Math.PI * 2);


    const latRange = opt_endLatitudeInRadians - opt_startLatitudeInRadians;
    const longRange = opt_endLongitudeInRadians - opt_startLongitudeInRadians;

    const positions = [];
    const normals = [];
    const texCoords = [];
   
    function addPoint(x, y) {
      const u = x / subdivisionsAxis;
      const v = y / subdivisionsHeight;
      const theta = longRange * u + opt_startLongitudeInRadians;
      const phi = latRange * v + opt_startLatitudeInRadians;
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);
      const ux = cosTheta * sinPhi;
      const uy = cosPhi;
      const uz = sinTheta * sinPhi;
      positions.push(radius * ux, radius * uy, radius * uz);
      normals.push(ux, uy, uz);
      texCoords.push(1 - u, v);
    }

    for (let y = 0; y <= subdivisionsHeight; y++) {
      for (let x = 0; x <= subdivisionsAxis; x++) {
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