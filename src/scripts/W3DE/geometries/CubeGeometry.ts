import { Geometry } from "./Geometry";

export class CubeGeometry extends Geometry {
	constructor(size : number = 1) {
		const k = size / 2;

		const CUBE_FACE_INDICES = [
			[3, 7, 5, 1], // right
			[6, 2, 0, 4], // left
			[6, 7, 3, 2], // ??
			[0, 1, 5, 4], // ??
			[7, 6, 4, 5], // front
			[2, 3, 1, 0], // back
		  ];

    const cornerVertices = [
      [-k, -k, -k],
      [+k, -k, -k],
      [-k, +k, -k],
      [+k, +k, -k],
      [-k, -k, +k],
      [+k, -k, +k],
      [-k, +k, +k],
      [+k, +k, +k],
    ];

    const faceNormals = [
      [+1, +0, +0],
      [-1, +0, +0],
      [+0, +1, +0],
      [+0, -1, +0],
      [+0, +0, +1],
      [+0, +0, -1],
    ];

    const uvCoords = [
      [1, 0],
      [0, 0],
      [0, 1],
      [1, 1],
    ];

    const positions = [];
    const normals   = [];
    const texCoords = [];

    for (let f = 0; f < 6; ++f) {
      const faceIndices = CUBE_FACE_INDICES[f];
      for (let v = 0; v < 4; ++v) {
        const position = cornerVertices[faceIndices[v]];
        const normal = faceNormals[f];
        const uv = uvCoords[v];

        // Each face needs all four vertices because the normals and texture
        // coordinates are not all the same.
        positions.push(position[0], position[1], position[2]);
        normals.push(normal[0], normal[1], normal[2]);
        texCoords.push(uv[0], uv[1]);

      }
    }
	
		console.log(positions);
		super(positions, normals, texCoords);
		this.type = "CubeGeometry"
	}
}