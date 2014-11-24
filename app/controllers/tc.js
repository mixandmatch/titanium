var args = arguments[0] || {};

//Alloy.Globals.GoogleAnalytics.screen('tc');

$.vweb.url = Alloy.CFG.tcurl;

function closeWindow(e) {
    $.winNav.close();
}
