import * as W3DE from './W3DE/W3DE';

let t = new W3DE.Matrix3([[0, 1, 0]]);

console.log(t.matrix)

let objInput = document.querySelector("#obj-loader");
let textureInput = document.querySelector("#texture-loader");


objInput.addEventListener('change', readObjectFromInput, false);


textureInput.addEventListener('change', readTextureFromInput, false);

async function readObjectFromInput(event : Event) {
    const input = event.target as HTMLInputElement;

    let files = input.files;
    let file = files[0];
    let fileText = await W3DE.FileLoader.loadAsText(file);
    let object = await new W3DE.ObjectParser().parseObjectFromString(fileText);

    let renderer = new W3DE.WebGLRenderer(object, {selector: "#canvas-parent", width: "1000px", height: "1000px"});
    renderer.resizeCanvasToDisplaySize();
    renderer.render();
    console.log(object)
}

async function readTextureFromInput(event : Event) {
    const input = event.target as HTMLInputElement;
    
    let files = input.files;
    let file = files[0];

    let texture = await W3DE.TextureLoader.loadFromFile(file);
    let material = new W3DE.Material(texture);
    console.log(material);
}
