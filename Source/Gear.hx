package;

/**
@author N3ORAY 
**/

import openfl.display.Sprite;
import openfl.display.Shape;
import openfl.display.BitmapData;
import openfl.display.Bitmap;
import openfl.display.Loader;
import openfl.events.Event;
import openfl.geom.Matrix;
import openfl.utils.AssetLibrary;
import motion.Actuate;
import openfl.display.GradientType;
import openfl.geom.ColorTransform;

class Gear extends Sprite {
    private var gear:Sprite;
    private var maskShape:Shape;
    private var progress:Float = 0;
    private var rotationSpeed:Float = 0;
    private var gearBitmap:Bitmap;

    public function new() {
        super();

        // Load SVG gear asset
        #if (openfl_html5 || openfl_native)
        var loader = new Loader();
        loader.contentLoaderInfo.addEventListener(Event.COMPLETE, onGearLoaded);
        loader.load(new openfl.net.URLRequest("assets/gear.svg"));
        #else
        // Fallback: draw a gear with code
        createGear();
        #end

        // Mask for progress
        maskShape = new Shape();
        addChild(maskShape);

        // Animate progress 0 -> 100%
        animateProgress();
        addEventListener(Event.ENTER_FRAME, onEnterFrame);
    }

    #if (openfl_html5 || openfl_native)
    private function onGearLoaded(e:Event):Void {
        gear = new Sprite();
        gear.addChild(cast e.currentTarget.content);
        gear.x = 200;
        gear.y = 200;
        gear.scaleX = gear.scaleY = 2.0;
        addChild(gear);
        gear.mask = maskShape;
    }
    #else
    private function createGear() {
        gear = new Sprite();
        var g = gear.graphics;
        drawAdvancedGear(g, 0, 0, 90, 60, 12, 8);
        gear.x = 200;
        gear.y = 200;
        addChild(gear);
        gear.mask = maskShape;
    }
    #end

    private function animateProgress() {
        Actuate.tween(this, 3, { progress: 1 }).ease(motion.easing.Quad.easeInOut)
            .onUpdate(() -> { rotationSpeed = 10 + 30 * progress; })
            .onComplete(() -> { rotationSpeed = 0; });
    }

    private function onEnterFrame(e:Event):Void {
        if (gear != null) {
            gear.rotation += rotationSpeed * (1 + progress);
        }
        drawProgressMask(progress);
    }

    // Advanced gear drawing: inner/outer teeth, gradients, etc.
    private function drawAdvancedGear(g:openfl.display.Graphics, cx:Float, cy:Float, outerR:Float, innerR:Float, teeth:Int, holes:Int) {
        // Gradient
        var matrix = new Matrix();
        matrix.createGradientBox(outerR*2, outerR*2, 0, cx-outerR, cy-outerR);
        g.beginGradientFill(GradientType.RADIAL, [0xCCCCFF, 0x444488], [1, 1], [0, 255], matrix);

        var angleStep = Math.PI * 2 / teeth;
        for (i in 0...teeth) {
            var angle = i * angleStep;
            var r = (i % 2 == 0) ? outerR : innerR;
            var px = cx + Math.cos(angle) * r;
            var py = cy + Math.sin(angle) * r;
            if (i == 0) g.moveTo(px, py);
            g.lineTo(px, py);
        }
        g.endFill();

        // Holes
        g.beginFill(0x222244);
        for (i in 0...holes) {
            var angle = (i / holes) * Math.PI * 2;
            g.drawCircle(cx + Math.cos(angle) * (outerR*0.6), cy + Math.sin(angle) * (outerR*0.6), outerR*0.09);
        }
        g.endFill();

        // Center
        g.beginFill(0x6666AA);
        g.drawCircle(cx, cy, outerR*0.35);
        g.endFill();

        // Glow
        g.lineStyle(6, 0x77BBFF, 0.2);
        g.drawCircle(cx, cy, outerR*0.97);
        g.lineStyle();
    }

    // Pie mask for progress (with smooth edge)
    private function drawProgressMask(prog:Float) {
        var cx = 200, cy = 200, r = 92;
        maskShape.graphics.clear();
        maskShape.graphics.beginFill(0xFFFFFF, 0.9);
        maskShape.graphics.moveTo(cx, cy);
        var endAngle = -Math.PI / 2 + prog * 2 * Math.PI;
        var steps = Math.ceil(60 * prog) + 2;
        for (i in 0...steps) {
            var angle = -Math.PI / 2 + (i / (steps-1)) * prog * 2 * Math.PI;
            maskShape.graphics.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
        }
        maskShape.graphics.lineTo(cx, cy);
        maskShape.graphics.endFill();
    }
}
