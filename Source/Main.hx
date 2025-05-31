package;

import lime.app.Application;
import lime.ui.Window;
import lime.graphics.RenderContext;
import lime.graphics.opengl.GLBuffer;
import lime.graphics.opengl.GLProgram;
import lime.graphics.opengl.GLShader;
import lime.graphics.opengl.GLUniformLocation;
import lime.utils.Float32Array;
import openfl.display.OpenGLRenderer;
import openfl.display.Sprite;
import openfl.events.Event;
import openfl.events.RenderEvent;
import openfl.geom.Matrix3D;
import openfl.geom.Rectangle;
import openfl.utils.ByteArray;
import openfl.Assets;
import openfl.Lib;
import openfl.text.TextField;
import openfl.display.Bitmap;
import openfl.display.BitmapData;
import openfl.display.Loader;
import openfl.display.Sprite;
import openfl.display.Stage;
import openfl.display.Tilemap;
import openfl.display.Tileset;
import openfl.events.Event;
import openfl.events.MouseEvent;
import openfl.net.URLRequest;
import openfl.display.Shape;

import Performance;
import Preloader_FF;
import Popup;
import MenuContext;
import ScoreFPS;
import ScoreFPS1;
import GPUSpecs;
import Gear;

/**
 * Main.hx
 * Haxe/OpenFL class PopUP
 *
 * More informations here
 * https://github.com/N3oRay/
 *
 * @author Serge LOPES
 * @licence MIT
 *
 */

#if (lime >= "7.0.0")
import lime.graphics.WebGLRenderContext;
#else
import lime.graphics.opengl.WebGLContext in WebGLRenderContext;
#end

	
class Main extends Sprite
{

    //private var glfwSwapInterval(0); // test unlimit GPU
	private static var glFragmentShaders = [
		#if mobile
		"intro", "sonic", "knuckles", "kurby", "Hellokitty", "stars", "nuage", "vector", "cars", "cars2", "ring", "10.2", "10", "6286", "5733", "5", "50", "04", "36", "00", "18", "12293.0", "01", "02", "03", "1", "11", "12", "12288.0", "12290.0", "12294.0", "12297.0", 
        "12326.0", "12366.0", "12441.0", "12469.1", "12470.1", "12471.0", "12473.0", "12476.2", "13", "14", "15", "16", "17", "19", "2", "20", "21", 
		"22", "23", "24", "25", "26", "27", "28", "29", "3", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", 
		"40", "41", "42", "4278.1", "43", "44", "09", "45", "46", "47", "48", "51", "5359.8", "5398.8", "5454.21", 
		"5492", "5805.18", "5812", "5891.5", "5986.0", "6", "6022", "6043.1", "6049", "6138.4", "6147.1", "6162", 
		"6175", "6223.2", "6238", "6284.1", "6288.1", "7", "9", "49", "10.4", "10.3", "08", "10.1", "dragoon2", "n3oray", "snowman", "snowman2", "dragoon"
		#else
		"intro", "sonic", "knuckles", "kurby", "Hellokitty", "stars", "nuage", "vector", "cars", "cars2", "ring", "10.2", "10", "6286", "5733", "5", "50", "04", "36", "00", "18", "12293.0", "01", "02", "03", "1", "11", "12", "12288.0", "12290.0", "12294.0", "12297.0", 
        "12326.0", "12366.0", "12441.0", "12469.1", "12470.1", "12471.0", "12473.0", "12476.2", "13", "14", "15", "16", "17", "19", "2", "20", "21", 
		"22", "23", "24", "25", "26", "27", "28", "29", "3", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", 
		"40", "41", "42", "4278.1", "43", "44", "09", "45", "46", "47", "48", "51", "5359.8", "5398.8", "5454.21", 
		"5492", "5805.18", "5812", "5891.5", "5986.0", "6", "6022", "6043.1", "6049", "6138.4", "6147.1", "6162", 
		"6175", "6223.2", "6238", "6284.1", "6288.1", "7", "9", "49", "10.4", "10.3", "08", "10.1", "dragoon2", "n3oray", "snowman", "snowman2", "dragoon"
		#end
	];
	private static var maxTime = 7000;

