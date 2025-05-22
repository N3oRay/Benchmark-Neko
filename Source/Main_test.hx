import openfl.display.Sprite;

class Main extends Sprite {
    public function new() {
        super();
        var menu = new MenuContext(["Start Game", "Options", "Exit"]);
        addChild(menu);
    }
}