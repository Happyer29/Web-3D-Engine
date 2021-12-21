import { Key } from "./Key";
import { Mouse } from "./Mouse";

export class Controls {
    private keys : Key[];
    private mouse : Mouse;

    constructor(mouse : Mouse, ...keys : Key[]) {
        this.keys = keys;
        this.mouse = mouse;

    }
    public addListenersToWindow() {


        window.addEventListener("keydown", event => {
            let key = this.keys.find(key => key.key == event.key)
            if (key) key.onKeyDown(event);
        });
        window.addEventListener("keyup", event => {
            let key = this.keys.find(key => key.key == event.key)
            if (key) key.onKeyUp(event);
        });
        window.addEventListener("keypress", event => {
            let key = this.keys.find(key => key.key == event.key)
            if (key) key.onKeyPress(event);
        });
        window.addEventListener("mouseup", event => {
            this.mouse.onMouseUp(event);
        });
        window.addEventListener("mousedown", event => {
            this.mouse.onMouseDown(event);
        });
        window.addEventListener("mousemove", event => {
            this.mouse.onMouseMove(event);
        });   
        window.addEventListener("wheel", event => {
            this.mouse.onMouseWheel(event);
        }); 
    }
}