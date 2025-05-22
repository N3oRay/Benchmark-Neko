import openfl.display.Sprite;
import openfl.text.TextField;
import openfl.text.TextFormat;
import openfl.system.Capabilities;
import lime.graphics.opengl.GL;
import lime.app.Application;

class GPUSpecs extends Sprite {
    public function new() {
        super();
        var specs:String = getGPUSpecs();
        var tf = new TextField();
        tf.width = 800;
        tf.height = 600;
        tf.multiline = true;
        tf.wordWrap = true;
        tf.defaultTextFormat = new TextFormat("_sans", 18, 0x000000);
        tf.text = specs;
        addChild(tf);
    }

    private function getGPUSpecs():String {
        var specs = "";
        specs += "OpenFL/Lime Version: " + Capabilities.version + "\n";
        #if lime
        var gl = Application.current.window.context;
        if (gl != null && Std.isOfType(gl, GL)) {
            specs += "GL_VENDOR: " + GL.getParameter(GL.VENDOR) + "\n";
            specs += "GL_RENDERER: " + GL.getParameter(GL.RENDERER) + "\n";
            specs += "GL_VERSION: " + GL.getParameter(GL.VERSION) + "\n";
            specs += "GL_SHADING_LANGUAGE_VERSION: " + GL.getParameter(GL.SHADING_LANGUAGE_VERSION) + "\n";
            specs += "GL_MAX_TEXTURE_SIZE: " + GL.getParameter(GL.MAX_TEXTURE_SIZE) + "\n";
            specs += "GL_MAX_VERTEX_ATTRIBS: " + GL.getParameter(GL.MAX_VERTEX_ATTRIBS) + "\n";
            // Add other GL parameters if you wish
        } else {
            specs += "OpenGL context not available.\n";
        }
        #else
        specs += "Lime/OpenGL info not available on this platform.\n";
        #end
        return specs;
    }
}