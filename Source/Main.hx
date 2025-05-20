package;

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
#if (lime >= "7.0.0")
import lime.graphics.WebGLRenderContext;
#else
import lime.graphics.opengl.WebGLContext in WebGLRenderContext;
#end

	/**

  ("assets/1.frag", _ 1_frag);
		type.set ("assets/1.frag",  
		  ("assets/10.frag", _ 10_frag);
		type.set ("assets/10.frag",  
		  ("assets/11.frag", _ 11_frag);
		type.set ("assets/11.frag",  
		  ("assets/12.frag", _ 12_frag);
		type.set ("assets/12.frag",  
		  ("assets/12288.0.frag", _ 12288_0_frag);
		type.set ("assets/12288.0.frag",  
		  ("assets/12290.0.frag", _ 12290_0_frag);
		type.set ("assets/12290.0.frag",  
		  ("assets/12293.0.frag", _ 12293_0_frag);
		type.set ("assets/12293.0.frag",  
		  ("assets/12294.0.frag", _ 12294_0_frag);
		type.set ("assets/12294.0.frag",  
		  ("assets/12297.0.frag", _ 12297_0_frag);
		type.set ("assets/12297.0.frag",  
		  ("assets/12326.0.frag", _ 12326_0_frag);
		type.set ("assets/12326.0.frag",  
		  ("assets/12366.0.frag", _ 12366_0_frag);
		type.set ("assets/12366.0.frag",  
		  ("assets/12441.0.frag", _ 12441_0_frag);
		type.set ("assets/12441.0.frag",  
		  ("assets/12469.1.frag", _ 12469_1_frag);
		type.set ("assets/12469.1.frag",  
		  ("assets/12470.1.frag", _ 12470_1_frag);
		type.set ("assets/12470.1.frag",  
		  ("assets/12471.0.frag", _ 12471_0_frag);
		type.set ("assets/12471.0.frag",  
		  ("assets/12473.0.frag", _ 12473_0_frag);
		type.set ("assets/12473.0.frag",  
		  ("assets/12476.2.frag", _ 12476_2_frag);
		type.set ("assets/12476.2.frag",  
		  ("assets/13.frag", _ 13_frag);
		type.set ("assets/13.frag",  
		  ("assets/14.frag", _ 14_frag);
		type.set ("assets/14.frag",  
		  ("assets/15.frag", _ 15_frag);
		type.set ("assets/15.frag",  
		  ("assets/16.frag", _ 16_frag);
		type.set ("assets/16.frag",  
		  ("assets/17.frag", _ 17_frag);
		type.set ("assets/17.frag",  
		  ("assets/18.frag", _ 18_frag);
		type.set ("assets/18.frag",  
		  ("assets/19.frag", _ 19_frag);
		type.set ("assets/19.frag",  
		  ("assets/2.frag", _ 2_frag);
		type.set ("assets/2.frag",  
		  ("assets/20.frag", _ 20_frag);
		type.set ("assets/20.frag",  
		  ("assets/21.frag", _ 21_frag);
		type.set ("assets/21.frag",  
		  ("assets/22.frag", _ 22_frag);
		type.set ("assets/22.frag",  
		  ("assets/23.frag", _ 23_frag);
		type.set ("assets/23.frag",  
		  ("assets/24.frag", _ 24_frag);
		type.set ("assets/24.frag",  
		  ("assets/25.frag", _ 25_frag);
		type.set ("assets/25.frag",  
		  ("assets/26.frag", _ 26_frag);
		type.set ("assets/26.frag",  
		  ("assets/27.frag", _ 27_frag);
		type.set ("assets/27.frag",  
		  ("assets/28.frag", _ 28_frag);
		type.set ("assets/28.frag",  
		  ("assets/29.frag", _ 29_frag);
		type.set ("assets/29.frag",  
		  ("assets/3.frag", _ 3_frag);
		type.set ("assets/3.frag",  
		  ("assets/30.frag", _ 30_frag);
		type.set ("assets/30.frag",  
		  ("assets/31.frag", _ 31_frag);
		type.set ("assets/31.frag",  
		  ("assets/32.frag", _ 32_frag);
		type.set ("assets/32.frag",  
		  ("assets/33.frag", _ 33_frag);
		type.set ("assets/33.frag",  
		  ("assets/34.frag", _ 34_frag);
		type.set ("assets/34.frag",  
		  ("assets/35.frag", _ 35_frag);
		type.set ("assets/35.frag",  
		  ("assets/36.frag", _ 36_frag);
		type.set ("assets/36.frag",  
		  ("assets/37.frag", _ 37_frag);
		type.set ("assets/37.frag",  
		  ("assets/38.frag", _ 38_frag);
		type.set ("assets/38.frag",  
		  ("assets/39.frag", _ 39_frag);
		type.set ("assets/39.frag",  
		  ("assets/40.frag", _ 40_frag);
		type.set ("assets/40.frag",  
		  ("assets/41.frag", _ 41_frag);
		type.set ("assets/41.frag",  
		  ("assets/42.frag", _ 42_frag);
		type.set ("assets/42.frag",  
		  ("assets/4278.1.frag", _ 4278_1_frag);
		type.set ("assets/4278.1.frag",  
		  ("assets/43.frag", _ 43_frag);
		type.set ("assets/43.frag",  
		  ("assets/44.frag", _ 44_frag);
		type.set ("assets/44.frag",  
		  ("assets/45.frag", _ 45_frag);
		type.set ("assets/45.frag",  
		  ("assets/46.frag", _ 46_frag);
		type.set ("assets/46.frag",  
		  ("assets/47.frag", _ 47_frag);
		type.set ("assets/47.frag",  
		  ("assets/48.frag", _ 48_frag);
		type.set ("assets/48.frag",  
		  ("assets/49.frag", _ 49_frag);
		type.set ("assets/49.frag",  
		  ("assets/5.frag", _ 5_frag);
		type.set ("assets/5.frag",  
		  ("assets/50.frag", _ 50_frag);
		type.set ("assets/50.frag",  
		  ("assets/51.frag", _ 51_frag);
		type.set ("assets/51.frag",  
		  ("assets/5359.8.frag", _ 5359_8_frag);
		type.set ("assets/5359.8.frag",  
		  ("assets/5398.8.frag", _ 5398_8_frag);
		type.set ("assets/5398.8.frag",  
		  ("assets/5454.21.frag", _ 5454_21_frag);
		type.set ("assets/5454.21.frag",  
		  ("assets/5492.frag", _ 5492_frag);
		type.set ("assets/5492.frag",  
		  ("assets/5733.frag", _ 5733_frag);
		type.set ("assets/5733.frag",  
		  ("assets/5805.18.frag", _ 5805_18_frag);
		type.set ("assets/5805.18.frag",  
		  ("assets/5812.frag", _ 5812_frag);
		type.set ("assets/5812.frag",  
		  ("assets/5891.5.frag", _ 5891_5_frag);
		type.set ("assets/5891.5.frag",  
		  ("assets/5986.0.frag", _ 5986_0_frag);
		type.set ("assets/5986.0.frag",  
		  ("assets/6.frag", _ 6_frag);
		type.set ("assets/6.frag",  
		  ("assets/6022.frag", _ 6022_frag);
		type.set ("assets/6022.frag",  
		  ("assets/6043.1.frag", _ 6043_1_frag);
		type.set ("assets/6043.1.frag",  
		  ("assets/6049.frag", _ 6049_frag);
		type.set ("assets/6049.frag",  
		  ("assets/6138.4.frag", _ 6138_4_frag);
		type.set ("assets/6138.4.frag",  
		  ("assets/6147.1.frag", _ 6147_1_frag);
		type.set ("assets/6147.1.frag",  
		  ("assets/6162.frag", _ 6162_frag);
		type.set ("assets/6162.frag",  
		  ("assets/6175.frag", _ 6175_frag);
		type.set ("assets/6175.frag",  
		  ("assets/6223.2.frag", _ 6223_2_frag);
		type.set ("assets/6223.2.frag",  
		  ("assets/6238.frag", _ 6238_frag);
		type.set ("assets/6238.frag",  
		  ("assets/6284.1.frag", _ 6284_1_frag);
		type.set ("assets/6284.1.frag",  
		  ("assets/6286.frag", _ 6286_frag);
		type.set ("assets/6286.frag",  
		  ("assets/6288.1.frag", _ 6288_1_frag);
		type.set ("assets/6288.1.frag",  
		  ("assets/7.frag", _ 7_frag);
		type.set ("assets/7.frag",  
		  ("assets/9.frag", _ 9_frag);
		type.set ("assets/9.frag",  
		  ("assets/heroku.vert", 
**/
class Main extends Sprite
{
	private static var glFragmentShaders = [
		#if mobile
		"1", "10", "11", "12", "12288.0", "12290.0", "12293.0", "12294.0", "12297.0", "12326.0", "12366.0", "12441.0", 
		"12469.1", "12470.1", "12471.0", "12473.0", "12476.2", "13", "14", "15", "16", "17", "18", "19", "2", "20", "21", 
		"22", "23", "24", "25", "26", "27", "28", "29", "3", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", 
		"40", "41", "42", "4278.1", "43", "44", "45", "46", "47", "48", "49", "5", "50", "51", "5359.8", "5398.8", "5454.21", 
		"5492", "5733", "5805.18", "5812", "5891.5", "5986.0", "6", "6022", "6043.1", "6049", "6138.4", "6147.1", "6162", 
		"6175", "6223.2", "6238", "6284.1", "6286", "6288.1", "7", "9"
		#else
		"1", "10", "11", "12", "12288.0", "12290.0", "12293.0", "12294.0", "12297.0", "12326.0", "12366.0", "12441.0", 
		"12469.1", "12470.1", "12471.0", "12473.0", "12476.2", "13", "14", "15", "16", "17", "18", "19", "2", "20", "21", 
		"22", "23", "24", "25", "26", "27", "28", "29", "3", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", 
		"40", "41", "42", "4278.1", "43", "44", "45", "46", "47", "48", "49", "5", "50", "51", "5359.8", "5398.8", "5454.21", 
		"5492", "5733", "5805.18", "5812", "5891.5", "5986.0", "6", "6022", "6043.1", "6049", "6138.4", "6147.1", "6162", 
		"6175", "6223.2", "6238", "6284.1", "6286", "6288.1", "7", "9"
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

	public function new()
	{
		super();

		glFragmentShaders = randomizeArray(glFragmentShaders);
		currentIndex = 0;

		addEventListener(RenderEvent.RENDER_OPENGL, render);
		addEventListener(Event.ENTER_FRAME, enterFrame);
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
		gl
			.uniform2f(glMouseUniform, 0.1, 0.1); // gl.uniform2f (glMouseUniform, (stage.mouseX / stage.stageWidth) * 2 - 1, (stage.mouseY / stage.stageHeight) * 2 - 1);
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
}
