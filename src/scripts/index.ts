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

    const object1 = await new W3DE.ObjParser().parseObjectFromString(fileText);//TODO
    //const object2 = await new W3DE.ObjParser().parseObjectFromString(fileText);//TODO
    const sphereGeometry = new W3DE.SphereGeometry(1, 100); // change roundness to 10-20 to clearly see rotation

    const defaultMaterial = await W3DE.Material.getDefaultMaterial();

    const object2 = new W3DE.Mesh(sphereGeometry);

    const scene = new W3DE.Scene();
    // const axes = new W3DE.Axes(500);
    // axes.setTranslation(100, 0, 100)
    // scene.add(axes);
    // console.log(axes);

    const cameraPosition = new W3DE.Vector3([0, 20, 60]);
    const up = new W3DE.Vector3([0, 1, 0]);
    const target = new W3DE.Vector3([1, 0, 0]);

    // TODO object.move(x,y,z); object.rotate.x();
    const camera = new Camera(cameraPosition, target, up);
    object2.parent = object1;

    object1.setTranslationY(500);
    camera.attachDefaultControls();
    object2.attachDefaultControls();
 
    object2.setTranslation(300, 300, 300);
    scene.add(object2);
    // scene.add(sphere);
    scene.add(object1);
    
    const renderer = new W3DE.WebGLRenderer(scene, camera, { selector: "#canvas-parent", width: "1000px", height: "1000px" });

    resetCameraButton.onclick = () => {
        camera.rotate(0, 0);
        camera.setTranslation(cameraPosition.positionArr[0],cameraPosition.positionArr[1],cameraPosition.positionArr[2]);
    }
    resetObjectButton.onclick = () => {
        object1.setRotation(0, 0, 0);
        object1.toDefaultTRS();
        object2.setRotation(300, 300, 300);
        object2.toDefaultTRS();
    }

    let animate = () => {
        // object2.setTranslationY(object2.translation[1] + 1)
    }

    renderer.resizeCanvasToDisplaySize();
    renderer.animation = animate;
    renderer.render();

    

    buttons.forEach(button => {
        button.disabled = true;
    })
    console.log(scene);
    

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

    const cameraPosition = new W3DE.Vector3([0, 20, 60]);
    const up = new W3DE.Vector3([0, 1, 0]);
    const target = new W3DE.Vector3([1, 0, 0]);

    const camera = new Camera(cameraPosition, up, target);
    camera.attachDefaultControls();
    
    

    const resetCameraButton : HTMLButtonElement = document.querySelector("#reset-camera-button");
    const resetObjectButton : HTMLButtonElement = document.querySelector("#reset-object-button");

    
    resetCameraButton.onclick = () => {
        camera.rotate(0, 0);
        camera.setTranslation(cameraPosition.positionArr[0],cameraPosition.positionArr[1],cameraPosition.positionArr[2]);
    }
    
    // scene.add(object);
    for (let index = 0; index < 10; index++) {
        const sphereGeometry = new W3DE.SphereGeometry(40, 70); // change roundness to 5-10 to clearly see rotation
        const sphere = new W3DE.Mesh(sphereGeometry, defaultMaterial);
        sphere.setTranslationX(index * 50);

        scene.add(sphere);
    }

    const renderer = new W3DE.WebGLRenderer(scene, camera, { selector: "#canvas-parent", width: "1000px", height: "1000px" });
    renderer.animationSpeed = 0.5;
    let sceneGraph = renderer.scene.getItemsToRender();
    
    renderer.animation = animate;
    function animate() {
        sceneGraph.forEach(element => {
            element.setRotationX(element.rotation[0] + 0.5);
        });
        return;
    }
    renderer.resizeCanvasToDisplaySize();
    renderer.render();

    buttons.forEach(button => {
        button.disabled = true;
    })
}

