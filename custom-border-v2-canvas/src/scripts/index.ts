// import './another-file';
import {bgGrid} from "./canvas/bg"
import Konva from "konva";
let bg = new bgGrid();


let stage = new Konva.Stage({
    container: 'container',
    width: bgGrid.getWidth(),
    height: bgGrid.getHeight(),
});

let bgLayer = bg.createBgLayer();

stage.add(bgLayer);