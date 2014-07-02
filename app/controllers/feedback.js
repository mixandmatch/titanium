var args = arguments[0] || {};

Alloy.Globals.GoogleAnalytics.trackPageview('feedback');

function closeWindow(e) {
    $.winNav.close();
}

$.winFeedback.addEventListener("close" , function () {
    $.destroy();
});

function btnSubmit_Click(e) {
    
}

$.starwidget.init(); 