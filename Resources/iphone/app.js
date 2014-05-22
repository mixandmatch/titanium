var Alloy = require("alloy"), _ = Alloy._, Backbone = Alloy.Backbone;

Ti.App.Properties.setBool("Log", true);

Ti.App.Properties.setBool("LogSync", true);

Ti.App.Properties.setBool("LogSyncVerbose", true);

var networkChangeEventhandler = function(e) {
    Ti.API.debug(JSON.stringify(e));
    if (!e.online && null != Alloy.Globals.currentWindow) {
        Ti.Network.removeEventListener("change", networkChangeEventhandler);
        Ti.API.debug("showing network error toast message ...");
        Alloy.Globals.loading.hide();
        var networkToast = Ti.UI.createView({
            left: 0,
            width: "100%",
            height: 40,
            top: -40,
            backgroundColor: "red",
            color: "#333333",
            zIndex: 10
        });
        var networkMessage = Ti.UI.createLabel({
            text: "Keine Internetverbindung",
            color: "#333333"
        });
        networkToast.add(networkMessage);
        Alloy.Globals.currentWindow.add(networkToast);
        networkToast.animate({
            duration: 500,
            top: 0
        }, function() {
            Ti.API.debug("toast animation complete");
            setTimeout(function() {
                networkToast.animate({
                    duration: 500,
                    top: -40
                }, function() {
                    setTimeout(function() {
                        Ti.Network.addEventListener("change", networkChangeEventhandler);
                    }, 1e4);
                });
            }, 3e3);
        });
    }
};

Ti.Network.addEventListener("change", networkChangeEventhandler);

Alloy.Globals.SLIDE_DURATION = 1e3;

Alloy.Globals.SCREEN_WIDTH = Ti.Platform.displayCaps.platformWidth;

Alloy.Globals.SLIDE_IN = Ti.UI.createAnimation({
    left: 0,
    duration: Alloy.Globals.SLIDE_DURATION
});

Alloy.Globals.SLIDE_OUT = Ti.UI.createAnimation({
    left: -1 * Alloy.Globals.SCREEN_WIDTH,
    duration: Alloy.Globals.SLIDE_DURATION
});

Alloy.Globals.loading = Alloy.createWidget("nl.fokkezb.loading");

Alloy.Globals.Windows = function() {
    function _init() {
        _.each(_knownControllerNames, function(element) {
            api["get" + element + "Ctrl"] = function(args) {
                _.isUndefined(controllers[element]) && (controllers[element] = Alloy.createController(element.toLowerCase(), args));
                return controllers[element];
            };
            api["get" + element] = function() {
                return api["get" + element + "Ctrl"]().getView();
            };
        });
    }
    var _knownControllerNames = [ "Splash", "Login", "Home", "CreateAccount", "ResetPassword", "DateDetails", "CreateDate" ];
    var controllers = {};
    var api = {};
    _init();
    return api;
}();

if (Ti.Geolocation.locationServicesEnabled) {
    Ti.Geolocation.purpose = "Get Current Location";
    Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_KILOMETER;
    Ti.Geolocation.distanceFilter = 1e3;
    Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;
    Ti.Geolocation.addEventListener("location", function(e) {
        if (e.error) alert("Error: " + e.error); else {
            Ti.API.info(e.coords);
            Alloy.Globals.currentLocation = e.coords;
        }
    });
} else alert("Please enable location services");

Alloy.createController("index");