export class Geometry {
    private vertices: number[] = [];
    private textureVertices: number[] = [];
    private normals: number[] = [];

    private polygonVertexIndices: number[] = [];
    private polygonTextureVertexIndices: number[] = [];
    private polygonNormalIndices: number[] = [];


    constructor(vertices: number[], textureVertices: number[], normals: number[], polygonVertexIndices: number[], polygonTextureVertexIndices: number[], polygonNormalIndices: number[]) {
        this.vertices = vertices;
        this.textureVertices = textureVertices;
        this.normals = normals;
        this.polygonVertexIndices = polygonVertexIndices;
        this.polygonTextureVertexIndices = polygonTextureVertexIndices;
        this.polygonNormalIndices = polygonNormalIndices;
    }
}