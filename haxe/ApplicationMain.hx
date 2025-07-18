import openfl.Assets;


#if (!macro && !display && !waxe)


class ApplicationMain {
	
	
	private static var barA:flash.display.Sprite;
	private static var barB:flash.display.Sprite;
	private static var container:flash.display.Sprite;
	private static var forceHeight:Int;
	private static var forceWidth:Int;
	
	
	public static function main () {
		
		flash.Lib.setPackage ("OpenFL Technologies", "HerokuShaders", "org.openfl.samples.herokushaders", "1.0.0");
		
		
		#if ios
		flash.display.Stage.shouldRotateInterface = function (orientation:Int):Bool {
			return true;
		}
		#end
		
		
		
		flash.Lib.create (function () {
				
				flash.Lib.current.stage.align = flash.display.StageAlign.TOP_LEFT;
				flash.Lib.current.stage.scaleMode = flash.display.StageScaleMode.NO_SCALE;
				flash.Lib.current.loaderInfo = flash.display.LoaderInfo.create (null);
				
				#if mobile
				if (800 != 0 && 600 != 0) {
					
					forceWidth = 800;
					forceHeight = 600;
					
					container = new flash.display.Sprite ();
					barA = new flash.display.Sprite ();
					barB = new flash.display.Sprite ();
					
					flash.Lib.current.stage.addChild (container);
					container.addChild (flash.Lib.current);
					container.addChild (barA);
					container.addChild (barB);
					
					applyScale ();
					flash.Lib.current.stage.addEventListener (flash.events.Event.RESIZE, applyScale);
					
				}
				#end
				
				#if windows
				try {
					
					var currentPath = haxe.io.Path.directory (Sys.executablePath ());
					Sys.setCwd (currentPath);
					
				} catch (e:Dynamic) {}
				#end
				
				var hasMain = false;
				
				for (methodName in Type.getClassFields (Main)) {
					
					if (methodName == "main") {
						
						hasMain = true;
						break;
						
					}
					
				}
					
				if (hasMain) {
					
					Reflect.callMethod (Main, Reflect.field (Main, "main"), []);
					
				} else {
					
					var instance:DocumentClass = Type.createInstance(DocumentClass, []);
					
					if (Std.is (instance, flash.display.DisplayObject)) {
						
						flash.Lib.current.addChild (cast instance);
						
					}
					
				}
				
			},
			800, 600, 
			30, 
			16777215,
			(true ? flash.Lib.HARDWARE : 0) |
			(true ? flash.Lib.ALLOW_SHADERS : 0) |
			(true ? flash.Lib.REQUIRE_SHADERS : 0) |
			(false ? flash.Lib.DEPTH_BUFFER : 0) |
			(false ? flash.Lib.STENCIL_BUFFER : 0) |
			(true ? flash.Lib.RESIZABLE : 0) |
			(false ? flash.Lib.BORDERLESS : 0) |
			(false ? flash.Lib.VSYNC : 0) |
			(false ? flash.Lib.FULLSCREEN : 0) |
			(0 == 4 ? flash.Lib.HW_AA_HIRES : 0) |
			(0 == 2 ? flash.Lib.HW_AA : 0),
			"Heroku Shaders",
			null
			#if mobile, ScaledStage #end
		);
		
	}
	
	
	public static function applyScale (?_) {
		
		var xScale:Float = untyped (flash.Lib.current.stage).stageWidth / forceWidth;
		var yScale:Float = untyped (flash.Lib.current.stage).stageHeight / forceHeight;
		
		if (xScale < yScale) {
			
			flash.Lib.current.scaleX = xScale;
			flash.Lib.current.scaleY = xScale;
			flash.Lib.current.x = (untyped (flash.Lib.current.stage).stageWidth - (forceWidth * xScale)) / 2;
			flash.Lib.current.y = (untyped (flash.Lib.current.stage).stageHeight - (forceHeight * xScale)) / 2;
			
		} else {
			
			flash.Lib.current.scaleX = yScale;
			flash.Lib.current.scaleY = yScale;
			flash.Lib.current.x = (untyped (flash.Lib.current.stage).stageWidth - (forceWidth * yScale)) / 2;
			flash.Lib.current.y = (untyped (flash.Lib.current.stage).stageHeight - (forceHeight * yScale)) / 2;
			
		}
		
		if (flash.Lib.current.x > 0) {
			
			barA.graphics.clear ();
			barA.graphics.beginFill (0x000000);
			barA.graphics.drawRect (0, 0, flash.Lib.current.x, untyped (flash.Lib.current.stage).stageHeight);
			
			barB.graphics.clear ();
			barB.graphics.beginFill (0x000000);
			var x = flash.Lib.current.x + (forceWidth * flash.Lib.current.scaleX);
			barB.graphics.drawRect (x, 0, untyped (flash.Lib.current.stage).stageWidth - x, untyped (flash.Lib.current.stage).stageHeight);
			
		} else {
			
			barA.graphics.clear ();
			barA.graphics.beginFill (0x000000);
			barA.graphics.drawRect (0, 0, untyped (flash.Lib.current.stage).stageWidth, flash.Lib.current.y);
			
			barB.graphics.clear ();
			barB.graphics.beginFill (0x000000);
			var y = flash.Lib.current.y + (forceHeight * flash.Lib.current.scaleY);
			barB.graphics.drawRect (0, y, untyped (flash.Lib.current.stage).stageWidth, untyped (flash.Lib.current.stage).stageHeight - y);
			
		}
		
	}
	
	
	#if neko
	@:noCompletion public static function __init__ () {
		
		untyped $loader.path = $array (haxe.io.Path.directory (Sys.executablePath ()), $loader.path);
		untyped $loader.path = $array ("./", $loader.path);
		untyped $loader.path = $array ("@executable_path/", $loader.path);
		
	}
	#end
	
	
}


