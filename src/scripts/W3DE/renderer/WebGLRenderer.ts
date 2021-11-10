interface CtxAttr {
    alpha                           ?: boolean;
    depth                           ?: boolean;
    stencil                         ?: boolean;
    desynchronized                  ?: boolean;
    antialias                       ?: boolean;
    failIfMajorPerformanceCaveat    ?: boolean;
    powerPreference                 ?: "default" | "high-performance" | "low-power";
    premultipliedAlpha              ?: boolean;
    preserveDrawingBuffer           ?: boolean;
    xrCompatible                    ?: boolean;
}

export class WebGLRenderer {
    private readonly _canvas;

    private _options:object = {};
    private _pixelRatio = 1;

    private _width:number;
    private _height: number;
    constructor(options?: object) {
        this._options = options
        this._canvas = this.createCanvasElement()

        this._width = this._canvas.width;
        this._height = this._canvas.height;
    }
    //TODO webgl2 and webgl, now only webgl2
    //TODO now used 2d only for rectangles tests
    public getCtx(attr?: CtxAttr){
        return this._canvas.getContext("2d", attr);
    }

    //TODO resize https://webglfundamentals.org/webgl/lessons/ru/webgl-resizing-the-canvas.html
    public setSize(width: number, height: number, updateStyle?: boolean){
        this._width = width;
        this._height = height;

        this._canvas.width = Math.floor( width * this._pixelRatio );
        this._canvas.height = Math.floor( height * this._pixelRatio );

        if (typeof updateStyle !== 'undefined' && updateStyle !== false ) {
            console.log(width);
            this._canvas.style.width = width + 'px';
            this._canvas.style.height = height + 'px';
            console.log(this._canvas.style.width);
        }
    }

    private createCanvasElement() {
        const canvas = this.createElementNS( 'canvas' );
        // ---- add to body
        let body = document.getElementsByTagName("body")[0];
        body.appendChild(canvas);
        // ----
        canvas.style.display = 'block';
        return canvas;
    }

    private createElementNS( name ) {

        return document.createElementNS( 'http://www.w3.org/1999/xhtml', name );

    }
}