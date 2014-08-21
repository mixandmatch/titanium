var args = arguments [0] || {};

function _init (_args) {

	if (OS_IOS) {
		Alloy.Globals.pageFlow = $.pageflow;
	} else if (OS_ANDROID) {
	    Alloy.Globals.pageFlow = Alloy.createWidget("com.jolicode.pageflow");
	}
	
	var leftMenuView = Alloy.createController("menu").getView();

	if (OS_ANDROID) {

        var contentView = Ti.UI.createView();
        contentView.add(Alloy.Globals.pageFlow.getView());
        
		Alloy.Globals.RootWindow = $.homewin;
		$.home.init({
			menuview: leftMenuView ,
			mainview: contentView ,
			// mainview: Ti.UI.createView({
			// backgroundColor: "white"
			// }) ,
			//mainview: Alloy.Globals.pageFlow ,
			duration: 200 ,
			parent: $.homewin
		});
	}
	else
	if (OS_IOS) {
		leftMenuView.hide();
		Alloy.Globals.tisidemenu = $.tisidemenu;
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
