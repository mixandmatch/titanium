var args = arguments [0] || {};

function _init (_args) {

    Alloy.Globals.pageFlow = $.pageflow;
	var contentView = Alloy.createController("contentView").getView();
    var leftMenuView = Alloy.createController("menu").getView();
	leftMenuView.hide();

	if (OS_ANDROID) {
	    
	    Alloy.Globals.RootWindow = $.homewin;
		$.home.init({
			menuview: leftMenuView ,
			mainview: contentView ,
			duration: 200 ,
			parent: Alloy.Globals.RootWindow
		});
	}
	else
	if (OS_IOS) {
	    
	    Alloy.Globals.tisidemenu = $.tisidemenu;
	    
	    
		Alloy.Globals.pageFlow.addChild({
            controller: 'contentView' ,
            navBarHidden:true,
            direction: {
                top: 0 ,
                left: 1
            }
        });
	}

}

exports.init = _init;

_init();
