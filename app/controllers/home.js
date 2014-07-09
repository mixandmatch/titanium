$.home.contentView = Alloy.createController("contentView").getView();
$.home.leftMenuView = Alloy.createController("menu").getView();
$.home.open();

function _init(_args) {
	$.home.hideMenuViewController();
}

exports.init = _init;
