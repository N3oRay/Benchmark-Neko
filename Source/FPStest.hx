packages;
import openfl.display.Sprite;
import openfl.events.Event;
import haxe.Timer;

class FPStest extends Sprite 
{
	var counter = 0;
	var prevcount = 0;

	public function new() 
	{
		super();
		
		var timer:Timer = new Timer(1000);
		timer.run = function() { trace(counter - prevcount); prevcount = counter; }
		addEventListener(Event.ENTER_FRAME, update);
	}
	
	function update(e)
	{
		++counter;
	}
}
