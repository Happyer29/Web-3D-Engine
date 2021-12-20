import { Camera } from './W3DE/cameras/Camera';
import { Matrix4Utils } from './W3DE/utils/Matrix4Utils';
import * as W3DE from './W3DE/W3DE';

let t = new W3DE.Matrix3([[0, 1, 0]]);
let a = new W3DE.Vector3([1,2,3]);
console.log(a.positionArr[1])
console.log(t.matrix)

let objInput: HTMLButtonElement = document.querySelector("#obj-loader");
let textureInput: HTMLButtonElement = document.querySelector("#texture-loader");
let drawGeometryBtn: HTMLButtonElement = document.querySelector("#draw-geometry");

let buttons: HTMLButtonElement[] = [
    objInput,
    textureInput,
    drawGeometryBtn,
]

objInput.addEventListener('change', readObjectFromInput, false);
textureInput.addEventListener('change', readTextureFromInput, false);
drawGeometryBtn.addEventListener('click', drawGeometry, false);

async function readObjectFromInput(event: Event) {
    const input = event.target as HTMLInputElement;

    const files = input.files;
    const file = files[0];
    const fileText = await W3DE.FileLoader.loadAsText(file);

    const object = await new W3DE.ObjParser().parseObjectFromString(fileText);

    const sphereGeometry = new W3DE.SphereGeometry(75, 100); // change roundness to 10-20 to clearly see rotation

    const defaultMaterial = await W3DE.Material.getDefaultMaterial();

    const sphere = new W3DE.Mesh(sphereGeometry, defaultMaterial);

    const scene = new W3DE.Scene();

    const cameraPosition = new W3DE.Vector3([1, 0, 0]);
    const up = new W3DE.Vector3([0, 1, 0]);
    const target = new W3DE.Vector3([0, 0, 1]);
    
    // TODO object.move(x,y,z); object.rotate.x();
    const camera = new Camera(cameraPosition, up, target);
    const renderer = new W3DE.WebGLRenderer(scene, camera, { selector: "#canvas-parent", width: "1000px", height: "1000px" });
    renderer.animationSpeed = 0.03;
    // sphere.setTranslation(500, 900, 0)
    window.addEventListener("wheel", event => {
        camera.translate(0, 0, event.deltaY / 10);
    });
    window.addEventListener("keydown", event => {
        switch (event.key) {
            case "ArrowLeft":
                camera.translate(-10, 0, 0);
                break;
            case "ArrowRight":
                camera.translate(10, 0, 0);
                break;
            case "ArrowUp":
                camera.translate(0, 10, 0);
                break;
            case "ArrowDown":
                camera.translate(0, -10, 0);
                break;
        }
    });
    // object.setTranslation(0, 500, 0)
    object.setScale(0.5, 0.5, 0.5);
    object.setRotationX(180);

    scene.add(object);
    scene.add(sphere);

    renderer.resizeCanvasToDisplaySize();
    // renderer.animation = animate;
    renderer.render();

    buttons.forEach(button => {
        button.disabled = true;
    })

    // function animate() {
    //     if (object.translation[0] <= renderer.canvas.clientWidth / 2) {
    //         object.setTranslationX(object.translation[0] + 2.5);
    //         object.setScale(object.scale[0] + 0.1, object.scale[1] + 0.1, object.scale[2] + 0.1);
    //         object.setRotationX(object.rotation[0] + 0.1);
    //         object.setRotationY(object.rotation[1] + 0.1);
    //         return;
    //     }
    //     return;
    // }
}

async function readTextureFromInput(event: Event) {
    const input = event.target as HTMLInputElement;

    const files = input.files;
    const file = files[0];

    const texture = await W3DE.TextureLoader.loadFromFile(file);
    const material = new W3DE.Material(texture);
    console.log(material);

    buttons.forEach(button => {
        button.disabled = true;
    })
}

async function drawGeometry() {
    const sphereGeometry = new W3DE.SphereGeometry(50, 10); // change roundness to 10-20 to clearly see rotation
    const defaultMaterial = await W3DE.Material.getDefaultMaterial();

    const sphere = new W3DE.Mesh(sphereGeometry, defaultMaterial);

    const scene = new W3DE.Scene();

    const cameraPosition = new W3DE.Vector3([1, 0, 0]);
    const up = new W3DE.Vector3([0, 1, 0]);
    const target = new W3DE.Vector3([0, 0, 1]);

    const camera = new Camera(cameraPosition, up, target);
    const renderer = new W3DE.WebGLRenderer(scene, camera, { selector: "#canvas-parent", width: "1000px", height: "1000px" });
    renderer.animationSpeed = 0.5;

    window.addEventListener("wheel", event => {
        camera.translate(0, 0, event.deltaY / 10);
    });
    window.addEventListener("keydown", event => {
        switch (event.key) {
            case "ArrowLeft":
                camera.translate(-10, 0, 0);
                break;
            case "ArrowRight":
                camera.translate(10, 0, 0);
                break;
            case "ArrowUp":
                camera.translate(0, 10, 0);
                break;
            case "ArrowDown":
                camera.translate(0, -10, 0);
                break;
        }
    });

    // scene.add(object);
    for (let index = 0; index < 10; index++) {
        const sphereGeometry = new W3DE.SphereGeometry(40, 5); // change roundness to 10-20 to clearly see rotation
        const sphere = new W3DE.Mesh(sphereGeometry, defaultMaterial);
        sphere.setTranslationX(Math.random()*renderer.canvas.clientWidth + 10);
        sphere.setTranslationY(Math.random()*renderer.canvas.clientHeight + 10);
        scene.add(sphere);
    }

    let sceneGraph = renderer.scene.getItemsToRender();
    // renderer.animation = animate;
    // function animate() {
    //     sceneGraph.forEach(element => {
    //         element.setRotationX(element.rotation[0] + 5);
    //     });
    //     return;
    // }
    renderer.resizeCanvasToDisplaySize();
    renderer.render();

    buttons.forEach(button => {
        button.disabled = true;
    })
}

