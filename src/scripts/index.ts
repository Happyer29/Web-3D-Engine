// import './another-file';
//import {bgGrid} from "./canvas/bg"
import {Canvas} from "./canvas/canvas"
import {colorFulFigure, Figure} from "./canvas/figure";
import {Point} from "./canvas/Point/point";
import {Vector2D} from "./canvas/Vector/vector2D";
import {Vector3D} from "./canvas/Vector/vector3D";
import {Matrix} from "./canvas/matrix";
//TODO MOCHA TESTS

// let p1 = new Point([1, 2, 0])
// let p2 = new Point([2, 4, 0])
// let p3 = new Point([2, 5, 0])
//
// let v1 = new Vector3D({p1, p2});
// let v2 = new Vector3D([4, 3, 5]);
// console.log(v1, v2);
// console.log("Sum v1+v2 = " + Vector3D.sum(v1, v2).positionArr);
// console.log("Scalar multiplication " + Vector3D.scalarMultiplication(2, v1).positionArr)
// console.log("Unit " + Vector3D.normalization(v2).positionArr)
// console.log("scalarVectorMultiplication " + Vector3D.scalarVectorMultiplication(v1, v2))
// console.log("VectorMultiplication " + Vector3D.vectorMultiplication(v1, v2).positionArr)
//
//
// let test = [[1,2,3],[1,2,3], [1,2,3]]
// let test2 = [[1,2],[1,2,3]]
//
// let m1 = new Matrix(test, 3);
// let m2 = new Matrix(test2, 3);
//
// console.log(Matrix.sumArray(m1,m2))
// console.log(Matrix.vectorMultiplication(m1, v1))
//
// console.log(m1, Matrix.transponse(m1))
//
// console.log(Matrix.identityMatrix(3));
//console.log(Matrix.zeroMatrix(4));


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
figure2.moveTo({x: 100, y: 400});

var figure3 = new Figure({
    type: "rectangle",
    width: 100,
    height: 5,
    color: "#f00fff",
    position: {
        x: 400,
        y: 70
    }
})
figure3.moveTo({x: 100, y: 400});


var figure4 = new Figure({
    type: "rectangle",
    width: 50,
    height: 50,
    color: "#2c35b9",
    position: {
        x: 600,
        y: 600
    }
})
figure4.moveTo({x: 20, y: 400});

canvas.addFigure(figure1)
canvas.addFigure(figure2)
canvas.addFigure(figure3)
canvas.addFigure(figure4)

canvas.render();

// var i = 0;
// setInterval(()=>{
//     i++;
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     ctx.fillRect(i, i, 100, 100);
// }, 20)
