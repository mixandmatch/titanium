var args = arguments[0] || {};

//Alloy.Globals.GoogleAnalytics.screen('imprint');

exports.preShow = function () {
    
    Alloy.Globals.GoogleAnalytics.trackScreen({
        screenName: "Imprint"
    });
};