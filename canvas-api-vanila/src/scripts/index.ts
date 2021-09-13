// import './another-file';
//import {bgGrid} from "./canvas/bg"
import {figure} from "./canvas/figure"
import Color from "color";

var figureVar = new figure('#canvas');
var ctx = figureVar.createFigure({radius: 20, color: new Color("#000")})


figureVar.render(ctx);


// const canvas = <HTMLCanvasElement> document.getElementById('canvas');
// const ctx = canvas.getContext('2d');

// Save the default state
// ctx.save();

// ctx.fillStyle = 'green';
// ctx.fillRect(10, 10, 100, 100);

// var i = 0;
// setInterval(()=>{
//     i++;
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     ctx.fillRect(i, i, 100, 100);
// }, 20)
