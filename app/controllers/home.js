var args = arguments [0] || {};

function _init (_args) {

    var contentView = Alloy.createController("contentView").getView();
    var leftMenuView = Alloy.createController("menu").getView();
    leftMenuView.hide();

    if (OS_ANDROID) {
        $.home.init({
            menuview: leftMenuView ,
            mainview: contentView ,
            duration: 200 ,
            parent: Alloy.Globals.RootWindow
        });
    }
    else
    if (OS_IOS) {
        $.home.contentView = contentView;
        $.home.leftMenuView = leftMenuView;
        
        $.home.hideMenuViewController();
        
        $.home.open();
    }

    
}

exports.init = _init;

_init();
