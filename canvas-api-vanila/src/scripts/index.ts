// import './another-file';
//import {bgGrid} from "./canvas/bg"
import {Canvas} from "./canvas/canvas"
import {colorFulFigure, Figure, figure} from "./canvas/figure";

let canvas = new Canvas('#canvas');


canvas.addFigure({
    type: "circle",
    radius: 15,
    color: "#ff0000",
    position: {
        x: 50,
        y: 50
    }
})

canvas.addFigure({
    type: "circle",
    radius: 30,
    color: "#ffff00",
    position: {
        x: 80,
        y: 50
    }
})
canvas.render();

//
//
// canvas.addCircle(circle);
// canvas.animateTo(circle);

//canvas.render();
//console.log(canvas.getFigures()[0]);


//
// var figure1 = new Figure(
//     canvas,
//     ctx,
//     {
//         radius: 20,
//         color: new Color("#ff0000"),
//         position: {
//             x: 50,
//             y: 50
//
//         }
//     }
// )
// figure1.render(ctx);
//
// var figure2 = new Figure(
//     canvas,
//     ctx,
//     {
//         width:10,
//         color: new Color("#0000ff"),
//         position: {
//             x: 50,
//             y: 50
//         }
//     },
//
// )
// figure2.render(ctx);


//figure1.animateTo();


//figureInstance.animateTo();


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
