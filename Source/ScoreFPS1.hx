import openfl.display.Sprite;
import openfl.events.Event;
import openfl.Lib;
import openfl.text.TextField;
import openfl.text.Font;
import openfl.text.TextFormat;
import openfl.geom.ColorTransform;

/**

L'application attend 10s (10 1 000 ms) avant de commencer la mesure des FPS.
Les FPS sont ensuite échantillonnés à chaque image pendant 10 secondes (durée réglable).
Une fois la mesure terminée, l'application affiche la moyenne des FPS.

Vous pouvez ajuster la durée de la mesure et les conditions d'arrêt selon vos besoins (par exemple, arrêt sur pression de touche, exécution jusqu'à la fermeture de la fenêtre, etc.).

N'hésitez pas à me contacter si vous souhaitez une version qui s'arrête sur pression de touche ou avec une logique différente !
**/

import openfl.display.Sprite;
import openfl.events.Event;
import openfl.Lib;
import openfl.Assets;
import openfl.text.TextField;

class ScoreFPS1 extends Sprite {
    var startTime:Float;
    var measuring:Bool = false;
    var fpsSamples:Array<Float> = [];
    var lastFrameTime:Float = 0;
    var fpsText:TextField;

    public function new(font:Font) {
        super();
        startTime = Lib.getTimer();
        fpsText = new TextField();
        // var fpsText:CustomTextField = new CustomTextField();
        //fpsText.defaultTextFormat = new TextFormat(font.fontName, 12, 0xededed);
        fpsText.defaultTextFormat = new TextFormat("_sans", 10, 0xFFFFFF, true);
        //fpsText.textColor = 0xffffff;
        //fpsText.highlightColor = 0xffffff;
        fpsText.y = 350;
        fpsText.width = 400;
        fpsText.height = 60;
        addChild(fpsText);
        addEventListener(Event.ENTER_FRAME, onEnterFrame);
    }

    function onEnterFrame(event:Event):Void {
        var now:Float = Lib.getTimer();
        var elapsed:Float = now - startTime;

        if (!measuring && elapsed > 10 * 1000) { // <-- 10 seconds
            // Start measuring after 10 seconds
            measuring = true;
            fpsSamples = [];
            lastFrameTime = now;
            fpsText.text = "Started measuring FPS!";
        } else if (measuring) {
            // Calculate FPS for this frame
            var currentFPS = 1000 / (now - lastFrameTime);
            fpsSamples.push(currentFPS);
            lastFrameTime = now;

            // Example: Stop measuring after 10 seconds
            if (fpsSamples.length >= 10 * 60) { // 10 seconds at 60 FPS
                measuring = false;
                var sumFPS = 0.0;
                for (fps in fpsSamples) sumFPS += fps;
                var avgFPS = sumFPS / fpsSamples.length;
                fpsText.text = "Average FPS over 10 seconds: " + Std.string(avgFPS) +
                               "\nSum total FPS: " + Std.string(sumFPS);
                removeEventListener(Event.ENTER_FRAME, onEnterFrame);
            } else {
                fpsText.text = "Measuring FPS... (" + fpsSamples.length + " frames)";
            }
        } else {
            fpsText.text = "Waiting... " + Std.int((10 * 1000 - elapsed) / 1000) + "s until measure";
        }
    }
}


