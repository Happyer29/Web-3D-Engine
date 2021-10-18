// import './another-file';
//import {bgGrid} from "./canvas/bg"
import {Canvas} from "./canvas/canvas"
import {colorFulFigure, Figure} from "./canvas/figure";
import {Vector} from "./canvas/vectorClass";
import {Point} from "./canvas/point";


let p1 = new Point(1, 1)
let p2 = new Point(2, 2)

let v = new Vector({p1, p2}, 2);
console.log(v.position)


let canvas = new Canvas('#canvas');

var figure1 = new Figure({
    type: "circle",
    radius: 15,
    color: "#ff0000",
    position: {
        x: 50,
        y: 50
    }
})
figure1.moveTo({x: 20, y: 20});


var figure2 = new Figure({
    type: "circle",
    radius: 30,
    color: "#ffff00",
    position: {
        x: 80,
        y: 50
    }
})
figure2.moveTo({x: 90, y: 80});

canvas.addFigure(figure1)
canvas.addFigure(figure2)

//canvas.render();


// var i = 0;
// setInterval(()=>{
//     i++;
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     ctx.fillRect(i, i, 100, 100);
// }, 20)
