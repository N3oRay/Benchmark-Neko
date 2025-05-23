import openfl.display.Sprite;
import openfl.text.TextField;
import openfl.text.TextFormat;
import openfl.events.KeyboardEvent;
import openfl.ui.Keyboard;

typedef MenuOption = {
    var label:String;
    var action:Void->Void;
}

class MenuContext extends Sprite {
    private var options:Array<MenuOption>;
    private var selectedIndex:Int = 0;
    private var textFields:Array<TextField> = [];
    private var format:TextFormat;

    public function new(options:Array<MenuOption>) {
        super();
        this.options = options;
        format = new TextFormat("Arial", 15, 0xFFFFFF);
        addEventListener(openfl.events.Event.ADDED_TO_STAGE, onAdded);
    }

    private function onAdded(_):Void {
        stage.addEventListener(KeyboardEvent.KEY_DOWN, onKeyDown);
        display();
    }

    private function display():Void {
        for (tf in textFields) removeChild(tf);
        textFields = [];
        for (i in 0...options.length) {
            var tf = new TextField();
            tf.defaultTextFormat = format;
            tf.width = 400;
            tf.text = (i == selectedIndex ? "> " : "  ") + options[i].label;
            tf.textColor = (i == selectedIndex) ? 0xFFFF00 : 0xFFFFFF;
            tf.y = 60 + i * 30;
            addChild(tf);
            textFields.push(tf);
        }
    }

    private function onKeyDown(event:KeyboardEvent):Void {
        switch (event.keyCode) {
            case Keyboard.UP:
                selectedIndex = (selectedIndex - 1 + options.length) % options.length;
                display();
            case Keyboard.DOWN:
                selectedIndex = (selectedIndex + 1) % options.length;
                display();
            case Keyboard.ENTER:
                if (options[selectedIndex].action != null) {
                    options[selectedIndex].action();
                }
        }
    }
}
