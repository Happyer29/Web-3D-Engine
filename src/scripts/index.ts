import * as W3DE from './W3DE/W3DE';

let t = new W3DE.Matrix3([[0, 1, 0]]);

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
    let fileText = await W3DE.FileLoader.loadAsText(file);
    let object = await new W3DE.ObjectParser().parseObjectFromString(fileText);

    let renderer = new W3DE.WebGLRenderer(object, {selector: "#canvas-parent", width: "1000px", height: "1000px"});
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

    let texture = await W3DE.TextureLoader.loadFromFile(file);
    let material = new W3DE.Material(texture);
    console.log(material);

    buttons.forEach(button => {
        button.disabled = true;
    }) 
}

async function drawGeometry() {
    const sphereGeometry = new W3DE.SphereGeometry(50, 100); // change roundness to 10-20 to clearly see rotation
    const defaultMaterial = await W3DE.Material.getDefaultMaterial();
    const mesh = new W3DE.Mesh(sphereGeometry, defaultMaterial);
    let renderer = new W3DE.WebGLRenderer(mesh, {selector: "#canvas-parent", width: "1000px", height: "1000px"});
    renderer.resizeCanvasToDisplaySize();
    renderer.render();

    buttons.forEach(button => {
        button.disabled = true;
    }) 
}
