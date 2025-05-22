import openfl.display.Sprite;
import openfl.events.Event;
import openfl.Lib;
import openfl.text.TextField;
import openfl.display.SimpleButton;
//import openfl.display.Shape;
//import openfl.display.DisplayObject;
import openfl.text.Font;
import openfl.Assets;
import openfl.text.TextFormat;
import openfl.events.MouseEvent;



class ScoreFPS extends Sprite {
    var fpsSamples:Array<Float> = [];
    var measuring:Bool = false;
    var lastFrameTime:Float = 0;
    var fpsText:TextField;
    var startTime:Float = 0;
    //var up:DisplayObject;

    public function new(font:Font) {
        super();
        fpsText = new TextField();
        fpsText.defaultTextFormat = new TextFormat("_sans", 10, 0xFFFFFF, true);
        //fpsText.defaultTextFormat = new TextFormat(font.fontName, 12, 0xededed);
        fpsText.width = 400;
        fpsText.height = 80;
        fpsText.x = 450;
        fpsText.y = 35;
        addChild(fpsText);
        //up= new DisplayObject();
        //addChild(up);
        addChild(makeButton("START", Assets.getFont("assets/fonts/Platinum Sign.ttf"), 10, 5, startMeasure));
        addChild(makeButton("STOP", Assets.getFont("assets/fonts/Platinum Sign.ttf"), 100, 5, stopMeasure));
        addChild(makeButton("RAZ", Assets.getFont("assets/fonts/Platinum Sign.ttf"), 210, 5, testFunction));
    }

    function makeButton(label:String, font:Font, x:Float, y:Float, onClick:Void->Void):SimpleButton {
        /**
        up.graphics.beginFill(0xCCCCCC);
        up.graphics.drawRect(0, 0, 100, 40);
        up.graphics.endFill();
        **/

        var txt:TextField = new TextField();
        //txt.defaultTextFormat = new TextFormat("_sans", 18, 0xFFFFFF, true);
        txt.defaultTextFormat = new TextFormat(font.fontName, 12, 0xededed);
        txt.text = label;
        txt.width = 120;
        txt.height = 40;
        txt.x = 450;
        txt.selectable = false;
        //up.addChild(txt);

        var btn = new SimpleButton(txt, txt, txt, txt);
        btn.x = x;
        btn.y = y;
        btn.addEventListener(MouseEvent.MOUSE_DOWN, function(_) onClick());
        return btn;
    }

    public function startMeasure():Void {
        if (!measuring) {
            measuring = true;
            fpsSamples = [];
            lastFrameTime = Lib.getTimer();
            startTime = Lib.getTimer();
            addEventListener(Event.ENTER_FRAME, onEnterFrame);
            fpsText.text = "Started measuring FPS!";
        }
    }

    public function stopMeasure():Void {
        if (measuring) {
            measuring = false;
            removeEventListener(Event.ENTER_FRAME, onEnterFrame);
            var sumFPS = 0.0;
            for (fps in fpsSamples) sumFPS += fps;
            var avgFPS = fpsSamples.length > 0 ? sumFPS / fpsSamples.length : 0;
            fpsText.text = "Measurement stopped.\nAverage FPS: " + Std.string(avgFPS) +
                           "\n SCORE Sum total FPS: " + Std.string(sumFPS);
        }
    }

    public function testFunction():Void {
        fpsText.text = "";
        // Place your test logic here
    }

    function onEnterFrame(event:Event):Void {
        var now = Lib.getTimer();
        var currentFPS = 1000 / (now - lastFrameTime);
        fpsSamples.push(currentFPS);
        lastFrameTime = now;
        fpsText.text = "Measuring FPS... (" + fpsSamples.length + " frames)";
        // Optional: auto stop after 10 seconds
        if (now - startTime >= 10000) stopMeasure();
    }
}
