import {Matrix3} from "./W3DE/maths/Matrix3";
import {ObjectParser} from "./W3DE/obj-parser/ObjectParser";
import {FileLoader} from "./W3DE/loaders/FileLoader";
import {TextureLoader} from "./W3DE/loaders/TextureLoader";
import {Material} from "./W3DE/materials/Material";
import {WebGLRenderer} from "./W3DE/renderer/WebGLRenderer";
import { SphereGeometry } from "./W3DE/geometries/SphereGeometry";
import { Mesh } from "./W3DE/objects/Mesh";

let t = new Matrix3([[0, 1, 0]]);

console.log(t.matrix)

let objInput : HTMLButtonElement = document.querySelector("#obj-loader");
let textureInput : HTMLButtonElement = document.querySelector("#texture-loader");
let drawGeometryBtn : HTMLButtonElement = document.querySelector("#draw-geometry");

let buttons : HTMLButtonElement[] = [
    objInput,
    textureInput,
    drawGeometryBtn,
]



objInput.addEventListener('change', readObjectFromInput, false);
textureInput.addEventListener('change', readTextureFromInput, false);
drawGeometryBtn.addEventListener('click', drawGeometry, false);

async function readObjectFromInput(event : Event) {
    const input = event.target as HTMLInputElement;

    let files = input.files;
    let file = files[0];
    let fileText = await FileLoader.loadAsText(file);
    let object = await new ObjectParser().parseObjectFromString(fileText);

    let renderer = new WebGLRenderer(object, {selector: "#canvas-parent", width: "1000px", height: "1000px"});
    renderer.resizeCanvasToDisplaySize();
    renderer.render();
    console.log(object)

    buttons.forEach(button => {
        button.disabled = true;
    })    
}

async function readTextureFromInput(event : Event) {
    const input = event.target as HTMLInputElement;
    
    let files = input.files;
    let file = files[0];

    let texture = await TextureLoader.loadFromFile(file);
    let material = new Material(texture);
    console.log(material);

    buttons.forEach(button => {
        button.disabled = true;
    }) 
}

async function drawGeometry() {
    const sphereGeometry = new SphereGeometry(50, 100); // change roundness to 10-20 to clearly see rotation
    const defaultMaterial = await Material.getDefaultMaterial();
    const mesh = new Mesh(sphereGeometry, defaultMaterial);
    let renderer = new WebGLRenderer(mesh, {selector: "#canvas-parent", width: "1000px", height: "1000px"});
    renderer.resizeCanvasToDisplaySize();
    renderer.render();

    buttons.forEach(button => {
        button.disabled = true;
    }) 
}
