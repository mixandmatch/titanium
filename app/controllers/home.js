var args = arguments [0] || {};

function _init (_args) {

	Alloy.Globals.pageFlow = $.pageflow;
	
	if (OS_IOS) {
	    var leftMenuView = Alloy.createController("menu").getView();
		
		leftMenuView.hide();
        Alloy.Globals.sidemenu = $.tisidemenu;
	}
	else
	if (OS_ANDROID) {
	    
		Alloy.Globals.sidemenu = $.homewin;
		
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
