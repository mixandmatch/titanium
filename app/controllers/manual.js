var args = arguments[0] || {};

$.vweb.url = Alloy.CFG.helpurl;

Alloy.Globals.GoogleAnalytics.trackPageview('manual');

function closeWindow(e) {
    $.winNav.close();
    Alloy.Globals.GoogleAnalytics.trackEvent("manual" , "closeWindow");
}

$.winManual.addEventListener("close" , function () {
    $.destroy();
});