	private var currentIndex:Int;
	private var glBackbufferUniform:GLUniformLocation;
	private var glBuffer:GLBuffer;
	private var glCurrentProgram:GLProgram;
	private var glMouseUniform:GLUniformLocation;
	private var glPositionAttribute:Int;
	private var glResolutionUniform:GLUniformLocation;
	private var glSurfaceSizeUniform:GLUniformLocation;
	private var glTimeUniform:GLUniformLocation;
	private var glVertexPosition:Int;
	private var initialized:Bool;
	private var startTime:Int;
    private var perf:Performance;


	public function new()
	{
		super();


        // Afficher Preload
        var preload = new Preloader_FF(); 
        Lib.current.stage.addChild(preload); 

      
        // Random fonction
		//glFragmentShaders = randomizeArray(glFragmentShaders);

		currentIndex = 0;

		addEventListener(RenderEvent.RENDER_OPENGL, render);
		addEventListener(Event.ENTER_FRAME, enterFrame);


        // Affichier Performance:
        var performance = new Performance(Assets.getFont("assets/fonts/Platinum Sign.ttf"),        //any font you want
                                      Assets.getBitmapData("assets/preloader/logo.png"), //null or any BitmapData (suggested 50x50pixels)
                                      true,  // true if you want to see the APP information
                                      true); // true if you want to see the FPS Graph
        Lib.current.stage.addChild(performance);  

        // Score menu / GPSSPEC init
        var scorefps = new ScoreFPS(Assets.getFont("assets/fonts/Platinum Sign.ttf"));
        Lib.current.stage.addChild(scorefps);     
        
        

        // Affichier Menu:
        /**
        var menu = new MenuContext([
  
            { label: "Play", action: function() {
                trace("Play BenchMark option selected!");
                // Afficher POPup
                var popup = new Popup(Assets.getFont("assets/fonts/Platinum Sign.ttf"),"BENCHMARK IN PROGRESS."); 
                Lib.current.stage.addChild(popup); 

                var score1fps = new ScoreFPS1(Assets.getFont("assets/fonts/Platinum Sign.ttf"));
                Lib.current.stage.addChild(score1fps); 
            }}, 
            { label: "GPU Spec", action: function() {
                trace("GPU Spec option selected!");

                //var pGear = new Gear();
                //Lib.current.stage.addChild(pGear); 
                 // Afficher POPup
                var popup = new Popup(Assets.getFont("assets/fonts/Platinum Sign.ttf"),"LOAD SYSTEMS."); 
                Lib.current.stage.addChild(popup); 

                var gpuspecs = new GPUSpecs(Assets.getFont("assets/fonts/Platinum Sign.ttf"));
                Lib.current.stage.addChild(gpuspecs); 
            }}, 
            { label: "Exit", action: function() {
                trace("Exit option selected!");

                exit(); 
            }}
        ]);
        Lib.current.stage.addChild(menu);

        **/


	}

	private function enterFrame(event:Event):Void
	{
		#if !flash
		invalidate();
		#end
	}

	private function glCompile(gl:WebGLRenderContext):Void
	{
		var program = gl.createProgram();
		var vertex = Assets.getText("assets/heroku.vert");

		#if desktop
		var fragment = "";
		#else
		var fragment = "precision mediump float;";
		#end

        trace("LOAD assets/" + glFragmentShaders[currentIndex] + ".frag");
		fragment += Assets.getText("assets/" + glFragmentShaders[currentIndex] + ".frag");

		var vs = glCreateShader(gl, vertex, gl.VERTEX_SHADER);
		var fs = glCreateShader(gl, fragment, gl.FRAGMENT_SHADER);

		if (vs == null || fs == null) return;

		gl.attachShader(program, vs);
		gl.attachShader(program, fs);

		gl.deleteShader(vs);
		gl.deleteShader(fs);

		gl.linkProgram(program);

		if (gl.getProgramParameter(program, gl.LINK_STATUS) == 0)
		{
			trace(gl.getProgramInfoLog(program));
			trace("VALIDATE_STATUS: " + gl.getProgramParameter(program, gl.VALIDATE_STATUS));
			trace("ERROR: " + gl.getError());
			return;
		}

		if (glCurrentProgram != null)
		{
			if (glPositionAttribute > -1) gl.disableVertexAttribArray(glPositionAttribute);
			gl.disableVertexAttribArray(glVertexPosition);
			gl.deleteProgram(glCurrentProgram);
		}

		glCurrentProgram = program;

		glPositionAttribute = gl.getAttribLocation(glCurrentProgram, "surfacePosAttrib");
		if (glPositionAttribute > -1) gl.enableVertexAttribArray(glPositionAttribute);

		glVertexPosition = gl.getAttribLocation(glCurrentProgram, "position");
		gl.enableVertexAttribArray(glVertexPosition);
		glTimeUniform = gl.getUniformLocation(program, "time");
		glMouseUniform = gl.getUniformLocation(program, "mouse");
		glResolutionUniform = gl.getUniformLocation(program, "resolution");
		glBackbufferUniform = gl.getUniformLocation(program, "backglBuffer");
		glSurfaceSizeUniform = gl.getUniformLocation(program, "surfaceSize");

		startTime = Lib.getTimer();
	}

