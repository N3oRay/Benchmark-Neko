import openfl.display.Sprite;
import openfl.filters.DropShadowFilter;
import openfl.filters.GlowFilter;
import openfl.events.Event;
import openfl.Lib;
import openfl.text.TextField;
import openfl.display.SimpleButton;
//import openfl.display.Shape;
import openfl.display.DisplayObject;
import openfl.text.Font;
import openfl.Assets;
import openfl.text.TextFormat;
import openfl.events.MouseEvent;
import Popup;



class ScoreFPS extends Sprite {
    var fpsSamples:Array<Float> = [];
    var measuring:Bool = false;
    var lastFrameTime:Float = 0;
    var fpsText:TextField;
    var startTime:Float = 0;
    var up:DisplayObject;

    public function new(font:Font) {
        super();

        // Draw the button background
        graphics.beginFill(0x333333); // color
        graphics.drawRoundRect(440, 50, 400, 80, 10, 10); // x, y, width, height, ellipseWidth, ellipseHeight
        graphics.endFill();

        // Add effects: shadow and glow
        this.filters = [
            new DropShadowFilter(4, 45, 0x000000, 0.6, 8, 8, 1, 1),
            new GlowFilter(0xffffff, 0.7, 10, 10, 2, 1)
        ];

        fpsText = new TextField();
        fpsText.defaultTextFormat = new TextFormat("_sans", 10, 0xFFFFFF, true);
        //fpsText.defaultTextFormat = new TextFormat(font.fontName, 12, 0xededed);
        fpsText.width = 400;
        fpsText.height = 80;
        fpsText.x = 440;
        fpsText.y = 50;
        addChild(fpsText);
        up= new DisplayObject();

        addChild(up);
        addChild(makeButton("START", Assets.getFont("assets/fonts/Platinum Sign.ttf"), 0, 5, startMeasure));
        addChild(makeButton("STOP", Assets.getFont("assets/fonts/Platinum Sign.ttf"), 120, 5, stopMeasure));
        addChild(makeButton("RAZ", Assets.getFont("assets/fonts/Platinum Sign.ttf"), 240, 5, testFunction));
    }

    function makeButton(label:String, font:Font, x:Float, y:Float, onClick:Void->Void):SimpleButton {

        // Draw the button background
        graphics.beginFill(0x999999); // color
        graphics.drawRoundRect(440 + x, y, 110, 40, 10, 10); // x, y, width, height, ellipseWidth, ellipseHeight
        graphics.endFill();

        // Add effects: shadow and glow
        this.filters = [
            new DropShadowFilter(4, 45, 0x000000, 0.6, 8, 8, 1, 1),
            new GlowFilter(0xffffff, 0.7, 10, 10, 2, 1)
        ];
       /**
        
      **/

        var txt:TextField = new TextField();
        //txt.defaultTextFormat = new TextFormat("_sans", 18, 0xFFFFFF, true);
        txt.defaultTextFormat = new TextFormat(font.fontName, 12, 0xededed);
        txt.text = label;
        txt.width = 110;
        txt.height = 40;
        txt.x = 440;
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
            // Afficher POPup
            var popup = new Popup(Assets.getFont("assets/fonts/Platinum Sign.ttf"),"BENCHMARK IN PROGRESS."); 
            Lib.current.stage.addChild(popup); 

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
            // Afficher POPup
            var popup = new Popup(Assets.getFont("assets/fonts/Platinum Sign.ttf"),"BENCHMARK STOP."); 
            Lib.current.stage.addChild(popup); 

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
        // Afficher POPup
            var popup = new Popup(Assets.getFont("assets/fonts/Platinum Sign.ttf"),"RAZ"); 
            Lib.current.stage.addChild(popup); 
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
