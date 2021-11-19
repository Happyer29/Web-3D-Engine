import {Matrix3} from "./W3DE/maths/Matrix3";
import {ObjectParser} from "./W3DE/obj-parser/ObjectParser";
import {FileLoader} from "./W3DE/loaders/FileLoader";
import {TextureLoader} from "./W3DE/loaders/TextureLoader";
import {Material} from "./W3DE/core/Material";
import {WebGLRenderer} from "./W3DE/renderer/WebGLRenderer";

let t = new Matrix3([[0, 1, 0]]);

console.log(t.matrix)

let objInput = document.querySelector("#obj-loader");
let textureInput = document.querySelector("#texture-loader");


objInput.addEventListener('change', readObjectFromInput, false);


textureInput.addEventListener('change', readTextureFromInput, false);

async function readObjectFromInput(event : Event) {
    const input = event.target as HTMLInputElement;

    let files = input.files;
    let file = files[0];
    let fileText = await FileLoader.loadAsText(file);
    let object = await new ObjectParser().parseObjectFromString(fileText);

    let renderer = new WebGLRenderer(object, {selector: "#canvas-parent", width: "1000px", height: "1000px"});
    renderer.render();
    console.log(object)
}

async function readTextureFromInput(event : Event) {
    const input = event.target as HTMLInputElement;
    
    let files = input.files;
    let file = files[0];

    let texture = await TextureLoader.loadFromFile(file);
    let material = new Material(texture);
    console.log(material);
}

