var args = arguments [0] || {};

function _init (_args) {

	var leftMenuView = Alloy.createController("menu").getView();
	
	if (OS_IOS) {
		Alloy.Globals.pageFlow = $.pageflow;
		leftMenuView.hide();
        Alloy.Globals.sidemenu = $.tisidemenu;
	}
	else
	if (OS_ANDROID) {
		Alloy.Globals.pageFlow = Alloy.createWidget("com.jolicode.pageflow");
		Ti.Android.currentActivity.actionBar.hide();

		$.homewin.orientationModes = [Ti.UI.PORTRAIT , Ti.UI.UPSIDE_PORTRAIT];
		$.homewin.addEventListener('androidback' , function () {
			if (Alloy.Globals.pageFlow.countPages() > 1) {
				Alloy.Globals.pageFlow.back();
			}
			else {
				Ti.Android.currentActivity.finish();
			}
		});

		var contentView = Ti.UI.createView();
		contentView.add(Alloy.Globals.pageFlow.getView());

		Alloy.Globals.RootWindow = $.homewin;
		Alloy.Globals.sidemenu = $.home;
		$.home.init({
			menuview: leftMenuView ,
			mainview: contentView ,
			duration: 200 ,
			parent: $.homewin
		});
	}
	
	Alloy.Globals.pageFlow.addChild({
		controller: 'contentView' ,
		navBarHidden: true ,
		direction: {
			top: 0 ,
			left: 1
		}
	});

}

exports.init = _init;

_init();
