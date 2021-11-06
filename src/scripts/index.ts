import {Matrix3} from "./W3DE/maths/Matrix3";
import {WebGLRenderer} from "./W3DE/renderer/WebGLRenderer";

let gl = new WebGLRenderer();

gl.setSize(500, 500, false);

let ctx = gl.getCtx();
ctx.lineWidth   = 1;
ctx.strokeStyle = '#f00';
ctx.fillStyle   = '#eff';

ctx.fillRect(  10.5, 10.5, 20, 20 );
ctx.strokeRect( 10.5, 10.5, 20, 20 );
ctx.fillRect(   40, 10.5, 20, 20 );
ctx.strokeRect( 40, 10.5, 20, 20 );
ctx.fillRect(   70, 10, 20, 20 );
ctx.strokeRect( 70, 10, 20, 20 );






