package;


import flash.display.Bitmap;
import flash.display.BitmapData;
import flash.display.MovieClip;
import flash.text.Font;
import flash.media.Sound;
import flash.net.URLRequest;
import flash.utils.ByteArray;
import haxe.Unserializer;
import openfl.Assets;

#if (flash || js)
import flash.display.Loader;
import flash.events.Event;
import flash.net.URLLoader;
#end

#if ios
import openfl.utils.SystemPath;
#end


class DefaultAssetLibrary extends AssetLibrary {
	
	
	public static var className (default, null) = new Map <String, Dynamic> ();
	public static var path (default, null) = new Map <String, String> ();
	public static var type (default, null) = new Map <String, AssetType> ();
	
	
	public function new () {
		
		super ();
		
		#if flash
		
		className.set ("assets/1.frag", __ASSET__assets_1_frag);
		type.set ("assets/1.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/10.frag", __ASSET__assets_10_frag);
		type.set ("assets/10.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/11.frag", __ASSET__assets_11_frag);
		type.set ("assets/11.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/12.frag", __ASSET__assets_12_frag);
		type.set ("assets/12.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/12288.0.frag", __ASSET__assets_12288_0_frag);
		type.set ("assets/12288.0.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/12290.0.frag", __ASSET__assets_12290_0_frag);
		type.set ("assets/12290.0.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/12293.0.frag", __ASSET__assets_12293_0_frag);
		type.set ("assets/12293.0.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/12294.0.frag", __ASSET__assets_12294_0_frag);
		type.set ("assets/12294.0.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/12297.0.frag", __ASSET__assets_12297_0_frag);
		type.set ("assets/12297.0.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/12326.0.frag", __ASSET__assets_12326_0_frag);
		type.set ("assets/12326.0.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/12366.0.frag", __ASSET__assets_12366_0_frag);
		type.set ("assets/12366.0.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/12441.0.frag", __ASSET__assets_12441_0_frag);
		type.set ("assets/12441.0.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/12469.1.frag", __ASSET__assets_12469_1_frag);
		type.set ("assets/12469.1.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/12470.1.frag", __ASSET__assets_12470_1_frag);
		type.set ("assets/12470.1.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/12471.0.frag", __ASSET__assets_12471_0_frag);
		type.set ("assets/12471.0.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/12473.0.frag", __ASSET__assets_12473_0_frag);
		type.set ("assets/12473.0.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/12476.2.frag", __ASSET__assets_12476_2_frag);
		type.set ("assets/12476.2.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/13.frag", __ASSET__assets_13_frag);
		type.set ("assets/13.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/14.frag", __ASSET__assets_14_frag);
		type.set ("assets/14.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/15.frag", __ASSET__assets_15_frag);
		type.set ("assets/15.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/16.frag", __ASSET__assets_16_frag);
		type.set ("assets/16.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/17.frag", __ASSET__assets_17_frag);
		type.set ("assets/17.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/18.frag", __ASSET__assets_18_frag);
		type.set ("assets/18.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/19.frag", __ASSET__assets_19_frag);
		type.set ("assets/19.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/2.frag", __ASSET__assets_2_frag);
		type.set ("assets/2.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/20.frag", __ASSET__assets_20_frag);
		type.set ("assets/20.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/21.frag", __ASSET__assets_21_frag);
		type.set ("assets/21.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/22.frag", __ASSET__assets_22_frag);
		type.set ("assets/22.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/23.frag", __ASSET__assets_23_frag);
		type.set ("assets/23.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/24.frag", __ASSET__assets_24_frag);
		type.set ("assets/24.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/25.frag", __ASSET__assets_25_frag);
		type.set ("assets/25.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/26.frag", __ASSET__assets_26_frag);
		type.set ("assets/26.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/27.frag", __ASSET__assets_27_frag);
		type.set ("assets/27.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/28.frag", __ASSET__assets_28_frag);
		type.set ("assets/28.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/29.frag", __ASSET__assets_29_frag);
		type.set ("assets/29.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/3.frag", __ASSET__assets_3_frag);
		type.set ("assets/3.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/30.frag", __ASSET__assets_30_frag);
		type.set ("assets/30.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/31.frag", __ASSET__assets_31_frag);
		type.set ("assets/31.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/32.frag", __ASSET__assets_32_frag);
		type.set ("assets/32.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/33.frag", __ASSET__assets_33_frag);
		type.set ("assets/33.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/34.frag", __ASSET__assets_34_frag);
		type.set ("assets/34.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/35.frag", __ASSET__assets_35_frag);
		type.set ("assets/35.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/36.frag", __ASSET__assets_36_frag);
		type.set ("assets/36.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/37.frag", __ASSET__assets_37_frag);
		type.set ("assets/37.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/38.frag", __ASSET__assets_38_frag);
		type.set ("assets/38.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/39.frag", __ASSET__assets_39_frag);
		type.set ("assets/39.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/40.frag", __ASSET__assets_40_frag);
		type.set ("assets/40.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/41.frag", __ASSET__assets_41_frag);
		type.set ("assets/41.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/42.frag", __ASSET__assets_42_frag);
		type.set ("assets/42.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/4278.1.frag", __ASSET__assets_4278_1_frag);
		type.set ("assets/4278.1.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/43.frag", __ASSET__assets_43_frag);
		type.set ("assets/43.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/44.frag", __ASSET__assets_44_frag);
		type.set ("assets/44.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/45.frag", __ASSET__assets_45_frag);
		type.set ("assets/45.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/46.frag", __ASSET__assets_46_frag);
		type.set ("assets/46.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/47.frag", __ASSET__assets_47_frag);
		type.set ("assets/47.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/48.frag", __ASSET__assets_48_frag);
		type.set ("assets/48.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/49.frag", __ASSET__assets_49_frag);
		type.set ("assets/49.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/5.frag", __ASSET__assets_5_frag);
		type.set ("assets/5.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/50.frag", __ASSET__assets_50_frag);
		type.set ("assets/50.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/51.frag", __ASSET__assets_51_frag);
		type.set ("assets/51.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/5359.8.frag", __ASSET__assets_5359_8_frag);
		type.set ("assets/5359.8.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/5398.8.frag", __ASSET__assets_5398_8_frag);
		type.set ("assets/5398.8.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/5454.21.frag", __ASSET__assets_5454_21_frag);
		type.set ("assets/5454.21.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/5492.frag", __ASSET__assets_5492_frag);
		type.set ("assets/5492.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/5733.frag", __ASSET__assets_5733_frag);
		type.set ("assets/5733.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/5805.18.frag", __ASSET__assets_5805_18_frag);
		type.set ("assets/5805.18.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/5812.frag", __ASSET__assets_5812_frag);
		type.set ("assets/5812.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/5891.5.frag", __ASSET__assets_5891_5_frag);
		type.set ("assets/5891.5.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/5986.0.frag", __ASSET__assets_5986_0_frag);
		type.set ("assets/5986.0.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/6.frag", __ASSET__assets_6_frag);
		type.set ("assets/6.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/6022.frag", __ASSET__assets_6022_frag);
		type.set ("assets/6022.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/6043.1.frag", __ASSET__assets_6043_1_frag);
		type.set ("assets/6043.1.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/6049.frag", __ASSET__assets_6049_frag);
		type.set ("assets/6049.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/6138.4.frag", __ASSET__assets_6138_4_frag);
		type.set ("assets/6138.4.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/6147.1.frag", __ASSET__assets_6147_1_frag);
		type.set ("assets/6147.1.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/6162.frag", __ASSET__assets_6162_frag);
		type.set ("assets/6162.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/6175.frag", __ASSET__assets_6175_frag);
		type.set ("assets/6175.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/6223.2.frag", __ASSET__assets_6223_2_frag);
		type.set ("assets/6223.2.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/6238.frag", __ASSET__assets_6238_frag);
		type.set ("assets/6238.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/6284.1.frag", __ASSET__assets_6284_1_frag);
		type.set ("assets/6284.1.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/6286.frag", __ASSET__assets_6286_frag);
		type.set ("assets/6286.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/6288.1.frag", __ASSET__assets_6288_1_frag);
		type.set ("assets/6288.1.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/7.frag", __ASSET__assets_7_frag);
		type.set ("assets/7.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/9.frag", __ASSET__assets_9_frag);
		type.set ("assets/9.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/heroku.vert", __ASSET__assets_heroku_vert);
		type.set ("assets/heroku.vert", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/ko.frag", __ASSET__assets_ko_frag);
		type.set ("assets/ko.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		className.set ("assets/readme.txt", __ASSET__assets_readme_txt);
		type.set ("assets/readme.txt", Reflect.field (AssetType, "text".toUpperCase ()));
		
		
		#elseif html5
		
		path.set ("assets/1.frag", "assets/1.frag");
		type.set ("assets/1.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/10.frag", "assets/10.frag");
		type.set ("assets/10.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/11.frag", "assets/11.frag");
		type.set ("assets/11.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/12.frag", "assets/12.frag");
		type.set ("assets/12.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/12288.0.frag", "assets/12288.0.frag");
		type.set ("assets/12288.0.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/12290.0.frag", "assets/12290.0.frag");
		type.set ("assets/12290.0.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/12293.0.frag", "assets/12293.0.frag");
		type.set ("assets/12293.0.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/12294.0.frag", "assets/12294.0.frag");
		type.set ("assets/12294.0.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/12297.0.frag", "assets/12297.0.frag");
		type.set ("assets/12297.0.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/12326.0.frag", "assets/12326.0.frag");
		type.set ("assets/12326.0.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/12366.0.frag", "assets/12366.0.frag");
		type.set ("assets/12366.0.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/12441.0.frag", "assets/12441.0.frag");
		type.set ("assets/12441.0.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/12469.1.frag", "assets/12469.1.frag");
		type.set ("assets/12469.1.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/12470.1.frag", "assets/12470.1.frag");
		type.set ("assets/12470.1.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/12471.0.frag", "assets/12471.0.frag");
		type.set ("assets/12471.0.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/12473.0.frag", "assets/12473.0.frag");
		type.set ("assets/12473.0.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/12476.2.frag", "assets/12476.2.frag");
		type.set ("assets/12476.2.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/13.frag", "assets/13.frag");
		type.set ("assets/13.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/14.frag", "assets/14.frag");
		type.set ("assets/14.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/15.frag", "assets/15.frag");
		type.set ("assets/15.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/16.frag", "assets/16.frag");
		type.set ("assets/16.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/17.frag", "assets/17.frag");
		type.set ("assets/17.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/18.frag", "assets/18.frag");
		type.set ("assets/18.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/19.frag", "assets/19.frag");
		type.set ("assets/19.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/2.frag", "assets/2.frag");
		type.set ("assets/2.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/20.frag", "assets/20.frag");
		type.set ("assets/20.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/21.frag", "assets/21.frag");
		type.set ("assets/21.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/22.frag", "assets/22.frag");
		type.set ("assets/22.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/23.frag", "assets/23.frag");
		type.set ("assets/23.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/24.frag", "assets/24.frag");
		type.set ("assets/24.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/25.frag", "assets/25.frag");
		type.set ("assets/25.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/26.frag", "assets/26.frag");
		type.set ("assets/26.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/27.frag", "assets/27.frag");
		type.set ("assets/27.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/28.frag", "assets/28.frag");
		type.set ("assets/28.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/29.frag", "assets/29.frag");
		type.set ("assets/29.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/3.frag", "assets/3.frag");
		type.set ("assets/3.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/30.frag", "assets/30.frag");
		type.set ("assets/30.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/31.frag", "assets/31.frag");
		type.set ("assets/31.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/32.frag", "assets/32.frag");
		type.set ("assets/32.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/33.frag", "assets/33.frag");
		type.set ("assets/33.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/34.frag", "assets/34.frag");
		type.set ("assets/34.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/35.frag", "assets/35.frag");
		type.set ("assets/35.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/36.frag", "assets/36.frag");
		type.set ("assets/36.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/37.frag", "assets/37.frag");
		type.set ("assets/37.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/38.frag", "assets/38.frag");
		type.set ("assets/38.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/39.frag", "assets/39.frag");
		type.set ("assets/39.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/40.frag", "assets/40.frag");
		type.set ("assets/40.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/41.frag", "assets/41.frag");
		type.set ("assets/41.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/42.frag", "assets/42.frag");
		type.set ("assets/42.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/4278.1.frag", "assets/4278.1.frag");
		type.set ("assets/4278.1.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/43.frag", "assets/43.frag");
		type.set ("assets/43.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/44.frag", "assets/44.frag");
		type.set ("assets/44.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/45.frag", "assets/45.frag");
		type.set ("assets/45.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/46.frag", "assets/46.frag");
		type.set ("assets/46.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/47.frag", "assets/47.frag");
		type.set ("assets/47.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/48.frag", "assets/48.frag");
		type.set ("assets/48.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/49.frag", "assets/49.frag");
		type.set ("assets/49.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/5.frag", "assets/5.frag");
		type.set ("assets/5.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/50.frag", "assets/50.frag");
		type.set ("assets/50.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/51.frag", "assets/51.frag");
		type.set ("assets/51.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/5359.8.frag", "assets/5359.8.frag");
		type.set ("assets/5359.8.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/5398.8.frag", "assets/5398.8.frag");
		type.set ("assets/5398.8.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/5454.21.frag", "assets/5454.21.frag");
		type.set ("assets/5454.21.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/5492.frag", "assets/5492.frag");
		type.set ("assets/5492.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/5733.frag", "assets/5733.frag");
		type.set ("assets/5733.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/5805.18.frag", "assets/5805.18.frag");
		type.set ("assets/5805.18.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/5812.frag", "assets/5812.frag");
		type.set ("assets/5812.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/5891.5.frag", "assets/5891.5.frag");
		type.set ("assets/5891.5.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/5986.0.frag", "assets/5986.0.frag");
		type.set ("assets/5986.0.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/6.frag", "assets/6.frag");
		type.set ("assets/6.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/6022.frag", "assets/6022.frag");
		type.set ("assets/6022.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/6043.1.frag", "assets/6043.1.frag");
		type.set ("assets/6043.1.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/6049.frag", "assets/6049.frag");
		type.set ("assets/6049.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/6138.4.frag", "assets/6138.4.frag");
		type.set ("assets/6138.4.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/6147.1.frag", "assets/6147.1.frag");
		type.set ("assets/6147.1.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/6162.frag", "assets/6162.frag");
		type.set ("assets/6162.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/6175.frag", "assets/6175.frag");
		type.set ("assets/6175.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/6223.2.frag", "assets/6223.2.frag");
		type.set ("assets/6223.2.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/6238.frag", "assets/6238.frag");
		type.set ("assets/6238.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/6284.1.frag", "assets/6284.1.frag");
		type.set ("assets/6284.1.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/6286.frag", "assets/6286.frag");
		type.set ("assets/6286.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/6288.1.frag", "assets/6288.1.frag");
		type.set ("assets/6288.1.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/7.frag", "assets/7.frag");
		type.set ("assets/7.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/9.frag", "assets/9.frag");
		type.set ("assets/9.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/heroku.vert", "assets/heroku.vert");
		type.set ("assets/heroku.vert", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/ko.frag", "assets/ko.frag");
		type.set ("assets/ko.frag", Reflect.field (AssetType, "binary".toUpperCase ()));
		path.set ("assets/readme.txt", "assets/readme.txt");
		type.set ("assets/readme.txt", Reflect.field (AssetType, "text".toUpperCase ()));
		
		
		#else
		
		try {
			
			var bytes = ByteArray.readFile ("manifest");
			bytes.position = 0;
			
			if (bytes.length > 0) {
				
				var data = bytes.readUTFBytes (bytes.length);
				
				if (data != null && data.length > 0) {
					
					var manifest:Array<AssetData> = Unserializer.run (data);
					
					for (asset in manifest) {
						
						path.set (asset.id, asset.path);
						type.set (asset.id, asset.type);
						
					}
					
				}
				
			}
			
		} catch (e:Dynamic) {
			
			trace ("Warning: Could not load asset manifest");
			
		}
		
		#end
		
	}
	
	
	public override function exists (id:String, type:AssetType):Bool {
		
		var assetType = DefaultAssetLibrary.type.get (id);
		
		#if pixi
		
		if (assetType == IMAGE) {
			
			return true;
			
		} else {
			
			return false;
			
		}
		
		#end
		
		if (assetType != null) {
			
			if (assetType == type || type == SOUND && (assetType == MUSIC || assetType == SOUND)) {
				
				return true;
				
			}
			
			#if flash
			
			if ((assetType == BINARY || assetType == TEXT) && type == BINARY) {
				
				return true;
				
			} else if (path.exists (id)) {
				
				return true;
				
			}
			
			#else
			
			if (type == BINARY || type == null) {
				
				return true;
				
			}
			
			#end
			
		}
		
		return false;
		
	}
	
	
	public override function getBitmapData (id:String):BitmapData {
		
		#if pixi
		
		return BitmapData.fromImage (path.get (id));
		
		#elseif flash
		
		return cast (Type.createInstance (className.get (id), []), BitmapData);
		
		#elseif js
		
		return cast (ApplicationMain.loaders.get (path.get (id)).contentLoaderInfo.content, Bitmap).bitmapData;
		
		#else
		
		return BitmapData.load (path.get (id));
		
		#end
		
	}
	
	
	public override function getBytes (id:String):ByteArray {
		
		#if pixi
		
		return null;
		
		#elseif flash
		
		return cast (Type.createInstance (className.get (id), []), ByteArray);
		
		#elseif js
		
		var bytes:ByteArray = null;
		var data = ApplicationMain.urlLoaders.get (path.get (id)).data;
		
		if (Std.is (data, String)) {
			
			bytes = new ByteArray ();
			bytes.writeUTFBytes (data);
			
		} else if (Std.is (data, ByteArray)) {
			
			bytes = cast data;
			
		} else {
			
			bytes = null;
			
		}

		if (bytes != null) {
			
			bytes.position = 0;
			return bytes;
			
		} else {
			
			return null;
		}
		
		#else
		
		return ByteArray.readFile (path.get (id));
		
		#end
		
	}
	
	
	public override function getFont (id:String):Font {
		
		#if pixi
		
		return null;
		
		#elseif (flash || js)
		
		return cast (Type.createInstance (className.get (id), []), Font);
		
		#else
		
		return new Font (path.get (id));
		
		#end
		
	}
	
	
	public override function getPath (id:String):String {
		
		#if ios
		
		return SystemPath.applicationDirectory + "/assets/" + path.get (id);
		
		#else
		
		return path.get (id);
		
		#end
		
	}
	
	
	public override function getSound (id:String):Sound {
		
		#if pixi
		
		return null;
		
		#elseif flash
		
		return cast (Type.createInstance (className.get (id), []), Sound);
		
		#elseif js
		
		return new Sound (new URLRequest (path.get (id)));
		
		#else
		
		return new Sound (new URLRequest (path.get (id)), null, type.get (id) == MUSIC);
		
		#end
		
	}
	
	
	public override function isLocal (id:String, type:AssetType):Bool {
		
		#if flash
		
		if (type != AssetType.MUSIC && type != AssetType.SOUND) {
			
			return className.exists (id);
			
		}
		
		#end
		
		return true;
		
	}
	
	
	public override function loadBitmapData (id:String, handler:BitmapData -> Void):Void {
		
		#if pixi
		
		handler (getBitmapData (id));
		
		#elseif (flash || js)
		
		if (path.exists (id)) {
			
			var loader = new Loader ();
			loader.contentLoaderInfo.addEventListener (Event.COMPLETE, function (event:Event) {
				
				handler (cast (event.currentTarget.content, Bitmap).bitmapData);
				
			});
			loader.load (new URLRequest (path.get (id)));
			
		} else {
			
			handler (getBitmapData (id));
			
		}
		
		#else
		
		handler (getBitmapData (id));
		
		#end
		
	}
	
	
	public override function loadBytes (id:String, handler:ByteArray -> Void):Void {
		
		#if pixi
		
		handler (getBytes (id));
		
		#elseif (flash || js)
		
		if (path.exists (id)) {
			
			var loader = new URLLoader ();
			loader.addEventListener (Event.COMPLETE, function (event:Event) {
				
				var bytes = new ByteArray ();
				bytes.writeUTFBytes (event.currentTarget.data);
				bytes.position = 0;
				
				handler (bytes);
				
			});
			loader.load (new URLRequest (path.get (id)));
			
		} else {
			
			handler (getBytes (id));
			
		}
		
		#else
		
		handler (getBytes (id));
		
		#end
		
	}
	
	
	public override function loadFont (id:String, handler:Font -> Void):Void {
		
		#if (flash || js)
		
		/*if (path.exists (id)) {
			
			var loader = new Loader ();
			loader.contentLoaderInfo.addEventListener (Event.COMPLETE, function (event) {
				
				handler (cast (event.currentTarget.content, Bitmap).bitmapData);
				
			});
			loader.load (new URLRequest (path.get (id)));
			
		} else {*/
			
			handler (getFont (id));
			
		//}
		
		#else
		
		handler (getFont (id));
		
		#end
		
	}
	
	
	public override function loadSound (id:String, handler:Sound -> Void):Void {
		
		#if (flash || js)
		
		/*if (path.exists (id)) {
			
			var loader = new Loader ();
			loader.contentLoaderInfo.addEventListener (Event.COMPLETE, function (event) {
				
				handler (cast (event.currentTarget.content, Bitmap).bitmapData);
				
			});
			loader.load (new URLRequest (path.get (id)));
			
		} else {*/
			
			handler (getSound (id));
			
		//}
		
		#else
		
		handler (getSound (id));
		
		#end
		
	}
	
	
}


#if pixi
#elseif flash

class __ASSET__assets_1_frag extends null { }
class __ASSET__assets_10_frag extends null { }
class __ASSET__assets_11_frag extends null { }
class __ASSET__assets_12_frag extends null { }
class __ASSET__assets_12288_0_frag extends null { }
class __ASSET__assets_12290_0_frag extends null { }
class __ASSET__assets_12293_0_frag extends null { }
class __ASSET__assets_12294_0_frag extends null { }
class __ASSET__assets_12297_0_frag extends null { }
class __ASSET__assets_12326_0_frag extends null { }
class __ASSET__assets_12366_0_frag extends null { }
class __ASSET__assets_12441_0_frag extends null { }
class __ASSET__assets_12469_1_frag extends null { }
class __ASSET__assets_12470_1_frag extends null { }
class __ASSET__assets_12471_0_frag extends null { }
class __ASSET__assets_12473_0_frag extends null { }
class __ASSET__assets_12476_2_frag extends null { }
class __ASSET__assets_13_frag extends null { }
class __ASSET__assets_14_frag extends null { }
class __ASSET__assets_15_frag extends null { }
class __ASSET__assets_16_frag extends null { }
class __ASSET__assets_17_frag extends null { }
class __ASSET__assets_18_frag extends null { }
class __ASSET__assets_19_frag extends null { }
class __ASSET__assets_2_frag extends null { }
class __ASSET__assets_20_frag extends null { }
class __ASSET__assets_21_frag extends null { }
class __ASSET__assets_22_frag extends null { }
class __ASSET__assets_23_frag extends null { }
class __ASSET__assets_24_frag extends null { }
class __ASSET__assets_25_frag extends null { }
class __ASSET__assets_26_frag extends null { }
class __ASSET__assets_27_frag extends null { }
class __ASSET__assets_28_frag extends null { }
class __ASSET__assets_29_frag extends null { }
class __ASSET__assets_3_frag extends null { }
class __ASSET__assets_30_frag extends null { }
class __ASSET__assets_31_frag extends null { }
class __ASSET__assets_32_frag extends null { }
class __ASSET__assets_33_frag extends null { }
class __ASSET__assets_34_frag extends null { }
class __ASSET__assets_35_frag extends null { }
class __ASSET__assets_36_frag extends null { }
class __ASSET__assets_37_frag extends null { }
class __ASSET__assets_38_frag extends null { }
class __ASSET__assets_39_frag extends null { }
class __ASSET__assets_40_frag extends null { }
class __ASSET__assets_41_frag extends null { }
class __ASSET__assets_42_frag extends null { }
class __ASSET__assets_4278_1_frag extends null { }
class __ASSET__assets_43_frag extends null { }
class __ASSET__assets_44_frag extends null { }
class __ASSET__assets_45_frag extends null { }
class __ASSET__assets_46_frag extends null { }
class __ASSET__assets_47_frag extends null { }
class __ASSET__assets_48_frag extends null { }
class __ASSET__assets_49_frag extends null { }
class __ASSET__assets_5_frag extends null { }
class __ASSET__assets_50_frag extends null { }
class __ASSET__assets_51_frag extends null { }
class __ASSET__assets_5359_8_frag extends null { }
class __ASSET__assets_5398_8_frag extends null { }
class __ASSET__assets_5454_21_frag extends null { }
class __ASSET__assets_5492_frag extends null { }
class __ASSET__assets_5733_frag extends null { }
class __ASSET__assets_5805_18_frag extends null { }
class __ASSET__assets_5812_frag extends null { }
class __ASSET__assets_5891_5_frag extends null { }
class __ASSET__assets_5986_0_frag extends null { }
class __ASSET__assets_6_frag extends null { }
class __ASSET__assets_6022_frag extends null { }
class __ASSET__assets_6043_1_frag extends null { }
class __ASSET__assets_6049_frag extends null { }
class __ASSET__assets_6138_4_frag extends null { }
class __ASSET__assets_6147_1_frag extends null { }
class __ASSET__assets_6162_frag extends null { }
class __ASSET__assets_6175_frag extends null { }
class __ASSET__assets_6223_2_frag extends null { }
class __ASSET__assets_6238_frag extends null { }
class __ASSET__assets_6284_1_frag extends null { }
class __ASSET__assets_6286_frag extends null { }
class __ASSET__assets_6288_1_frag extends null { }
class __ASSET__assets_7_frag extends null { }
class __ASSET__assets_9_frag extends null { }
class __ASSET__assets_heroku_vert extends null { }
class __ASSET__assets_ko_frag extends null { }
class __ASSET__assets_readme_txt extends null { }


#elseif html5


























































































#end