import openfl.display.Sprite;
import openfl.events.Event;
import openfl.Lib;
import openfl.text.TextField;
import openfl.display.SimpleButton;
import openfl.display.Shape;
import openfl.text.TextFormat;

class ScoreFPS extends Sprite {
    var fpsSamples:Array<Float> = [];
    var measuring:Bool = false;
    var lastFrameTime:Float = 0;
    var fpsText:TextField;
    var startTime:Float = 0;

    public function new() {
        super();
        fpsText = new TextField();
        fpsText.width = 400;
        fpsText.height = 80;
        fpsText.y = 80;
        addChild(fpsText);

        addChild(makeButton("Start", 10, 10, startMeasure));
        addChild(makeButton("Stop", 120, 10, stopMeasure));
        addChild(makeButton("Test", 230, 10, testFunction));
    }

    function makeButton(label:String, x:Float, y:Float, onClick:Void->Void):SimpleButton {
        var up:Shape = new Shape();
        up.graphics.beginFill(0xCCCCCC);
        up.graphics.drawRect(0, 0, 100, 40);
        up.graphics.endFill();

        var txt:TextField = new TextField();
        txt.defaultTextFormat = new TextFormat("_sans", 18, 0x000000, true);
        txt.text = label;
        txt.width = 100;
        txt.height = 40;
        txt.selectable = false;
        up.addChild(txt);

        var btn = new SimpleButton(up, up, up, up);
        btn.x = x;
        btn.y = y;
        btn.addEventListener(Event.CLICK, function(_) onClick());
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
                           "\nSum total FPS: " + Std.string(sumFPS);
        }
    }

    public function testFunction():Void {
        fpsText.text = "Test button clicked!";
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