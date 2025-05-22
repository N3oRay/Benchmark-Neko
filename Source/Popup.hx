package;
import haxe.Timer;
import openfl.display.FPS;
import openfl.display.Sprite;
import openfl.display.Shape;
import openfl.display.BitmapData;
import openfl.display.Bitmap;
import openfl.geom.Rectangle;
import openfl.events.Event;
import openfl.system.System;
import openfl.text.TextField;
import openfl.text.Font;
import openfl.text.TextFormat;
import openfl.Assets;
import openfl.Lib;


/**
 * Popup.hx
 * Haxe/OpenFL class PopUP
 *
 * More informations here
 * https://github.com/N3oRay/
 *
 * @author Serge LOPES
 * @licence MIT
 *
 */

class Popup extends Sprite
{
    private var ptext:TextField; 
    private var performanceText:TextField;
    private var appText:TextField;

    private var skipped = 0;
    private var skip = 360;
	private var times:Array<Float>;

       

	public function new(font:Font, label:String) 
	{
		super();

    ptext= new TextField();
    ptext.defaultTextFormat = new TextFormat(font.fontName, 20, 0x202020);
    ptext.x = 0;
    ptext.y = 150;
    ptext.selectable = false;
    ptext.width = 800;
    ptext.text = label; //"BENCHMARK IN PROGRESS."
    addChild (ptext);


    //this.addEventListener(Event.ENTER_FRAME, loop);

    Lib.current.stage.addEventListener(Event.ENTER_FRAME, onLoop);

		
	}

	private function onLoop(_):Void
	{	
        ptext.x += 4;
        
        if (ptext.x == 800){
        ptext.x = 0;
        }

        if (skipped == skip) {
            ptext.text = "FINISH";
            removeChild (ptext);
        }
        skipped++;
	}

	
}
