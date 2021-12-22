import {Mesh} from "../objects/Mesh";
import {Unit, UnitType} from "../utils/unitType";
import {config} from "./config";
import {WebGlShaderCreator} from "./WebGlShaderCreator";
import {Matrix4} from "../maths/Matrix4";
import {Scene} from "../scenes/Scene";
import {Material, Object3D} from "../W3DE";

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
interface ConstructorOptions {
    selector?: parentCanvasSelector, // селектор для id или body
    width?: UnitType, //ширина канваза
    height?: UnitType, //высота канваза
}

type parentCanvasSelector = `#${string}` | "body";

export class WebGLRenderer {
    private readonly _canvas;
    private readonly _parentCanvasEl: HTMLElement;
    private _ctx;
    //private readonly _canvas: HTMLCanvasElement;

    private _options: ConstructorOptions = {};
    private _pixelRatio = 1;

    private _width: Unit;
    private _height: Unit;

    private _scene: Scene;
    private _animationSpeed: number = 0;
    private time: number = 1;

    private _animation;

    constructor(scene: Scene, options: ConstructorOptions = {}) {
        this._options = options;
        this._scene = scene;

        this._parentCanvasEl = document.querySelector(options.selector ?? "body")
        this._canvas = this.createCanvasElement()
        this._ctx = this.getCtx();
        this.setSize(new Unit(options.width ?? undefined), new Unit(options.height ?? undefined), true)
    }

    //TODO webgl2 and webgl, now only webgl2
    //TODO now used 2d only for rectangles tests
    public getCtx(attr?: CtxAttr) {
        return this._canvas.getContext("webgl", attr);
    }

