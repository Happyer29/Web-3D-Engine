export class WebGlShaderCreator {

    private readonly gl: WebGLRenderingContext;

    constructor(gl: WebGLRenderingContext) {
        this.gl = gl;
    }

    private createShader(type: number, source: string) {
        let shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        let isShaderCompiled = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);
        if (isShaderCompiled) {
            return shader;
        }

        console.warn(`Error occurred while compiling shader with source: \n${source}`)
        this.gl.deleteShader(shader);
    }

    public createVertexShader(source: string): WebGLShader {
        return this.createShader(this.gl.VERTEX_SHADER, source);

    }
    public createFragmentShader(source: string): WebGLShader {
        return this.createShader(this.gl.FRAGMENT_SHADER, source);
    }
}