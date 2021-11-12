import {Mesh} from "../core/Mesh";
import {Unit, UnitType} from "../utils/unitType";
import {config} from "./config";

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
    //private readonly _canvas: HTMLCanvasElement;

    private _options: ConstructorOptions = {};
    private _pixelRatio = 1;

    private _width: Unit;
    private _height: Unit;

    private _mesh: Mesh;
    private time: number = 1;

    constructor(canvas: HTMLCanvasElement, mesh: Mesh, options: ConstructorOptions = {}) {
        this._options = options;
        this._mesh = mesh;

        this._canvas = this.createCanvasElement(options.selector ?? undefined)

        this.setSize(new Unit(options.width ?? undefined), new Unit(options.height ?? undefined), true)
    }

    //TODO webgl2 and webgl, now only webgl2
    //TODO now used 2d only for rectangles tests
    public getCtx(attr?: CtxAttr) {
        return this._canvas.getContext("2d", attr);
    }

    public setSize(width: Unit = config.width, height: Unit = config.height, updateStyle: boolean = false) {
        this._width = width;
        this._height = height;

        this._canvas.width = Math.floor(width.intUnit * this._pixelRatio);
        this._canvas.height = Math.floor(height.intUnit * this._pixelRatio);

        if (updateStyle !== false) {
            console.log(width);
            this._canvas.style.width = width + 'px';
            this._canvas.style.height = height + 'px';
            console.log(this._canvas.style.width);
        }
    }

    private createCanvasElement(selector: parentCanvasSelector = "body") {
        const canvas = this.createElementNS('canvas');

        let el = document.querySelector(selector)
        el.appendChild(canvas);

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
        console.log(this.time);

        function createShader(gl, type, source) {
            let shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
            if (success) {
                return shader;
            }

            console.log(gl.getShaderInfoLog(shader));
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

            console.log(gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
        }

        // Get A WebGL context
        const gl = this.canvas.getContext("webgl");
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
        let m4 = {

            projection: function (width, height, depth) {
                // Note: This matrix flips the Y axis so 0 is at the top.
                return [
                    2 / width, 0, 0, 0,
                    0, -2 / height, 0, 0,
                    0, 0, 2 / depth, 0,
                    -1, 1, 0, 1,
                ];
            },

            multiply: function (a, b) {
                let a00 = a[0 * 4 + 0];
                let a01 = a[0 * 4 + 1];
                let a02 = a[0 * 4 + 2];
                let a03 = a[0 * 4 + 3];
                let a10 = a[1 * 4 + 0];
                let a11 = a[1 * 4 + 1];
                let a12 = a[1 * 4 + 2];
                let a13 = a[1 * 4 + 3];
                let a20 = a[2 * 4 + 0];
                let a21 = a[2 * 4 + 1];
                let a22 = a[2 * 4 + 2];
                let a23 = a[2 * 4 + 3];
                let a30 = a[3 * 4 + 0];
                let a31 = a[3 * 4 + 1];
                let a32 = a[3 * 4 + 2];
                let a33 = a[3 * 4 + 3];
                let b00 = b[0 * 4 + 0];
                let b01 = b[0 * 4 + 1];
                let b02 = b[0 * 4 + 2];
                let b03 = b[0 * 4 + 3];
                let b10 = b[1 * 4 + 0];
                let b11 = b[1 * 4 + 1];
                let b12 = b[1 * 4 + 2];
                let b13 = b[1 * 4 + 3];
                let b20 = b[2 * 4 + 0];
                let b21 = b[2 * 4 + 1];
                let b22 = b[2 * 4 + 2];
                let b23 = b[2 * 4 + 3];
                let b30 = b[3 * 4 + 0];
                let b31 = b[3 * 4 + 1];
                let b32 = b[3 * 4 + 2];
                let b33 = b[3 * 4 + 3];
                return [
                    b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
                    b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
                    b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
                    b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
                    b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
                    b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
                    b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
                    b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
                    b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
                    b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
                    b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
                    b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
                    b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
                    b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
                    b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
                    b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
                ];
            },

            translation: function (tx, ty, tz) {
                return [
                    1, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, 1, 0,
                    tx, ty, tz, 1,
                ];
            },

            xRotation: function (angleInRadians) {
                let c = Math.cos(angleInRadians);
                let s = Math.sin(angleInRadians);

                return [
                    1, 0, 0, 0,
                    0, c, s, 0,
                    0, -s, c, 0,
                    0, 0, 0, 1,
                ];
            },

            yRotation: function (angleInRadians) {
                let c = Math.cos(angleInRadians);
                let s = Math.sin(angleInRadians);

                return [
                    c, 0, -s, 0,
                    0, 1, 0, 0,
                    s, 0, c, 0,
                    0, 0, 0, 1,
                ];
            },

            zRotation: function (angleInRadians) {
                let c = Math.cos(angleInRadians);
                let s = Math.sin(angleInRadians);

                return [
                    c, s, 0, 0,
                    -s, c, 0, 0,
                    0, 0, 1, 0,
                    0, 0, 0, 1,
                ];
            },

            scaling: function (sx, sy, sz) {
                return [
                    sx, 0, 0, 0,
                    0, sy, 0, 0,
                    0, 0, sz, 0,
                    0, 0, 0, 1,
                ];
            },

            translate: function (m, tx, ty, tz) {
                return m4.multiply(m, m4.translation(tx, ty, tz));
            },

            xRotate: function (m, angleInRadians) {
                return m4.multiply(m, m4.xRotation(angleInRadians));
            },

            yRotate: function (m, angleInRadians) {
                return m4.multiply(m, m4.yRotation(angleInRadians));
            },

            zRotate: function (m, angleInRadians) {
                return m4.multiply(m, m4.zRotation(angleInRadians));
            },

            scale: function (m, sx, sy, sz) {
                return m4.multiply(m, m4.scaling(sx, sy, sz));
            },

        };

        function degToRad(d) {
            return d * Math.PI / 180;
        }

        let translation = [450, 450, 0];
        let rotation = [degToRad(180), degToRad(20 * this.time), degToRad(20)];
        let scale = [2, 2, 2];
        let matrix = m4.projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 1000);
        matrix = m4.translate(matrix, translation[0], translation[1], translation[2]);
        matrix = m4.xRotate(matrix, rotation[0]);
        matrix = m4.yRotate(matrix, rotation[1]);
        matrix = m4.zRotate(matrix, rotation[2]);
        matrix = m4.scale(matrix, scale[0], scale[1], scale[2]);

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

        function resizeCanvasToDisplaySize(canvas, multiplier?) {
            multiplier = multiplier || 1;
            const width = canvas.clientWidth * multiplier | 0;
            const height = canvas.clientHeight * multiplier | 0;
            if (canvas.width !== width || canvas.height !== height) {
                canvas.width = width;
                canvas.height = height;
                return true;
            }
            return false;
        }

        resizeCanvasToDisplaySize(this.canvas);

        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // Clear the canvas
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Tell it to use our program (pair of shaders)
        gl.useProgram(program);
        gl.uniformMatrix4fv(matrixLocation, false, matrix);
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