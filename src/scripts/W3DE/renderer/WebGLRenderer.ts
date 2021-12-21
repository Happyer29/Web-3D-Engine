import { Mesh } from "../objects/Mesh";
import { Unit, UnitType } from "../utils/unitType";
import { config } from "./config";
import { WebGlShaderCreator } from "./WebGlShaderCreator";
import { Matrix4 } from "../maths/Matrix4";
import { Scene } from "../scenes/Scene";
import { Object3D } from "../W3DE";
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
    private readonly _canvas;
    private readonly _parentCanvasEl: HTMLElement;
    private _ctx : WebGLRenderingContext;
    //private readonly _canvas: HTMLCanvasElement;

    private _options: ConstructorOptions = {};
    private _pixelRatio = 1;

    private _width: Unit;
    private _height: Unit;

    private _scene: Scene;
    private _animationSpeed: number = 0;
    private time: number = 1;

    private _animation;
    private camera: Camera;

    constructor(scene: Scene, camera: Camera, options: ConstructorOptions = {}) {
        this._options = options;
        this._scene = scene;

        this._parentCanvasEl = document.querySelector(options.selector ?? "body")
        this._canvas = this.createCanvasElement()
        this._ctx = this.getCtx();

        this.camera = camera;
        this.camera.aspect = this._ctx.canvas.clientWidth / this._ctx.canvas.clientHeight;


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
        this.time += this.animationSpeed;

        this.scene.getItemsToRender().forEach(object3d => {
            let size = 3;
            let type = this._ctx.FLOAT;
            let normalize = false;
            let stride = 0;
            let offset = 0;
            // TODO: Rename this.init, cause init = initialize (now returns array)
            // TODO: May be refactor to 1 function render() using utils functions like createAttributeSetters(), setAttributes(), 
            // TODO: Reference: https://webglfundamentals.org/webgl/lessons/webgl-less-code-more-fun.html
            this._ctx.vertexAttribPointer(this.init(object3d), size, type, normalize, stride, offset);

            let primitiveType = this._ctx.TRIANGLES;
            let offsetDraw = 0;
            let count = object3d.geometry.position.length / 3;

            this._ctx.drawArrays(primitiveType, offsetDraw, count);
        })

        requestAnimationFrame(() => {
            if (this._animation)
                this._animation(this.time)
            this.render()
        });
    }

    private mainMatrix(object3d: Object3D) {
        function degToRad(d) {
            return d * Math.PI / 180;
        }

        // let matrix = new Matrix4().projection(this._ctx.canvas.clientWidth, this._ctx.canvas.clientHeight, 10000);
        
        // matrix = matrix.translate(object3d.translation[0], object3d.translation[1], object3d.translation[2]);
        // matrix = matrix.xRotate(object3d.rotation[0]);
        // matrix = matrix.yRotate(object3d.rotation[1]);
        // matrix = matrix.zRotate(object3d.rotation[2]);
        // matrix = matrix.scale(object3d.scale[0], object3d.scale[1], object3d.scale[2]);

        let matrix = new Matrix4(Matrix4Utils.multiplication(this.camera.viewProjectionMatrix, matrix));
    
        matrix = matrix.xRotate(object3d.rotation[0]);
        matrix = matrix.zRotate(object3d.rotation[2]);
        matrix = matrix.yRotate(object3d.rotation[1]);

        matrix = matrix.scale(object3d.scale[0], object3d.scale[1], object3d.scale[2]);
        
        return matrix;
    }

    private init(object3d: Object3D) {
        let gl = this._ctx;

            // Clear the canvas AND the depth buffer.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Turn on culling. By default backfacing triangles
        // will be culled.
        gl.enable(gl.CULL_FACE);

        // Enable the depth buffer
        gl.enable(gl.DEPTH_TEST);

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

        const vs = `
        attribute vec4 a_position;
        attribute vec3 a_normal;
        
        uniform vec3 u_lightWorldPosition;
        uniform vec3 u_viewWorldPosition;
        
        uniform mat4 u_world;
        uniform mat4 u_worldViewProjection;
        uniform mat4 u_worldInverseTranspose;
        
        varying vec3 v_normal;
        
        varying vec3 v_surfaceToLight;
        varying vec3 v_surfaceToView;
        
        void main() {
          // Multiply the position by the matrix.
          gl_Position = u_worldViewProjection * a_position;
        
          // orient the normals and pass to the fragment shader
          v_normal = mat3(u_worldInverseTranspose) * a_normal;
        
          // compute the world position of the surface
          vec3 surfaceWorldPosition = (u_world * a_position).xyz;
        
          // compute the vector of the surface to the light
          // and pass it to the fragment shader
          v_surfaceToLight = u_lightWorldPosition - surfaceWorldPosition;
        
          // compute the vector of the surface to the view/camera
          // and pass it to the fragment shader
          v_surfaceToView = u_viewWorldPosition - surfaceWorldPosition;
}
        `;

        const fs = `
        precision highp float;

        // Passed in from the vertex shader.
        varying vec3 v_normal;
        varying vec3 v_surfaceToLight;
        varying vec3 v_surfaceToView;
        
        uniform vec4 u_color;
        uniform float u_shininess;
        
        void main() {
          // because v_normal is a varying it's interpolated
          // so it will not be a unit vector. Normalizing it
          // will make it a unit vector again
          vec3 normal = normalize(v_normal);
        
          vec3 surfaceToLightDirection = normalize(v_surfaceToLight);
          vec3 surfaceToViewDirection = normalize(v_surfaceToView);
          vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);
        
          float light = dot(normal, surfaceToLightDirection);
          float specular = 0.0;
          if (light > 0.0) {
            specular = pow(dot(normal, halfVector), u_shininess);
          }
        
          gl_FragColor = vec4(1, 0, 0.5, 1);
        
          // Lets multiply just the color portion (not the alpha)
          // by the light
          gl_FragColor.rgb *= light * (u_shininess / 100.0);
        
          // Just add in the specular
  }`;
        // create GLSL shaders, upload the GLSL source, compile the shaders
        let vertexShader = new WebGlShaderCreator(gl).createVertexShader(vs);
        let fragmentShader = new WebGlShaderCreator(gl).createFragmentShader(fs);
        // Link the two shaders into a program
        let program = createProgram(gl, vertexShader, fragmentShader);
        // look up where the vertex data needs to go.
        let positionAttributeLocation = gl.getAttribLocation(program, "a_position");
        let matrixLocation = gl.getUniformLocation(program, "u_matrix");
        var worldViewProjectionLocation = gl.getUniformLocation(program, "u_worldViewProjection");
        var worldInverseTransposeLocation = gl.getUniformLocation(program, "u_worldInverseTranspose");
 
        var shininessLocation = gl.getUniformLocation(program, "u_shininess");
        
        var lightWorldPositionLocation =
            gl.getUniformLocation(program, "u_lightWorldPosition");

        var viewWorldPositionLocation =
            gl.getUniformLocation(program, "u_viewWorldPosition");

        var worldLocation =
            gl.getUniformLocation(program, "u_world");
        // Create a buffer and put three 2d clip space points in it

        let positionBuffer = gl.createBuffer();

        // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        let positions = object3d.geometry.position;

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        // code above this line is initialization code.
        // code below this line is rendering code.

        this.resizeCanvasToDisplaySize();

        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // Clear the canvas

        let worldMatrix = this.mainMatrix(object3d);
        // Tell it to use our program (pair of shaders)
        gl.useProgram(program);
 
        // Turn on the attribute
        gl.enableVertexAttribArray(positionAttributeLocation);

        // Bind the position buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        // Multiply the matrices.        

        let worldViewProjectionMatrix = new Matrix4(Matrix4Utils.multiplication(this.camera.viewProjectionMatrix, worldMatrix.matrix));
        
        
        let worldInverseMatrix = new Matrix4(Matrix4Utils.inverse(worldMatrix.matrix));
        let worldInverseTransposeMatrix = new Matrix4(Matrix4Utils.transpose(worldInverseMatrix.matrix));
        console.log(worldViewProjectionMatrix, worldInverseMatrix, worldInverseTransposeMatrix);
        // Set the matrices
        gl.uniformMatrix4fv(worldViewProjectionLocation, false, worldViewProjectionMatrix.matrixToArray());
        gl.uniformMatrix4fv(worldInverseTransposeLocation, false, worldInverseTransposeMatrix.matrixToArray());
        gl.uniformMatrix4fv(worldLocation, false, worldMatrix.matrixToArray());

        
        // set the light position
        gl.uniform3fv(lightWorldPositionLocation, Array.from(this.scene.light.position.positionArr));

        // set the camera/view position
        gl.uniform3fv(viewWorldPositionLocation, this.camera.getPositionAsArray());

        // set the shininess
        gl.uniform1f(shininessLocation, this.scene.light.shininess);

        return positionAttributeLocation;
    }
}