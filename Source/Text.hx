package;

import openfl.text.Font;
import openfl.text.TextField;
import openfl.text.TextFormat;
import openfl.text.TextFormatAlign;
import openfl.text.TextFieldAutoSize;
import openfl.text.AntiAliasType;
import openfl.geom.Point;
import openfl.geom.Rectangle;
import com.akifox.transform.Transformation;
import openfl.Lib;

class Text extends TextField
{

	// DefaultFont is used by TextAA as well
	private static var _defaultFont:String="";
	public static var defaultFont(get,set):String;
	private static function get_defaultFont():String {
		return _defaultFont;
	}
	private static function set_defaultFont(value:String):String {
		return _defaultFont = value;
	}

  //##########################################################################################

	var textField:TextField;
	var textFieldFont:Font;
	var textFieldColor:Int;
	var textFieldFormat:TextFormat;
	var textFieldSize:Int;

	private function redraw() {
		if (_transformation != null) _transformation.updateSize();
	}

  public function setText(value:String) {
    textField.text = value;
    redraw();
    return value;
  }

	public function setSize(value:Int) {
      textFieldFormat.size = value;
      textField.defaultTextFormat = textFieldFormat;
      textField.setTextFormat(textFieldFormat);
      redraw();
      return value;
  }

	public function setFont(value:String) {
      textFieldFormat.font = value;
      textField.defaultTextFormat = textFieldFormat;
      textField.setTextFormat(textFieldFormat);
      redraw();
      return value;
  }

	public function setAlign(value:#if (!v2 || web) TextFormatAlign #else String = null #end) {
      textFieldFormat.align = value;
      textField.defaultTextFormat = textFieldFormat;
      textField.setTextFormat(textFieldFormat);
      redraw();
      return value;
  }

	public function setColor(value:Int) {
      textFieldFormat.color = value;
      textField.defaultTextFormat = textFieldFormat;
      textField.setTextFormat(textFieldFormat);
      redraw();
      return value;
  }

	public function setSelectable(value:Bool) {
      textField.selectable = value;
      return value;
  }

	public function setWordWrap(value:Bool) {
      textField.wordWrap = value;
      return value;
  }

	public function setInput(value:Bool) {
			if (value) {
				textField.type = openfl.text.TextFieldType.INPUT;
			} else {
				textField.type = openfl.text.TextFieldType.DYNAMIC;
			}
      return value;
  }

	public function setFocus() {
		try {
			Lib.current.stage.focus = textField;
		} catch(e:Dynamic) {
			trace('unable to set focus to Text');
		}
	}

	public function setCaretEnd() {
		if (textField.type == openfl.text.TextFieldType.DYNAMIC) return;
		textField.setSelection(textField.text.length-1,textField.text.length-1);
	}

	public function new (stringText:String="",?size:Int=20,?color:Int=0,?align:#if (!v2 || web) TextFormatAlign #else String = null #end,?font:String="",?smoothing:Bool=true) {

		super ();

    if (align==null) align = #if (!v2 || web) TextFormatAlign.LEFT #else "left" #end;

    textFieldSize = size;
    textFieldColor = color;
    if (font=="") font = _defaultFont;
    textFieldFont = PLIK.getFont(font);

		textField = this;

		//prepare the TextFormat
    textFieldFormat = new TextFormat(textFieldFont.fontName, textFieldSize , textFieldColor);

    textFieldFormat.align = align;
    textField.autoSize = TextFieldAutoSize.LEFT;
    textField.antiAliasType = AntiAliasType.ADVANCED;
    textField.defaultTextFormat = textFieldFormat;
		textField.setTextFormat(textFieldFormat);
    textField.embedFonts = true;
    textField.selectable = false;
    textField.wordWrap = false;
    textField.border = false;
		textField.text = stringText;

    _transformation = new Transformation(this.transform.matrix,this.width,this.height);
    _transformation.bind(this);

	}

	private var _transformation:Transformation;
	public var t(get,never):Transformation;
	private function get_t():Transformation {
	    return _transformation;
	}

	//##########################################################################################
	// IDestroyable

	public override function toString():String {
	    return '[PLIK.Text "'+text+'"]';
	}

	public function destroy() {

	  #if gbcheck
	  trace('GB Destroy > ' + this);
	  #end

		// destroy this element
		if (this._transformation!=null) this._transformation.destroy();
			this._transformation = null;
	}

}
