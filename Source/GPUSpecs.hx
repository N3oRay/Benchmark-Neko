import openfl.display.Sprite;
import openfl.text.TextField;
import openfl.text.TextFormat;
import openfl.text.Font;
import openfl.system.Capabilities;
import lime.graphics.opengl.GL;
import openfl.display.Shape;
import lime.app.Application;
import openfl.filters.DropShadowFilter;
import openfl.filters.GlowFilter;
#if (linux)
import haxe.io.Input;
#end

#if (gl_stats && !disable_cffi && (!html5 || !canvas))
import openfl.display._internal.stats.Context3DStats;
import openfl.display._internal.stats.DrawCallContext;
#end
import openfl.display.Graphics;

/**

In DEV TEST 

@author N3oray

**/


class GPUSpecs extends Sprite {

    private var stateboard:Sprite;
    private var isVisible:Bool = false;
    public function new(font:Font) {
        super();



        stateboard = new Sprite();
        // Draw the button background
        //myGraphic = new DisplayObject();
        var myGraphic = new Shape();
        myGraphic.graphics.beginFill(0x333333); // color
        myGraphic.graphics.drawRoundRect(440, 50, 400, 80, 10, 10); // x, y, width, height, ellipseWidth, ellipseHeight
        myGraphic.graphics.endFill();
        stateboard.addChild(myGraphic); // This works because state is a Sprite

        // Add effects: shadow and glow
        this.filters = [
            new DropShadowFilter(4, 45, 0x000000, 0.6, 8, 8, 1, 1),
            new GlowFilter(0xffffff, 0.7, 10, 10, 2, 1)
        ];

        var specs:String = getGPUInfo();
        var tf = new TextField();
        tf.width = 400;
        tf.height = 80;
        tf.multiline = true;
        tf.wordWrap = true;
        //tf.defaultTextFormat = new TextFormat("_sans", 18, 0x000000);
        //tf.defaultTextFormat = new TextFormat(font.fontName, 12, 0xededed);
        tf.defaultTextFormat = new TextFormat("Arial", 15, 0xFFFFFF);
        tf.x = 440;
        tf.y = 50;
        tf.text = specs;
        stateboard.addChild(tf);

        //Init 
        stateboard.visible = isVisible;
        addChild(stateboard);
    }

    private function toggleGraphic():Void {
        isVisible = !isVisible;
        stateboard.visible = isVisible;
    }

    private function getGPUInfo():String {
        toggleGraphic();
        var info = "";
        #if (gl_stats && !disable_cffi && (!html5 || !canvas))
        info += "Total Draw Calls: " + Context3DStats.totalDrawCalls() + "\n";
        info += "Stage Draw Calls: " + Context3DStats.contextDrawCalls(DrawCallContext.STAGE) + "\n";
        #end

        /**
        if (Graphics.maxTextureWidth != null) {
            info += "Max Texture Size: " + Graphics.maxTextureWidth + "\n";
        }
        **/
        // You might be able to get GPU memory info (not always available)
        #if openfl_display3d
        try {
            var stage = openfl.Lib.current.stage;
            if (stage != null && stage.stage3Ds != null && stage.stage3Ds.length > 0) {
                var context = stage.stage3Ds[0].context3D;
                if (context != null) {
                    info += "Total GPU Memory: " + context.totalGPUMemory + "\n";
                }
            }
        } catch(e:Dynamic) {}
        #end

        #if linux
            //info = Sys.command("lspci | grep VGA");
            var p = new sys.io.Process("lspci | grep VGA", ["-nn"]);
            var lines = "";
            try {
                while (true) {
                    lines += p.stdout.readLine() + "\n";
                }
            } catch (e:haxe.io.Eof) {
                // End of output
            }
            p.close();
            info = lines;

        #end

        return info != "" ? info : "No GPU info available on this platform.";
    }

    private function getGPUSpecs():String {

        toggleGraphic();
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
