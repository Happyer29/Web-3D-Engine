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
    

    constructor(scene: Scene, camera: Camera, options: ConstructorOptions = {}) {
        this._options = options;
        this._scene = scene;

        this._parentCanvasEl = document.querySelector(options.selector ?? "body")
        this._canvas = this.createCanvasElement()
        this._ctx = this.getCtx();

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
            if (object.material.isEmpty()) console.log(object);
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
            

            let program = object.program;


            let colorLocation = gl.getUniformLocation(program, "u_color");
            let worldViewProjectionLocation = gl.getUniformLocation(program, "u_worldViewProjection");
            let worldInverseTransposeLocation = gl.getUniformLocation(program, "u_worldInverseTranspose");
            let reverseLightDirectionLocation = gl.getUniformLocation(program, "u_reverseLightDirection")
            let shininessLocation = gl.getUniformLocation(program, "u_shininess");

            let lightWorldPositionLocation = gl.getUniformLocation(program, "u_lightWorldPosition");

            let viewWorldPositionLocation = gl.getUniformLocation(program, "u_viewWorldPosition");

            let worldLocation = gl.getUniformLocation(program, "u_world");
            // Create a buffer and put three 2d clip space points in it
            // Tell it to use our program (pair of shaders)

            let textureLocation = gl.getUniformLocation(object.program, "u_texture");

            let positionLocation = gl.getAttribLocation(object.program, "a_position");
            let texcoordLocation = gl.getAttribLocation(object.program, "a_texcoord");
            let normalsLocation = gl.getAttribLocation(program, "a_normal");

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
            var size = 2;          // 2 components per iteration
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
            let worldViewProjectionMatrix = new Matrix4(Matrix4Utils.multiplication(this.scene.camera.viewProjectionMatrix, worldMatrix.matrix));
            let worldInverseMatrix = new Matrix4(Matrix4Utils.inverse(worldMatrix.matrix));
            let worldInverseTransposeMatrix = new Matrix4(Matrix4Utils.transpose(worldInverseMatrix.matrix));

            // Set the matrices
            gl.uniformMatrix4fv(worldViewProjectionLocation, false, worldViewProjectionMatrix.matrixToArray());
            gl.uniformMatrix4fv(worldInverseTransposeLocation, false, worldInverseTransposeMatrix.matrixToArray());
            gl.uniformMatrix4fv(worldLocation, false, worldMatrix.matrixToArray());

            this.scene.light.position = new Vector3([0, 250, 0]);
            this.scene.light.shininess = 150;
            // set the light position
            gl.uniform3fv(lightWorldPositionLocation, this.scene.light.position.positionArr);

            // set the camera/view position
            gl.uniform3fv(viewWorldPositionLocation, this.scene.camera.getPositionAsArray());
            gl.uniform4fv(colorLocation, object.material.color.positionArr);
            // set the shininess
            gl.uniform1f(shininessLocation, this.scene.light.shininess);
            gl.uniform1i(textureLocation, 0);

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
        attribute vec4 a_position;
        attribute vec3 a_normal;
        attribute vec2 a_texcoord;
        
        uniform vec3 u_lightWorldPosition;
        uniform vec3 u_viewWorldPosition;
        
        uniform mat4 u_world;
        uniform mat4 u_worldViewProjection;
        uniform mat4 u_worldInverseTranspose;
        
        varying vec3 v_normal;
        varying vec2 v_texcoord;
        
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

          // Pass the texcoord to the fragment shader.
          v_texcoord = a_texcoord;
        }`;
        // create GLSL shaders, upload the GLSL source, compile the shaders
        return new WebGlShaderCreator(this._ctx).createVertexShader(shader);
    }


    private createFragmentShader() {
        const shader = `
        precision highp float;

        // Passed in from the vertex shader.
varying vec3 v_normal;
varying vec3 v_surfaceToLight;
varying vec3 v_surfaceToView;

uniform float u_shininess;

varying vec2 v_texcoord;
uniform sampler2D u_texture;

vec3 finalColor; 

