// import './another-file';
//import {bgGrid} from "./canvas/bg"
import {Figure} from "./canvas/figure"
import Color from "ts-color-class";

var figureVar = new Figure('#canvas');
var ctx1 = figureVar.createFigure(
    {
        radius: 20,
        color: new Color("#ff0000")
    },
    {
        x: 0,
        y: 0
    }
)

var ctx2 = figureVar.createFigure(
    {
        size:10,
        color: new Color("#ff0000")
    },
    {
        x: 50,
        y: 50
    }
)


figureVar.render(ctx1);
figureVar.render(ctx2);


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
