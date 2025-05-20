package;

import openfl.Lib;
import openfl.display.Stage;
import openfl.display.Sprite;
import openfl.text.Font;
import openfl.text.TextField;
import openfl.text.TextFormat;
import openfl.text.TextFieldAutoSize;
import openfl.events.Event;
import openfl.events.MouseEvent;
import openfl.net.URLRequest;

//*SPLASH*import for the top picture
import openfl.display.Bitmap;
import openfl.display.BitmapData;
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
import openfl.events.ProgressEvent;
import openfl.net.URLRequest;
import openfl.display.PixelSnapping;
import openfl.utils.Timer;


//in the preloader YOU HAVE TO use macro to load images or other assets
// instead of Assets.getXXX()

// please provide this files (or change them) in your assets folder
// and add this line to your project.xml
// <assets path="assets/preloader" include="*" if="web" />
@:font("bin/assets/fonts/Platinum Sign.ttf") class DefaultFont extends Font {}
@:bitmap("bin/assets/preloader/logo.png") class Splash extends BitmapData {}

class Preloader_FF extends Sprite
{
	private var progress_fg:Sprite;
	private var w:Float = 0;
	private var h:Float = 0;
	private var TL_x:Float = 0;
	private var TL_y:Float = 0;

	public function new ()
	{
		super ();

		Assets.loadLibrary ("preloader").onComplete (function (_)
		{
			/*background img*/
			var bmd:BitmapData = null; 
                        #if html5   //without this check you get an error in Flash !
                        bmd = Assets.getBitmapData("preloader:preloader/bg.png");   //PATH !!!!!
                        #end
			if (bmd == null) return;

			var bm = new Bitmap(bmd, PixelSnapping.AUTO, true);
			addChild (bm);
			bm.x = (stage.stageWidth - bm.width) / 2;
			bm.y = (stage.stageHeight - bm.height) / 2;

			/*progress loader : background rect : brown*/
			var progress_bg:Sprite = new Sprite();     //CREATE NEW SPRITE (on top of bg img) !!!
			addChild(progress_bg);
			w = (256 / 800) * stage.stageWidth;
			h = (11 / 600) * stage.stageHeight;
			TL_x = (stage.stageWidth - w) / 2;
			TL_y = (279 / 600) * stage.stageHeight;

			progress_bg.graphics.lineStyle(1, 0xd6d1c3, 1);
			progress_bg.graphics.beginFill (0x2a1d1b);
			progress_bg.graphics.drawRoundRect (TL_x, TL_y, w, h, 8, 4);
			progress_bg.graphics.endFill();

			/*progress loader : foreground rect : white*/
			progress_fg = new Sprite();     //CREATE NEW SPRITE (op top of bg rect) !!!
			addChild(progress_fg);

			addEventListener (ProgressEvent.PROGRESS, this_onProgress);
			addEventListener (Event.COMPLETE, this_onComplete);
		});
	}
	
	private function update (percent:Float):Void
	{
		progress_fg.graphics.clear ();
		progress_fg.graphics.beginFill (0xd6d1c3);
		progress_fg.graphics.drawRoundRect (TL_x, TL_y, w*percent, h, 8, 4);
	}
	
	
/* *************************************************************************************************************************** */
	

	private function this_onProgress (event:ProgressEvent):Void
	{
		if (event.bytesTotal <= 0) update (0);
		else update (event.bytesLoaded / event.bytesTotal);
	}


	private function this_onComplete (event:Event):Void
	{
		update (1);

		/*optional : unload at your own time ; if you comment this out : unload immediately*/
		event.preventDefault ();

        var timer = new haxe.Timer(1000); // 1000ms delay
        timer.run = function(){
			dispatchEvent (new Event (Event.UNLOAD));
		}

	}
}