void main() {
  // because v_normal is a varying it's interpolated
  // so it will not be a unit vector. Normalizing it
  // will make it a unit vector again
  vec3 normal = normalize(v_normal);

  vec3 surfaceToLightDirection = normalize(v_surfaceToLight);
  vec3 surfaceToViewDirection = normalize(v_surfaceToView);
  vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);

  //float light = dot(normal, surfaceToLightDirection);
  //float specular = 0.0;
  //if (light > 0.0) {
    //specular = pow(dot(normal, halfVector), u_shininess / 3.0);
  //}

  gl_FragColor = texture2D(u_texture, v_texcoord);

  // Lets multiply just the color portion (not the alpha)
  // by the light
  //gl_FragColor.rgb *= light;


  // Just add in the specular
  //gl_FragColor.rgb += specular;
  finalColor = v_normal * 0.5 + vec3(0.5);
  // Debugging normals
  // gl_FragColor = vec4(finalColor.x, finalColor.y, finalColor.z, 1.0);
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



    /*
     public render() {
        this.time += this.animationSpeed;

        this.scene.getItemsToRender().forEach(object3d => {
            this.init(object3d)


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

    private mainMatrix(object3d: Object3D) : Matrix4 {
        function degToRad(d) {
            return d * Math.PI / 180;
        }

        // let matrix = new Matrix4().projection(this._ctx.canvas.clientWidth, this._ctx.canvas.clientHeight, 10000);

        // matrix = matrix.translate(object3d.translation[0], object3d.translation[1], object3d.translation[2]);
        // matrix = matrix.xRotate(object3d.rotation[0]);
        // matrix = matrix.yRotate(object3d.rotation[1]);
        // matrix = matrix.zRotate(object3d.rotation[2]);
        // matrix = matrix.scale(object3d.scale[0], object3d.scale[1], object3d.scale[2]);

        let matrix = new Matrix4(Matrix4Utils.translate(new Matrix4().identityMatrix().matrix, object3d.translation[0], object3d.translation[1], object3d.translation[2]));

        matrix = matrix.xRotate(object3d.rotation[0]);
        matrix = matrix.zRotate(object3d.rotation[2]);
        matrix = matrix.yRotate(object3d.rotation[1]);

        matrix = matrix.scale(object3d.scale[0], object3d.scale[1], object3d.scale[2]);

        if (object3d.parent) matrix = new Matrix4(Matrix4Utils.multiplication(object3d.parent.matrix.matrix, matrix.matrix));
        function updateMatrix(object3d : Object3D, matrix : Matrix4) {
            object3d.matrix = new Matrix4(Matrix4Utils.multiplication(object3d.matrix.matrix, matrix.matrix));
            if (object3d.parent) {
                object3d.children.forEach((child) => {
                    updateMatrix(child, object3d.matrix)
                }
                )}
            }
        object3d.children.forEach(function(child) {
            updateMatrix(child, matrix);
        });
        object3d.matrix = matrix;
        return matrix;
    }

    private init(object3d: Object3D) {
        let gl = this._ctx;



        // Turn on culling. By default backfacing triangles
        // will be culled.
        gl.enable(gl.CULL_FACE);

        // Enable the depth buffer
        gl.enable(gl.DEPTH_TEST);

        function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
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
}`;

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
    specular = pow(dot(normal, halfVector), u_shininess / 3.0);
  }

  gl_FragColor = u_color;

  // Lets multiply just the color portion (not the alpha)
  // by the light
  gl_FragColor.rgb *= (light + 0.1);


  // Just add in the specular
  gl_FragColor.rgb += specular;
}`;
        // create GLSL shaders, upload the GLSL source, compile the shaders
        let vertexShader = new WebGlShaderCreator(gl).createVertexShader(vs);
        let fragmentShader = new WebGlShaderCreator(gl).createFragmentShader(fs);
        // Link the two shaders into a program
        let program = createProgram(gl, vertexShader, fragmentShader);
        // look up where the vertex data needs to go.
        let positionAttributeLocation = gl.getAttribLocation(program, "a_position");
        let normalAttributeLocation = gl.getAttribLocation(program, "a_normal");
        let matrixLocation = gl.getUniformLocation(program, "u_matrix");
        let colorLocation = gl.getUniformLocation(program, "u_color");
        let worldViewProjectionLocation = gl.getUniformLocation(program, "u_worldViewProjection");
        let worldInverseTransposeLocation = gl.getUniformLocation(program, "u_worldInverseTranspose");
        let reverseLightDirectionLocation = gl.getUniformLocation(program, "u_reverseLightDirection")
        let shininessLocation = gl.getUniformLocation(program, "u_shininess");

        let lightWorldPositionLocation = gl.getUniformLocation(program, "u_lightWorldPosition");

        let viewWorldPositionLocation = gl.getUniformLocation(program, "u_viewWorldPosition");

        let worldLocation = gl.getUniformLocation(program, "u_world");
        // Create a buffer and put three 2d clip space points in it
        // Tell it to use our program (pair of shaders)

        let positionBuffer = gl.createBuffer();

        // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        let positions = object3d.geometry.position;

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        // Create a buffer to put normals in
        let normalBuffer = gl.createBuffer();
        // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = normalBuffer)
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        // Put normals data into buffer
        let normals = object3d.geometry.normal;
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

        // code above this line is initialization code.
        // code below this line is rendering code.

        this.resizeCanvasToDisplaySize();

        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // Clear the canvas

        let worldMatrix = this.mainMatrix(object3d);


        // Turn on the attribute
        gl.enableVertexAttribArray(positionAttributeLocation);

        // Bind the position buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        let size = 3;
            let type = this._ctx.FLOAT;
            let normalize = false;
            let stride = 0;
            let offset = 0;
            // TODO: Rename this.init, cause init = initialize (now returns array)
            // TODO: May be refactor to 1 function render() using utils functions like createAttributeSetters(), setAttributes(),
            // TODO: Reference: https://webglfundamentals.org/webgl/lessons/webgl-less-code-more-fun.html
            this._ctx.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

        // Turn on the normal attribute
        gl.enableVertexAttribArray(normalAttributeLocation);

        // Bind the normal buffer.
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

        // Tell the attribute how to get data out of normalBuffer (ARRAY_BUFFER)
        size = 3;          // 3 components per iteration
        type = gl.FLOAT;   // the data is 32bit floating point values
        normalize = false; // normalize the data (convert from 0-255 to 0-1)
        stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        offset = 0;        // start at the beginning of the buffer
        gl.vertexAttribPointer(
            normalAttributeLocation, size, type, normalize, stride, offset);

        // Multiply the matrices.
        gl.useProgram(program);
        let worldViewProjectionMatrix = new Matrix4(Matrix4Utils.multiplication(this.scene.camera.viewProjectionMatrix, worldMatrix.matrix));
        let worldInverseMatrix = new Matrix4(Matrix4Utils.inverse(worldMatrix.matrix));
        let worldInverseTransposeMatrix = new Matrix4(Matrix4Utils.transpose(worldInverseMatrix.matrix));

        // Set the matrices
        gl.uniformMatrix4fv(worldViewProjectionLocation, false, worldViewProjectionMatrix.matrixToArray());
        gl.uniformMatrix4fv(worldInverseTransposeLocation, false, worldInverseTransposeMatrix.matrixToArray());
        gl.uniformMatrix4fv(worldLocation, false, worldMatrix.matrixToArray());

        this.scene.light.position = new Vector3([0, 250, 0]);
        this.scene.light.shininess = 150;
        // set the light position
        gl.uniform3fv(lightWorldPositionLocation, Array.from(this.scene.light.position.positionArr));

        // set the camera/view position
        gl.uniform3fv(viewWorldPositionLocation, this.scene.camera.getPositionAsArray());
        gl.uniform4fv(colorLocation, object3d.material.color.positionArr);
        // set the shininess
        gl.uniform1f(shininessLocation, this.scene.light.shininess);

        return positionAttributeLocation;
    }
    */
}