//var Cloud = require("ti.cloud");
Alloy.Globals.Map = require('ti.map');

//TODO android back button implementation for navigation
// $.container.addEventListener('androidback', function() {
    // if (Alloy.Globals.pageFlow.countPages() > 1) {
        // Alloy.Globals.pageFlow.back();
    // } else {
        // Ti.Android.currentActivity.finish();
    // }
// });

Alloy.Globals.openHomeScreen = function() {
    var winHome = Alloy.createController("home").getView();
    var oldRootWindow = Alloy.Globals.RootWindow;
    Alloy.Globals.RootWindow = winHome;
    winHome.open();
    oldRootWindow.close();
};

Alloy.Globals.Animations = {
	pulsate: function (view, factor) {

		var duration = 500;
		var t1 = Ti.UI.create2DMatrix();
		var scaleUp = function (callback) {

			t1 = t1.scale(1 + factor , 1 + factor);
			var a1 = Ti.UI.createAnimation();
			a1.transform = t1;
			a1.duration = duration;
			a1.autoreverse = true;
            a1.repeat = 10;
			if (callback && typeof callback == "function") {
			    view.animate(a1 , callback);
			}
			else {
			    view.animate(a1);
			}
		};

		var scaleDown = function (callback) {
			t1 = t1.scale(1 - factor , 1 - factor);
			var a1 = Ti.UI.createAnimation();
			a1.transform = t1;
			a1.duration = duration;
			
			if (callback && typeof callback == "function") {
                view.animate(a1 , callback);
            }
            else {
                view.animate(a1);
            }
		};
		
		var scaleOriginal = function () {
            t1 = t1.scale(1, 1);
            var a1 = Ti.UI.createAnimation();
            a1.transform = t1;
            a1.duration = duration;
            if (callback && typeof callback == "function") {
                view.animate(a1 , callback);
            }
            else {
                view.animate(a1);
            }
        };

    	scaleUp();

	}

};

Alloy.Globals.GoogleAnalytics = require('ga');
//Alloy.Globals.GoogleAnalytics.id = 'UA-7879346-4';

Alloy.Globals.jolicode = {};
Alloy.Globals.jolicode.pageflow = {};
Alloy.Globals.jolicode.pageflow.height = Ti.Platform.displayCaps.platformHeight;
Alloy.Globals.jolicode.pageflow.width = Ti.Platform.displayCaps.platformWidth;

if (OS_ANDROID) {
	Alloy.Globals.jolicode.pageflow.height = Ti.Platform.displayCaps.platformHeight / Ti.Platform.displayCaps.logicalDensityFactor;
	Alloy.Globals.jolicode.pageflow.width = Ti.Platform.displayCaps.platformWidth / Ti.Platform.displayCaps.logicalDensityFactor;
}

Ti.App.addEventListener("memorywarning" , function (e) {
	//Alloy.Globals.GoogleAnalytics.event("global" , "memorywarning");
});

if (OS_IOS) {
	Alloy.Globals.Logger = require("yy.logcatcher");
	Alloy.Globals.Logger.addEventListener('error' , function (e) {
		Ti.API.debug("logcatcher logged something.");
		//Alloy.Globals.GoogleAnalytics.event("global" , "error" , "description", JSON.stringify(e));
	});
}
// turn on sync logging
Ti.App.Properties.setBool("Log" , true);
Ti.App.Properties.setBool("LogSync" , true);
Ti.App.Properties.setBool("LogSyncVerbose" , true);

var networkChangeEventhandler = function (e) {
	//Ti.API.debug("network change; currentWindow = " +
	// Alloy.Globals.currentWindow);
	Ti.API.debug(JSON.stringify(e));
	if (!e.online && Alloy.Globals.currentWindow != null) {
		Ti.Network.removeEventListener("change" , networkChangeEventhandler);
		Ti.API.debug("showing network error toast message ...");
		Alloy.Globals.loading.hide();

		//todo: convert to alloy view
		var networkToast = Ti.UI.createView({
			left: 0 ,
			width: "100%" ,
			height: 40 ,
			top: -40 ,
			backgroundColor: "red" ,
			color: "#333333" ,
			zIndex: 10
		});

		var networkMessage = Ti.UI.createLabel({
			text: "Keine Internetverbindung" ,
			color: "#333333"
		});

		networkToast.add(networkMessage);
		Alloy.Globals.currentWindow.add(networkToast);

		networkToast.animate({
			duration: 500 ,
			top: 0
		} , function () {
			Ti.API.debug("toast animation complete");
			setTimeout(function () {
				networkToast.animate({
					duration: 500 ,
					top: -40
				} , function () {
					setTimeout(function () {
						Ti.Network.addEventListener("change" , networkChangeEventhandler);
					} , 10000);
				});
			} , 3000);
		});
	}

};

Ti.Network.addEventListener("change" , networkChangeEventhandler);

Ti.App.addEventListener('timeout' , function (e) {
	Ti.API.debug("timeout event received ...");
	//Alloy.Globals.GoogleAnalytics.event("global" , "network_timeout" , "description", JSON.stringify(e));
	Alloy.Globals.loading.hide();
});

Alloy.Globals.SLIDE_DURATION = 1000;
Alloy.Globals.SCREEN_WIDTH = Ti.Platform.displayCaps.platformWidth;
Alloy.Globals.SLIDE_IN = Ti.UI.createAnimation({
	left: 0 ,
	duration: Alloy.Globals.SLIDE_DURATION
});
Alloy.Globals.SLIDE_OUT = Ti.UI.createAnimation({
	left: -1 * Alloy.Globals.SCREEN_WIDTH ,
	duration: Alloy.Globals.SLIDE_DURATION
});

Alloy.Globals.loading = Alloy.createWidget("nl.fokkezb.loading");

if (Ti.Geolocation.locationServicesEnabled) {

	Ti.Geolocation.purpose = 'Get Current Location';

	if (OS_IOS) {
		Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
	}
	else
	if (OS_ANDROID) {
		Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_HIGH;
	}

	Ti.Geolocation.addEventListener('location' , function (e) {
		if (e.error) {
			alert('Error: ' + e.error);
		}
		else {
			//Ti.API.info(e.coords);
			Ti.App.Properties.setObject('currentLocation' , e.coords);
		}
	});
}
else {
	alert('Please enable location services');
};