@:build(DocumentClass.build())
@:keep class DocumentClass extends Main {}


#if mobile
class ScaledStage extends flash.display.Stage {
	
	
	public var __stageHeight (get, null):Int;
	public var __stageWidth (get, null):Int;
	
	
	public function new (inHandle:Dynamic, inWidth:Int, inHeight:Int) {
		
		super (inHandle, 0, 0);
		
	}
	
	
	private function get___stageHeight ():Int {
		
		return super.get_stageHeight ();
		
	}
	
	
	private function get___stageWidth():Int {
		
		return super.get_stageWidth ();
		
	}
	
	
	private override function get_stageHeight ():Int {
		
		return 600;
	
	}
	
	private override function get_stageWidth ():Int {
		
		return 800;
	
	}
	
	
}
#end


#elseif macro


import haxe.macro.Context;
import haxe.macro.Expr;


class DocumentClass {
	
	
	macro public static function build ():Array<Field> {
		
		var classType = Context.getLocalClass ().get ();
		var searchTypes = classType;
		
		while (searchTypes.superClass != null) {
			
			if (searchTypes.pack.length == 2 && searchTypes.pack[1] == "display" && searchTypes.name == "DisplayObject") {
				
				var fields = Context.getBuildFields ();
				var method = macro { return flash.Lib.current.stage; }
				
				fields.push ({ name: "get_stage", access: [ APrivate, AOverride ], kind: FFun({ args: [], expr: method, params: [], ret: macro :flash.display.Stage }), pos: Context.currentPos () });
				return fields;
				
			}
			
			searchTypes = searchTypes.superClass.t.get ();
			
		}
		
		return null;
		
	}
	
	
}


#elseif waxe


class ApplicationMain {
	
	
	public static var autoShowFrame:Bool = true;
	public static var frame:wx.Frame;
	#if openfl
	static public var nmeStage:wx.NMEStage;
	#end
	
	
	public static function main () {
		
		#if openfl
		flash.Lib.setPackage ("OpenFL Technologies", "HerokuShaders", "org.openfl.samples.herokushaders", "1.0.0");
		
		#end
		
		wx.App.boot (function () {
			
			
			frame = wx.Frame.create (null, null, "Heroku Shaders", null, { width: 800, height: 600 });
			
			
			#if openfl
			var stage = wx.NMEStage.create (frame, null, null, { width: 800, height: 600 });
			#end
			
			var hasMain = false;
			for (methodName in Type.getClassFields (Main)) {
				if (methodName == "main") {
					hasMain = true;
					break;
				}
			}
			
			if (hasMain) {
				Reflect.callMethod (Main, Reflect.field (Main, "main"), []);
			}else {
				var instance = Type.createInstance (Main, []);
			}
			
			if (autoShowFrame) {
				wx.App.setTopWindow (frame);
				frame.shown = true;
			}
			
		});
		
	}
	
	#if neko
	@:noCompletion public static function __init__ () {
		
		untyped $loader.path = $array (haxe.io.Path.directory (Sys.executablePath ()), $loader.path);
		untyped $loader.path = $array ("./", $loader.path);
		untyped $loader.path = $array ("@executable_path/", $loader.path);
		
	}
	#end
	
	
}


#else


import Main;

class ApplicationMain {
	
	
	public static function main () {
		
		
		
	}
	
	
}


#end