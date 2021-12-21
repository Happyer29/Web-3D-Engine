import { Camera } from './W3DE/cameras/Camera';
import * as W3DE from './W3DE/W3DE';

let t = new W3DE.Matrix3([[0, 1, 0]]);
let a = new W3DE.Vector3([1, 2, 3]);
console.log(a.positionArr[1])
console.log(t.matrix)

let objInput: HTMLButtonElement = document.querySelector("#obj-loader");
let textureInput: HTMLButtonElement = document.querySelector("#texture-loader");
let drawGeometryBtn: HTMLButtonElement = document.querySelector("#draw-geometry");

let showControlsButton : HTMLButtonElement = document.querySelector("#show-controls-button");
let controlsBlock : HTMLElement = document.querySelector(".controls-block");
let pressedKeyBlock : HTMLElement = document.querySelector(".pressed-key");
let pressedKeyValue : HTMLElement = document.querySelector(".pressed-key-value");

showControlsButton.onclick = () => {
    controlsBlock.style.transform = "translateX(0)";
}
showControlsButton.ondblclick = () => {
    controlsBlock.style.transform = "translateX(150%)";
}

let buttons: HTMLButtonElement[] = [
    objInput,
    textureInput,
    drawGeometryBtn,
]

objInput.addEventListener('change', readObjectFromInput, false);
textureInput.addEventListener('change', readTextureFromInput, false);
drawGeometryBtn.addEventListener('click', drawGeometry, false);

