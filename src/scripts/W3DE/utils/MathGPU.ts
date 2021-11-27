import { GPU } from "gpu.js";

const gpu = new GPU({mode: "gpu"});
function gsin(x) {
    return Math.sin(x);
}

function gcos(x) {
    return Math.cos(x);
}
console.log(123);
const kernelSin = gpu.createKernel(gsin).setOutput([1]);
const kernelCos = gpu.createKernel(gcos).setOutput([1]);

export class MathGPU {

    public static sin(angleInRadians : number) {
        return kernelSin(angleInRadians)[0];
    }
    public static cos(angleInRadians : number) {
        return kernelCos(angleInRadians)[0];
    }
}