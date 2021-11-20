import { Geometry } from "../geometries/Geometry";
import { Material } from "../materials/Material";
import { Object3D } from "../core/Object3D";

export class Mesh extends Object3D {
    constructor (geometry : Geometry, material : Material) { // TODO: create BufferGeometry, MeshMaterial
        super(geometry, material);
        this.type = "Mesh";
    }
}