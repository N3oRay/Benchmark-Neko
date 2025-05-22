import openfl.display.Sprite;
import openfl.filters.DropShadowFilter;
import openfl.filters.GlowFilter;
import openfl.events.Event;
import openfl.Lib;
import openfl.text.TextField;
import openfl.display.SimpleButton;
import openfl.display.DisplayObject;
import openfl.text.Font;
import openfl.Assets;
import openfl.text.TextFormat;
import openfl.events.MouseEvent;
import Popup;
import openfl.display.Shape;



class ScoreFPS extends Sprite {
    var fpsSamples:Array<Float> = [];
    var measuring:Bool = false;
    var lastFrameTime:Float = 0;
    var fpsText:TextField;
    var startTime:Float = 0;
    var up:DisplayObject;
    private var toggleButton1:SimpleButton;
    private var toggleButton2:SimpleButton;
    private var toggleButton3:SimpleButton;
    private var isVisible:Bool = false;
    private var stateboard:Sprite;

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

        fpsText = new TextField();
        fpsText.defaultTextFormat = new TextFormat("_sans", 10, 0xFFFFFF, true);
        fpsText.width = 400;
        fpsText.height = 80;
        fpsText.x = 440;
        fpsText.y = 50;
        stateboard.addChild(fpsText);

        //Init 
        stateboard.visible = isVisible;
        addChild(stateboard);
        toggleButton1 = makeButton("START", Assets.getFont("assets/fonts/Platinum Sign.ttf"), 220, 5, startMeasure);
        toggleButton2 = makeButton("STOP", Assets.getFont("assets/fonts/Platinum Sign.ttf"), 280, 5, stopMeasure);
        toggleButton3 = makeButton("RAZ", Assets.getFont("assets/fonts/Platinum Sign.ttf"), 340, 5, testFunction);
        // Add click listener
        toggleButton1.addEventListener(MouseEvent.CLICK, toggleGraphic);
        //toggleButton2.addEventListener(MouseEvent.CLICK, toggleGraphic);
        toggleButton3.addEventListener(MouseEvent.CLICK, disableGraphic);

        addChild(toggleButton1);
        addChild(toggleButton2);
        addChild(toggleButton3);

    }

    private function toggleGraphic(e:MouseEvent):Void {
        isVisible = !isVisible;
        stateboard.visible = isVisible;
    }

    private function disableGraphic(e:MouseEvent):Void {
        isVisible = false;
        stateboard.visible = isVisible;
    }

    function drawButtonState(label:String, font:Font, x:Float, y:Float, color:Int):Sprite {

        var state = new Sprite();

        // Draw the button background
        //upState = new DisplayObject();
        var upState = new Shape();
        upState.graphics.beginFill(color); // color
        upState.graphics.drawRoundRect(x, y, 110, 40, 10, 10); // x, y, width, height, ellipseWidth, ellipseHeight
        upState.graphics.endFill();
        state.addChild(upState); // This works because state is a Sprite

        // Add effects: shadow and glow
        this.filters = [
            new DropShadowFilter(4, 45, 0x000000, 0.6, 8, 8, 1, 1),
            new GlowFilter(0xffffff, 0.7, 10, 10, 2, 1)
        ];

        var txt:TextField = new TextField();
        //txt.defaultTextFormat = new TextFormat("_sans", 18, 0xFFFFFF, true);
        txt.defaultTextFormat = new TextFormat(font.fontName, 12, 0x444444);
        txt.text = label;
        txt.width = 110;
        txt.height = 40;
        txt.x = x;
        txt.selectable = false;
        state.addChild(txt);
        
        return state;
    }

    private function makeButton(label:String, font:Font, x:Float, y:Float, onClick:Void->Void):SimpleButton {
        var upState = drawButtonState(label, font, x, y, 0xCCCCCC);
        var overState = drawButtonState(label, font, x, y, 0xAAAAAA);
        var downState = drawButtonState(label, font, x, y, 0x888888);
        var hitTestState = drawButtonState(label, font, x, y, 0xCCCCCC);

        var btn = new SimpleButton(upState, overState, downState, hitTestState);
        btn.x = x;
        btn.y = y;
        btn.addEventListener(MouseEvent.MOUSE_DOWN, function(_) onClick());

        return btn;
    }

    public function startMeasure():Void {
        if (!measuring) {
            // Afficher POPup
            var popup = new Popup(Assets.getFont("assets/fonts/Platinum Sign.ttf"),"BENCHMARK IN PROGRESS. 1 MIN..."); 
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
            var popup = new Popup(Assets.getFont("assets/fonts/Platinum Sign.ttf"),"BENCHMARK STOP..."); 
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
        // Optional: auto stop after 60 seconds
        if (now - startTime >= 60000) stopMeasure();
    }
}
