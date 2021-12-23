import { Mesh } from "../objects/Mesh";
import { Unit, UnitType } from "../utils/unitType";
import { config } from "./config";
import { WebGlShaderCreator } from "./WebGlShaderCreator";
import { Matrix4 } from "../maths/Matrix4";
import { Scene } from "../scenes/Scene";
import { Material, Object3D, Vector3 } from "../W3DE";
import { Camera } from "../cameras/Camera";
import { Matrix4Utils } from "../utils/Matrix4Utils";

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
    private readonly _canvas: HTMLCanvasElement;
    private readonly _parentCanvasEl: HTMLElement;
    private _ctx: WebGLRenderingContext;
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

        if (!this.scene.camera) throw new Error("Renderer: There is no CAMERA in provided SCENE!")

        this.scene.camera.aspect = this._ctx.canvas.clientWidth / this._ctx.canvas.clientHeight;

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

    private createCanvasElement(): HTMLCanvasElement {
        const canvas: HTMLCanvasElement = <HTMLCanvasElement>this.createElementNS('canvas');
        this._parentCanvasEl.appendChild(canvas);

        canvas.style.display = 'block';
        return canvas;
    }

    //TODO wtf??
    private createElementNS(name: string) {
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

        let program = this.createProgram();
        this.scene.getItemsToRender().forEach((object) => {
            object.program = program;
            // Create a position buffer
            object.buffers.positionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, object.buffers.positionBuffer);
            let position = object.geometry.position
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position), gl.STATIC_DRAW);

            // Create a texture buffer
            object.buffers.textureBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, object.buffers.textureBuffer);
            let texture = object.geometry.texcoord
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texture), gl.STATIC_DRAW);

            // Create a normal buffer
            object.buffers.normalsBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, object.buffers.normalsBuffer);
            let normals = object.geometry.normal
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
            if (!object.material.isEmpty()) object.texture = this.attachMaterial(object)
            
            

            // Bind it to ARRAY_BUFFER
        });

        this.draw();
    }

    private draw() {
        let gl = this._ctx;

        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);

        let lastUsedProgramInfo = null;
        let lastUsedBufferInfo = null;

        this.resizeCanvasToDisplaySize();
        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        this.scene.getItemsToRender().forEach((object) => {
            

            let program = object.program;


            let projectionMatrixLocation =  gl.getUniformLocation(program, 'uProjectionMatrix');
            let modelViewMatrixLocation =  gl.getUniformLocation(program, 'uModelViewMatrix');
            let normalMatrixLocation=  gl.getUniformLocation(program, 'uNormalMatrix');

            let positionLocation = gl.getAttribLocation(program, 'aVertexPosition');
            let normalsLocation = gl.getAttribLocation(program, 'aVertexNormal');
            let texcoordLocation = gl.getAttribLocation(program, 'aTextureCoord');

            let ambientColorLocation = gl.getUniformLocation(program, 'ambientLight')
            let directionalLightColor = gl.getUniformLocation(program, 'directionalLightColor')
            let lightWorldPositionLocation = gl.getUniformLocation(program, 'directionalVector');

            let ambientShininessLocation = gl.getUniformLocation(program, 'ambientLightShininess');
            let directionalShininessLocation = gl.getUniformLocation(program, 'directionalLightShininess');
            

            var programInfo = object.program;
            var bufferInfo = object.buffers;
            var bindBuffers = false;

            // POSITION

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

            // TEXCOORD
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

            // NORMALS
            gl.enableVertexAttribArray(normalsLocation);
            // bind the normals buffer.
            gl.bindBuffer(gl.ARRAY_BUFFER, object.buffers.normalsBuffer);

            // Tell the normal attribute how to get data out of normalBuffer (ARRAY_BUFFER)
            var size = 3;          // 3 components per iteration
            var type = gl.FLOAT;   // the data is 32bit floats
            var normalize = false; // don't normalize the data
            var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
            var offset = 0;        // start at the beginning of the buffer
            gl.vertexAttribPointer(normalsLocation, size, type, normalize, stride, offset);

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
            }

            let worldMatrix = this.mainMatrix(object);
            let worldViewMatrix = new Matrix4(Matrix4Utils.multiplication(this.scene.camera.viewMatrix.matrix, worldMatrix.matrix));

            gl.uniformMatrix4fv(projectionMatrixLocation, false, this.scene.camera.projectionMatrix.matrixToArray());
            gl.uniformMatrix4fv(modelViewMatrixLocation, false, worldViewMatrix.matrixToArray());
            gl.uniformMatrix4fv(normalMatrixLocation, false, object.normalMatrix.matrixToArray());

            // set the light position
            gl.uniform3fv(ambientColorLocation, this.scene.ambientLight.color.positionArr);
            gl.uniform1f(ambientShininessLocation, this.scene.ambientLight.shininess);
            if (this.scene.light) {
                gl.uniform3fv(lightWorldPositionLocation, this.scene.light.position.positionArr);
                gl.uniform1f(directionalShininessLocation, this.scene.light.shininess);
                gl.uniform3fv(directionalLightColor, this.scene.light.color.positionArr)
            }

            gl.bindTexture(this._ctx.TEXTURE_2D, object.texture);

            let primitiveType = this._ctx.TRIANGLES;
            if (object.type == "Line") primitiveType = this._ctx.LINES;
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

    private mainMatrix(object3d: Object3D): Matrix4 {

        let matrix = new Matrix4(Matrix4Utils.translate(new Matrix4().identityMatrix().matrix, object3d.translation[0], object3d.translation[1], object3d.translation[2]));

        matrix = matrix.xRotate(object3d.rotation[0]);
        matrix = matrix.zRotate(object3d.rotation[2]);
        matrix = matrix.yRotate(object3d.rotation[1]);

        matrix = matrix.scale(object3d.scale[0], object3d.scale[1], object3d.scale[2]);

        if (object3d.parent) matrix = new Matrix4(Matrix4Utils.multiplication(object3d.parent.matrix.matrix, matrix.matrix));
        function updateMatrix(object3d: Object3D, matrix: Matrix4) {
            object3d.matrix = new Matrix4(Matrix4Utils.multiplication(object3d.matrix.matrix, matrix.matrix));
            if (object3d.parent) {
                object3d.children.forEach((child) => {
                    updateMatrix(child, object3d.matrix)
                }
                )
            }
        }
        object3d.children.forEach(function (child) {
            updateMatrix(child, matrix);
        });
        object3d.matrix = matrix;
        return matrix;
    }


    private isPowerOf2(value: number) {
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
        attribute vec4 aVertexPosition;
        attribute vec3 aVertexNormal;
        attribute vec2 aTextureCoord;

        uniform mat4 uNormalMatrix;
        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;

        varying highp vec2 vTextureCoord;
        varying highp vec3 vLighting;

        uniform vec3 ambientLight;
        uniform vec3 directionalLightColor;
        uniform vec3 directionalVector;

        uniform highp float ambientLightShininess;
        uniform highp float directionalLightShininess;
        
        void main(void) {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vTextureCoord = aTextureCoord;

        // Apply lighting effect

        highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

        highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
        
        vLighting = ambientLight * ambientLightShininess / 1000.0 + (directionalLightColor * directional * directionalLightShininess / 1000.0);
        }`;
        // create GLSL shaders, upload the GLSL source, compile the shaders
        return new WebGlShaderCreator(this._ctx).createVertexShader(shader);
    }


    private createFragmentShader() {
        const shader = `
        precision highp float;

        varying highp vec2 vTextureCoord;
        varying highp vec3 vLighting;

        uniform sampler2D u_texture;

        void main(void) {
        highp vec4 texelColor = texture2D(u_texture, vTextureCoord);

        gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
        }`;


        return new WebGlShaderCreator(this._ctx).createFragmentShader(shader);
    }

    private attachMaterial(object3d: Object3D) {
        let material = object3d.material;
        // Now that the image has loaded make copy it to the texture.
        let texture = this._ctx.createTexture();
        this._ctx.bindTexture(this._ctx.TEXTURE_2D, texture);
        this._ctx.texImage2D(this._ctx.TEXTURE_2D, 0, this._ctx.RGBA, this._ctx.RGBA, this._ctx.UNSIGNED_BYTE, material.texture);
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
}