	private function glCreateShader(gl:WebGLRenderContext, source:String, type:Int):GLShader
	{
		var shader = gl.createShader(type);
		gl.shaderSource(shader, source);
		gl.compileShader(shader);

		if (gl.getShaderParameter(shader, gl.COMPILE_STATUS) == 0)
		{
			trace(gl.getShaderInfoLog(shader));
			return null;
		}

		return shader;
	}

	private function glInitialize(gl:WebGLRenderContext):Void
	{
		if (!initialized)
		{
			glBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, glBuffer);
			var glBufferArray = new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0]);
			var size = Float32Array.BYTES_PER_ELEMENT * glBufferArray.length;
			gl.bufferData(gl.ARRAY_BUFFER, glBufferArray, gl.STATIC_DRAW);
			gl.bindBuffer(gl.ARRAY_BUFFER, null);

			glCompile(gl);

			initialized = true;
		}
	}

	private function randomizeArray<T>(array:Array<T>):Array<T>
	{
		var arrayCopy = array.copy();
		var randomArray = new Array<T>();

		while (arrayCopy.length > 0)
		{
			var randomIndex = Math.round(Math.random() * (arrayCopy.length - 1));
			randomArray.push(arrayCopy.splice(randomIndex, 1)[0]);
		}

		return randomArray;
	}



	private function render(event:RenderEvent):Void
	{
		var renderer:OpenGLRenderer = cast event.renderer;
		renderer.setShader(null);

		var gl:WebGLRenderContext = renderer.gl;

		glInitialize(gl);

		if (glCurrentProgram == null) return;

		var time = Lib.getTimer() - startTime;

		gl.useProgram(glCurrentProgram);

		gl.uniform1f(glTimeUniform, time / 1000);
		gl.uniform2f(glMouseUniform, 0.1, 0.1); // gl.uniform2f (glMouseUniform, (stage.mouseX / stage.stageWidth) * 2 - 1, (stage.mouseY / stage.stageHeight) * 2 - 1);
		gl.uniform2f(glResolutionUniform, stage.stageWidth, stage.stageHeight);
		gl.uniform1i(glBackbufferUniform, 0);
		gl.uniform2f(glSurfaceSizeUniform, stage.stageWidth, stage.stageHeight);

		gl.bindBuffer(gl.ARRAY_BUFFER, glBuffer);
		if (glPositionAttribute > -1) gl.vertexAttribPointer(glPositionAttribute, 2, gl.FLOAT, false, 0, 0);
		gl.vertexAttribPointer(glVertexPosition, 2, gl.FLOAT, false, 0, 0);

		gl.clearColor(0, 0, 0, 1);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.drawArrays(gl.TRIANGLES, 0, 6);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);

		if (time > maxTime && glFragmentShaders.length > 1)
		{
			currentIndex++;

			if (currentIndex > glFragmentShaders.length - 1)
			{
				currentIndex = 0;
			}

			glCompile(gl);
		}
           
    
	}

    function exit() {
        #if (windows || cpp)
            Sys.exit(0);
        #else
            openfl.system.System.exit(0);
        #end                
    }

}