    set animation(value) {
        this._animation = value;
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

    public get scene(): Scene {
        return this._scene;
    }

    public set scene(value: Scene) {
        this._scene = value;
    }

    get canvas(): HTMLCanvasElement {
        return this._canvas;
    }

    public get animationSpeed(): number {
        return this._animationSpeed;
    }

    public set animationSpeed(value: number) {
        this._animationSpeed = value;
    }

    public render() {
        let gl = this._ctx;
        this.time += this.animationSpeed;

        let program = this.createProgram();
        this.scene.getItemsToRender().forEach((object) => {
            object.program = program;
            // Create a texture buffer

            object.buffers.positionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, object.buffers.positionBuffer);
            let position = object.geometry.position
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position), gl.STATIC_DRAW);

            object.buffers.textureBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, object.buffers.textureBuffer);
            let texture = object.geometry.texcoord
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texture), gl.STATIC_DRAW);

            object.texture = this.attachMaterial(object);

            // Bind it to ARRAY_BUFFER
        });

        this.draw();
    }

    private draw() {
        let gl = this._ctx;

        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);
        // this.scene.getItemsToRender().forEach(object3d => {
        //     //чтобы было хоть что-то (не работает корректно)
        //     this.attachMaterial(object3d);
        //     this.init(object3d, program)
        // })

        let lastUsedProgramInfo = null;
        let lastUsedBufferInfo = null;

        this.resizeCanvasToDisplaySize();
        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        this.scene.getItemsToRender().forEach((object) => {
            gl.bindTexture(this._ctx.TEXTURE_2D, object.texture);
            let matrixLocation = gl.getUniformLocation(object.program, "u_matrix");
            let textureLocation = gl.getUniformLocation(object.program, "u_texture");

            let positionLocation = gl.getAttribLocation(object.program, "a_position");
            let texcoordLocation = gl.getAttribLocation(object.program, "a_texcoord");

            var programInfo = object.program;
            var bufferInfo = object.buffers;
            var bindBuffers = false;

            // Create a buffer and put three 2d clip space points in it

            gl.enableVertexAttribArray(positionLocation);
            // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
            gl.bindBuffer(gl.ARRAY_BUFFER, object.buffers.positionBuffer);


            // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
            var size = 3;          // 3 components per iteration
            var type = gl.FLOAT;   // the data is 32bit floats
            var normalize = false; // don't normalize the data
            var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
            var offset = 0;        // start at the beginning of the buffer
            gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);

            // Turn on the texcoord attribute
            gl.enableVertexAttribArray(texcoordLocation);

            // bind the texcoord buffer.
            gl.bindBuffer(gl.ARRAY_BUFFER, object.buffers.textureBuffer);

            // Tell the texcoord attribute how to get data out of texcoordBuffer (ARRAY_BUFFER)
            var size = 2;          // 2 components per iteration
            var type = gl.FLOAT;   // the data is 32bit floats
            var normalize = false; // don't normalize the data
            var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
            var offset = 0;        // start at the beginning of the buffer
            gl.vertexAttribPointer(texcoordLocation, size, type, normalize, stride, offset);

            if (programInfo !== lastUsedProgramInfo) {
                lastUsedProgramInfo = programInfo;
                gl.useProgram(programInfo);

                // We have to rebind buffers when changing programs because we
                // only bind buffers the program uses. So if 2 programs use the same
                // bufferInfo but the 1st one uses only positions the when the
                // we switch to the 2nd one some of the attributes will not be on.
                bindBuffers = true;
            }

            // Setup all the needed attributes.
            if (bindBuffers || bufferInfo !== lastUsedBufferInfo) {
                lastUsedBufferInfo = bufferInfo;
                //TODO wtf???
                //this.setBuffersAndAttributes(gl, programInfo, bufferInfo);
            }

            gl.uniformMatrix4fv(matrixLocation, false, this.mainMatrix(object));
            gl.uniform1i(textureLocation, 0);

            let primitiveType = this._ctx.TRIANGLES;
            let offsetDraw = 0;
            let count = object.geometry.position.length / 3;
            // count = this._scene.elementsCount;
            gl.drawArrays(primitiveType, offsetDraw, count);
        });
        requestAnimationFrame(() => {
            if (this._animation)
                this._animation(this.time)
            this.draw();
        });
    }

    private mainMatrix(object3d: Object3D) {
        let matrix = new Matrix4().projection(this._ctx.canvas.clientWidth, this._ctx.canvas.clientHeight, 1000);
        matrix = matrix.translate(object3d.translation[0], object3d.translation[1], object3d.translation[2]);
        matrix = matrix.xRotate(object3d.rotation[0]);
        matrix = matrix.yRotate(object3d.rotation[1]);
        matrix = matrix.zRotate(object3d.rotation[2]);
        matrix = matrix.scale(object3d.scale[0], object3d.scale[1], object3d.scale[2]);

        return matrix.matrixToArray();
    }

    /*private init(object3d: Object3D) {
        let gl = this._ctx;
        let program = object3d.program
        // look up where the vertex data needs to go.
        let positionAttributeLocation = gl.getAttribLocation(program, "a_position");
        let texcoordAttributLocation = gl.getAttribLocation(program, "a_texcoord");

        let matrixLocation = gl.getUniformLocation(program, "u_matrix");
        let textureLocation = gl.getUniformLocation(program, "u_texture");


        //TODO
        //this.attachMaterial(object3d);

        // code above this line is initialization code.
        // code below this line is rendering code.

        this.resizeCanvasToDisplaySize();

        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // Tell it to use our program (pair of shaders)
        gl.useProgram(program);

        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        var size = 3;          // 3 components per iteration
        var type = gl.FLOAT;   // the data is 32bit floats
        var normalize = false; // don't normalize the data
        var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;        // start at the beginning of the buffer
        gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

        // Turn on the texcoord attribute
        gl.enableVertexAttribArray(texcoordAttributLocation);

        // bind the texcoord buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);

        // Tell the texcoord attribute how to get data out of texcoordBuffer (ARRAY_BUFFER)
        var size = 2;          // 2 components per iteration
        var type = gl.FLOAT;   // the data is 32bit floats
        var normalize = false; // don't normalize the data
        var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        var offset = 0;        // start at the beginning of the buffer
        gl.vertexAttribPointer(texcoordAttributLocation, size, type, normalize, stride, offset);


        gl.uniformMatrix4fv(matrixLocation, false, this.mainMatrix(object3d));
        gl.uniform1i(textureLocation, 0);

        // Bind the position buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);


        let primitiveType = this._ctx.TRIANGLES;
        let offsetDraw = 0;
        let count = object3d.geometry.position.length / 3;
        // count = this._scene.elementsCount;
        console.log(count)

        gl.drawArrays(primitiveType, offsetDraw, count);
    }*/

    private isPowerOf2(value) {
        return (value & (value - 1)) === 0;
    }

    private createProgram() {
        let program = this._ctx.createProgram();
        this._ctx.attachShader(program, this.createVertexShader());
        this._ctx.attachShader(program, this.createFragmentShader());
        this._ctx.linkProgram(program);
        let success = this._ctx.getProgramParameter(program, this._ctx.LINK_STATUS);
        if (success) {
            return program;
        }

        this._ctx.deleteProgram(program);
    }

    private createVertexShader() {
        const shader = `
attribute vec4 a_position;
attribute vec2 a_texcoord;
uniform mat4 u_matrix;
varying vec2 v_texcoord;
void main() {
  // Multiply the position by the matrix.
  gl_Position = u_matrix * a_position;
  // Pass the texcoord to the fragment shader.
  v_texcoord = a_texcoord;
}
        `;
        // create GLSL shaders, upload the GLSL source, compile the shaders
        return new WebGlShaderCreator(this._ctx).createVertexShader(shader);
    }

    private createFragmentShader() {
        const shader = `
precision mediump float;
// Passed in from the vertex shader.
varying vec2 v_texcoord;
// The texture.
uniform sampler2D u_texture;
void main() {
   gl_FragColor = texture2D(u_texture, v_texcoord);
}`;

        return new WebGlShaderCreator(this._ctx).createFragmentShader(shader);
    }

    private attachMaterial(object3d) {
        let material = object3d.material;
        // Now that the image has loaded make copy it to the texture.
        let texture = this._ctx.createTexture();
        this._ctx.bindTexture(this._ctx.TEXTURE_2D, texture);
        this._ctx.texImage2D(this._ctx.TEXTURE_2D, 0, this._ctx.RGBA, this._ctx.RGBA,this._ctx.UNSIGNED_BYTE, material.texture);
        // Check if the image is a power of 2 in both dimensions.
        if (this.isPowerOf2(material.texture.width) && this.isPowerOf2(material.texture.height)) {
            // Yes, it's a power of 2. Generate mips.
            this._ctx.generateMipmap(this._ctx.TEXTURE_2D);
        } else {
            // No, it's not a power of 2. Turn of mips and set wrapping to clamp to edge
            this._ctx.texParameteri(this._ctx.TEXTURE_2D, this._ctx.TEXTURE_WRAP_S, this._ctx.CLAMP_TO_EDGE);
            this._ctx.texParameteri(this._ctx.TEXTURE_2D, this._ctx.TEXTURE_WRAP_T, this._ctx.CLAMP_TO_EDGE);
            this._ctx.texParameteri(this._ctx.TEXTURE_2D, this._ctx.TEXTURE_MIN_FILTER, this._ctx.LINEAR);
        }
        return texture;
    }

    private setBuffersAndAttributes(gl, setters, buffers) {
        this.setAttributes(setters, buffers.attribs);
        if (buffers.indices) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
        }
    }

    private setAttributes(setters, attribs) {
        setters = setters.attribSetters || setters;
        Object.keys(attribs).forEach(function(name) {
            const setter = setters[name];
            if (setter) {
                setter(attribs[name]);
            }
        });
    }

    // private setUniforms(setters, ...values) {
    //     setters = setters.uniformSetters || setters;
    //     for (const uniforms of values) {
    //         Object.keys(uniforms).forEach(function (name) {
    //             const setter = setters[name];
    //             if (setter) {
    //                 setter(uniforms[name]);
    //             }
    //         });
    //     }
    // }
}