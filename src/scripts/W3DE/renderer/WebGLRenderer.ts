import {Mesh} from "../core/Mesh";
import {Unit, UnitType} from "../utils/unitType";
import {config} from "./config";
import {Matrix4} from "../maths/Matrix4";

interface CtxAttr {
    alpha?: boolean;
    depth?: boolean;
    stencil?: boolean;
    desynchronized?: boolean;
    antialias?: boolean;
    failIfMajorPerformanceCaveat?: boolean;
    powerPreference?: "default" | "high-performance" | "low-power";
    premultipliedAlpha?: boolean;
    preserveDrawingBuffer?: boolean;
    xrCompatible?: boolean;
}

//Опции которые передаются в конструктор рендерера
interface ConstructorOptions{
    selector?: parentCanvasSelector, // селектор для id или body
    width?: UnitType, //ширина канваза
    height?: UnitType, //высота канваза
}

type parentCanvasSelector = `#${string}` | "body";

export class WebGLRenderer {
    private readonly _canvas;
    private readonly _parentCanvasEl: HTMLElement;
    //private readonly _canvas: HTMLCanvasElement;

    private _options: ConstructorOptions = {};
    private _pixelRatio = 1;

    private _width: Unit;
    private _height: Unit;

    private _mesh: Mesh;
    private time: number = 1;

     constructor(mesh: Mesh, options: ConstructorOptions = {}) {
        this._options = options;
        this._mesh = mesh;

        this._parentCanvasEl = document.querySelector(options.selector ?? "body")
        this._canvas = this.createCanvasElement()

        this.setSize(new Unit(options.width ?? undefined), new Unit(options.height ?? undefined), true)
    }

    //TODO webgl2 and webgl, now only webgl2
    //TODO now used 2d only for rectangles tests
    public getCtx(attr?: CtxAttr) {
        return this._canvas.getContext("webgl", attr);
    }

    public setSize(width: Unit = config.width, height: Unit = config.height, updateStyle: boolean = false) {
        this._width = width;
        this._height = height;

        this._canvas.width = Math.floor(width.intUnit * this._pixelRatio);
        this._canvas.height = Math.floor(height.intUnit * this._pixelRatio);

        if (updateStyle !== false) {
            //console.log(width);
            this._canvas.style.width = width + 'px';
            this._canvas.style.height = height + 'px';
            //console.log(this._canvas.style.width);
        }
    }

    public resizeCanvasToDisplaySize(multiplier?) {
        multiplier = multiplier || 1;
        const width = new Unit(this._parentCanvasEl.clientWidth).multiple(multiplier);
        const height = new Unit(this._parentCanvasEl.clientHeight).multiple(multiplier);
        if (!Unit.equal(this._width, width) || !Unit.equal(this._height, height)) {
            this.setSize(width, height, true);
        }
    }

    private createCanvasElement() {
        const canvas = this.createElementNS('canvas');
        this._parentCanvasEl.appendChild(canvas);

        canvas.style.display = 'block';
        return canvas;
    }

    //TODO wtf??
    private createElementNS(name) {
        return document.createElementNS('http://www.w3.org/1999/xhtml', name);
    }

    get mesh(): Mesh {
        return this._mesh;
    }

    set mesh(value: Mesh) {
        this._mesh = value;
    }

    get canvas(): HTMLCanvasElement {
        return this._canvas;
    }

    public render() {
        this.time += 0.03;
        //console.log(this.time);

        function createShader(gl, type, source) {
            let shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
            if (success) {
                return shader;
            }

            //console.log(gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
        }

        function createProgram(gl, vertexShader, fragmentShader) {
            let program = gl.createProgram();
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);
            let success = gl.getProgramParameter(program, gl.LINK_STATUS);
            if (success) {
                return program;
            }

            //console.log(gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
        }

        // Get A WebGL context
        const gl = this.getCtx();
        if (!gl) {
            return;
        }

        // Get the strings for our GLSL shaders
        const vs = `
        attribute vec4 a_position;
 
uniform mat4 u_matrix;
 
void main() {
  // Multiply the position by the matrix.
  gl_Position = u_matrix * a_position;
}
        `;

        const fs = `
        // fragment shaders don't have a default precision so we need
  // to pick one. mediump is a good default
  precision mediump float;
 
  void main() {
    // gl_FragColor is a special variable a fragment shader
    // is responsible for setting
    gl_FragColor = vec4(1, 0, 0.5, 1); // return redish-purple
  }`;


        function degToRad(d) {
            return d * Math.PI / 180;
        }

        let translation = [450, 450, 0];
        let rotation = [degToRad(180), degToRad(20 * this.time), degToRad(20)];
        let scale = [2, 2, 2];
        let matrix = Matrix4.projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 1000);
        matrix = Matrix4.translate(matrix, translation[0], translation[1], translation[2]);
        matrix = Matrix4.xRotate(matrix, rotation[0]);
        matrix = Matrix4.yRotate(matrix, rotation[1]);
        matrix = Matrix4.zRotate(matrix, rotation[2]);
        matrix = Matrix4.scale(matrix, scale[0], scale[1], scale[2]);

        // create GLSL shaders, upload the GLSL source, compile the shaders
        let vertexShader = createShader(gl, gl.VERTEX_SHADER, vs);
        let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fs);
        // Link the two shaders into a program
        let program = createProgram(gl, vertexShader, fragmentShader);
        // look up where the vertex data needs to go.
        let positionAttributeLocation = gl.getAttribLocation(program, "a_position");
        let matrixLocation = gl.getUniformLocation(program, "u_matrix");

        // Create a buffer and put three 2d clip space points in it

        let positionBuffer = gl.createBuffer();

        // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        let positions = this.mesh.geometry.position;
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        // code above this line is initialization code.
        // code below this line is rendering code.

        this.resizeCanvasToDisplaySize();

        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // Clear the canvas
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Tell it to use our program (pair of shaders)
        gl.useProgram(program);
        gl.uniformMatrix4fv(matrixLocation, false, matrix.matrixToArray());
        // Turn on the attribute
        gl.enableVertexAttribArray(positionAttributeLocation);

        // Bind the position buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        let size = 3;          // 2 components per iteration
        let type = gl.FLOAT;   // the data is 32bit floats
        let normalize = false; // don't normalize the data
        let stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        let offset = 0;        // start at the beginning of the buffer
        gl.vertexAttribPointer(
            positionAttributeLocation, size, type, normalize, stride, offset);


        // draw
        let primitiveType = gl.TRIANGLES;
        let offsetDraw = 0;
        let count = this.mesh.geometry.position.length / 3;

        gl.drawArrays(primitiveType, offsetDraw, count);

        requestAnimationFrame(() => this.render());
    }
}