async function readObjectFromInput(event: Event) {
    const resetCameraButton : HTMLButtonElement = document.querySelector("#reset-camera-button");
    const resetObjectButton : HTMLButtonElement = document.querySelector("#reset-object-button");
    const input = event.target as HTMLInputElement;

    const files = input.files;
    const file = files[0];
    const fileText = await W3DE.FileLoader.loadAsText(file);

    const object = await new W3DE.ObjParser().parseObjectFromString(fileText);//TODO

    const sphereGeometry = new W3DE.SphereGeometry(10, 100); // change roundness to 10-20 to clearly see rotation

    const defaultMaterial = await W3DE.Material.getDefaultMaterial();

    const sphere = new W3DE.Mesh(sphereGeometry, defaultMaterial);

    const scene = new W3DE.Scene();

    const cameraPosition = new W3DE.Vector3([0, 20, 60]);
    const up = new W3DE.Vector3([0, 1, 0]);
    const target = new W3DE.Vector3([0, 1, 0]);

    // TODO object.move(x,y,z); object.rotate.x();
    const camera = new Camera(cameraPosition, target, up);

    camera.attachDefaultControls();
    object.attachDefaultControls();
 
    scene.add(object);

    const renderer = new W3DE.WebGLRenderer(scene, camera, { selector: "#canvas-parent", width: "1000px", height: "1000px" });


    resetCameraButton.onclick = () => {
        camera.rotate(0, 0);
        camera.setTranslation(cameraPosition.positionArr[0],cameraPosition.positionArr[1],cameraPosition.positionArr[2]);
    }
    resetObjectButton.onclick = () => {
        object.setRotation(0, 0, 0);
        object.toDefaultTRS();
    }
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

    const resetCameraButton : HTMLButtonElement = document.querySelector("#reset-camera-button");
    const resetObjectButton : HTMLButtonElement = document.querySelector("#reset-object-button");

    // let zPressed = false;
    // let cPressed = false;
    // window.addEventListener("wheel", event => {
    //     if (!zPressed) camera.translate(0, 0, event.deltaY / 25); // +
    //     if (zPressed) {
    //         object.setRotationZ(object.rotation[2] + event.deltaY / 25)
    //         console.log("z pressed")
    //     } // +
    // });
    // window.addEventListener("keydown", event => {
    //     pressedKeyBlock.style.display = "block";
    //     if (pressedKeyValue.innerText != event.key)
    //     pressedKeyValue.innerText = event.key;
    //     switch (event.key) {
    //         case "ArrowLeft":
    //             camera.translate(-10, 0, 0);
    //             break;
    //         case "ArrowRight":
    //             camera.translate(10, 0, 0);
    //             break;
    //         case "ArrowUp":
    //             camera.translate(0, 10, 0);
    //             break;
    //         case "ArrowDown":
    //             camera.translate(0, -10, 0);
    //             break;
    //     }
    //     switch (event.key.toLowerCase()) {
    //         case "a":
    //             camera.translate(-10, 0, 0);
    //             break;
    //         case "d":
    //             camera.translate(10, 0, 0);
    //             break;
    //         case "w":
    //             camera.translate(0, 10, 0);
    //             break;
    //         case "s":
    //             camera.translate(0, -10, 0);
    //             break;
    //     }
    //     switch (event.key.toLowerCase()) {
    //         case "z":
    //             zPressed = true;
    //             break;
    //         case "c":
    //             cPressed = true;
    //             break;
    //     }
    // });
    // window.addEventListener("keyup", event => {
    //     pressedKeyBlock.style.display = "none";
    //     pressedKeyValue.innerText = " ";
    //     switch (event.key.toLowerCase()) {
    //         case "z":
    //             zPressed = false;
    //             break;
    //         case "c":
    //             cPressed = false;
    //             break;
    //     }
    // })
    // let old_x = 0;
    // let old_y = 0;
    // let old_z = 0;
    // let dX = 0;
    // let dY = 0;
    // let dZ = 0;
    // let isDragging = false;
    // let sensitivity = 30;

    // function findZ(value1: number, value2: number) {
    //     return Math.sqrt(value1*value1 + value2*value2 - 2 * value1 * value2 * Math.cos(1 * (Math.PI / 180)));
    // }

    
    // window.addEventListener("mousedown", e => {
    //     old_x = e.pageX;
    //     old_y = e.pageY;
    //     old_z = findZ(e.pageX, e.pageY);
    //     isDragging = true;
    //     console.log('mouseDown');

    //     e.preventDefault();
    //     return false;
    // })
    // let object = 
    // window.addEventListener("mousemove", e => {
    //     if (isDragging) {
    //         dX = (e.pageX - old_x) * 2 * Math.PI / renderer.canvas.width * sensitivity;
    //         dY = (e.pageY - old_y) * 2 * Math.PI / renderer.canvas.height * sensitivity;
    //         dZ = findZ(e.pageX - old_x, e.pageY - old_y) * 2 * Math.PI / renderer.canvas.height * sensitivity;
    //         old_x = e.pageX;
    //         old_y = e.pageY;
    //         old_z = findZ(e.pageX, e.pageY);
    //         if (!cPressed) {
    //         object.setRotationX(object.rotation[0] + dX);
    //         object.setRotationY(object.rotation[1] + dY);
    //         }
    //         if (cPressed) {
    //             camera.rotate(dX, dY)
    //         }
    //         // // object.setRotationZ(0);
    //         // // camera.rotate(dY, dX)
    //         // camera.rotate(dY, dX, 0)
    //     }
    //     e.preventDefault();
    // })
    // window.addEventListener("mouseup", e => {
    //     old_x = e.pageX;
    //     old_y = e.pageY;
    //     old_z = findZ(e.pageX, e.pageY);
    //     isDragging = false;
        
    //     e.preventDefault();
    // })
resetCameraButton.onclick = () => {
        camera.rotate(0, 0);
        camera.setTranslation(cameraPosition.positionArr[0],cameraPosition.positionArr[1],cameraPosition.positionArr[2]);
    }
    resetObjectButton.onclick = () => {

    }
    
    // scene.add(object);
    for (let index = 0; index < 10; index++) {
        const sphereGeometry = new W3DE.SphereGeometry(40, 5); // change roundness to 5-10 to clearly see rotation
        const sphere = new W3DE.Mesh(sphereGeometry, defaultMaterial);
        sphere.setTranslationX(Math.random() * renderer.canvas.clientWidth + 10);
        sphere.setTranslationY(Math.random() * renderer.canvas.clientHeight + 10);
        sphere.setTranslationZ(Math.random() * (renderer.canvas.clientHeight + renderer.canvas.clientWidth - 200) + 10);
        scene.add(sphere);
    }

    let sceneGraph = renderer.scene.getItemsToRender();
    
    renderer.animation = animate;
    function animate() {
        sceneGraph.forEach(element => {
            element.setRotationX(element.rotation[0] + 5);
        });
        return;
    }
    renderer.resizeCanvasToDisplaySize();
    renderer.render();

    buttons.forEach(button => {
        button.disabled = true;
    })
}

