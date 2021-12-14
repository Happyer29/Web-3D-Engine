import { SceneNode } from "./SceneNode";

export class SceneGraph {
    private rootNodes : SceneNode[];

    public updateWorld() {
        this.rootNodes.forEach(node => {
            node.updateWorldMatrix();
        })
    }

    public add(node : SceneNode) {
        this.rootNodes.push(node);
    }
}