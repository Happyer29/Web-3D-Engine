import { Matrix4, matrix4 } from "../maths/Matrix4";
import { Matrix4Utils } from "../utils/Matrix4Utils";

export class SceneNode {
    private children: SceneNode[];
    private localMatrix = Matrix4Utils.identityMatrix();
    private _worldMatrix = Matrix4Utils.identityMatrix();

    private parent: SceneNode;

    public setParent(parent: SceneNode) {
        // remove us from our parent
        if (this.parent) {
            let index = this.parent.children.indexOf(this);
            if (index >= 0) {
                this.parent.children.splice(index, 1);
            }
        }

        // Add us to our new parent
        if (parent) {
            parent.children.push(this);
        }
        this.parent = parent;
    }

    public updateWorldMatrix(parentWorldMatrix?: matrix4) {

        if (parentWorldMatrix) {
            // a matrix was passed in so do the math
            this.worldMatrix = Matrix4Utils.multiplication(parentWorldMatrix, this.localMatrix);
        } else {
            // no matrix was passed in so just copy local to world
            this.worldMatrix = this.localMatrix;

        }

        // now process all the children
        let worldMatrix = this.worldMatrix;
        this.children.forEach((child) => {
            child.updateWorldMatrix(worldMatrix);
        });
    };

    public get worldMatrix() {
        return this._worldMatrix;
    }

    public set worldMatrix(value) {
        this._worldMatrix = value;
    }
}