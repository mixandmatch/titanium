var args = arguments[0] || {};

Alloy.Globals.GoogleAnalytics.trackPageview('imprint');

function closeWindow(e) {
	$.winNav.close();
}

$.winImprint.addEventListener("close", function() {
	$.destroy();
});
