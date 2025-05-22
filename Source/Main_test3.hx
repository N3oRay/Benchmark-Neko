import openfl.display.Sprite;

class Main extends Sprite {
    public function new() {
        super();
        var menu = new MenuContext([
            { label: "Play", action: function() {
                trace("Play option selected!");
                // Add your game start logic here
            }},
            { label: "Settings", action: function() {
                trace("Settings option selected!");
            }},
            { label: "Quit", action: function() {
                trace("Quit option selected!");
            }}
        ]);
        addChild(menu);
    }
}