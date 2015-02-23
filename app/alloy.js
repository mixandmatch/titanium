//var Cloud = require("ti.cloud");
Alloy.Globals.Map = require('ti.map');

Alloy.Collections.user = Alloy.createCollection('user');

//TODO android back button implementation for navigation
// $.container.addEventListener('androidback', function() {
// if (Alloy.Globals.pageFlow.countPages() > 1) {
// Alloy.Globals.pageFlow.back();
// } else {
// Ti.Android.currentActivity.finish();
// }
// });

Alloy.Globals.openHomeScreen = function () {

	var winHome = Alloy.createController("home").getView();
	var oldRootWindow = Alloy.Globals.RootWindow;
	Alloy.Globals.RootWindow = winHome;
	winHome.open();
	oldRootWindow.close();
	// if (OS_ANDROID) {
	// oldRootWindow.close();
	// }
};

Alloy.Globals.Animations = {
	pulsate: function (view , factor) {

		var duration = 250;
		var t1 = Ti.UI.create2DMatrix();
		var scaleUp = function (callback) {

			t1 = t1.scale(1 + factor , 1 + factor);
			var a1 = Ti.UI.createAnimation();
			a1.transform = t1;
			a1.duration = duration;
			a1.autoreverse = true;
			a1.repeat = 2;
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
			t1 = t1.scale(1 , 1);
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
//https://github.com/Sitata/titanium-google-analytics
var GA = require('analytics.google');

GA.trackUncaughtExceptions = true;
// ios only
// if you wanted to disable analytics across the entire app,
// you would set optOut to true
GA.optOut = false;
// set dryRun to true if you are debugging and don't want to
// capture data
GA.dryRun = false;
// Data collected using the Google Analytics SDK for Android
// is stored locally before being
// dispatched on a separate thread to Google Analytics.
// By default, data is dispatched from the Google Analytics
// SDK for Android every 30 minutes.
GA.dispatchInterval = 15;
// seconds

if (OS_IOS) {
	GA.trackUncaughtExceptions = true;
	// ios only
}

Alloy.Globals.GoogleAnalytics = GA.getTracker("UA-7879346-4");

Alloy.Globals.jolicode = {};
Alloy.Globals.jolicode.pageflow = {};
Alloy.Globals.jolicode.pageflow.height = Ti.Platform.displayCaps.platformHeight;
Alloy.Globals.jolicode.pageflow.width = Ti.Platform.displayCaps.platformWidth;

if (OS_ANDROID) {
	Alloy.Globals.jolicode.pageflow.height = Ti.Platform.displayCaps.platformHeight / Ti.Platform.displayCaps.logicalDensityFactor;
	Alloy.Globals.jolicode.pageflow.width = Ti.Platform.displayCaps.platformWidth / Ti.Platform.displayCaps.logicalDensityFactor;
}

Ti.App.addEventListener("memorywarning" , function (e) {
	Alloy.Globals.GoogleAnalytics.trackEvent({
		category: "global" ,
		action: "memorywarning"
	});
});

if (OS_IOS) {
	Alloy.Globals.Logger = require("yy.logcatcher");
	Alloy.Globals.Logger.addEventListener('error' , function (e) {
		Ti.API.debug("logcatcher logged something.");
		//Alloy.Globals.GoogleAnalytics.event("global" , "error" ,
		// "description", JSON.stringify(e));
	});

	//cancel all existing notifications and reschedule them
	Titanium.App.iOS.cancelAllLocalNotifications();

	// Check if the device is running iOS 8 or later, before
	// registering for local notifications
	if (Ti.Platform.name == "iPhone OS" && parseInt(Ti.Platform.version.split(".") [0]) >= 8) {
		Ti.App.iOS.registerUserNotificationSettings({
			types: [Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT]
		});
	}

	// The following code snippet schedules an alert to be sent
	// within three seconds
	var notification = Ti.App.iOS.scheduleLocalNotification({
		// Alert will display 'slide to update' instead of 'slide to
		// view'
		// or 'Update' instead of 'Open' in the alert dialog
		alertAction: "open" ,
		// Alert will display the following message
		alertBody: "Jetzt wäre die Gelegenheit, einen Lunchtermin zu vereinbaren!" ,
		date: new Date(2015,1,1,10,0,0) ,
		repeat:"daily"
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

	//Alloy.Globals.GoogleAnalytics.event("global" ,
	// "network_timeout" , "description", JSON.stringify(e));
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
// Alloy.Globals.loading = {
// show: function() {},
// hide: function() {}
// };

if (Ti.Geolocation.locationServicesEnabled) {

	Ti.Geolocation.purpose = 'Get Current Location';

	Ti.Geolocation.distanceFilter = 100;

	if (OS_IOS) {
		Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_NEAREST_TEN_METERS;
	}
	else
	if (OS_ANDROID) {
		Ti.Geolocation.Android.manualMode = false;

		Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_HUNDRED_METERS;
	}

	Ti.Geolocation.addEventListener('location' , function (e) {
		if (!e.success) {
			Ti.API.error(JSON.stringify(e));
		}
		else {
			//Ti.API.info("Geolocation coordinates received = " +
			// JSON.stringify(e.coords));
			Ti.App.Properties.setObject('currentLocation' , e.coords);

			//TODO: check for memory leak
			Ti.App.fireEvent("setLocation" , e);
		}
	});
}
else {
	alert('Please enable location services');
};
