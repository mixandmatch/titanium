//var PixateFramework = require('com.pixate.freestyle');
//Ti.API.info("module is => " + PixateFramework);

// PixateFramework.styleSheetFromFilePathWithOrigin({
// filename:
// '/Users/treinberger/Documents/Titanium_Studio_Workspace/demo2/app/assets/default.css',
// origin: 0,
// monitor: true
// });

var Cloud = require("ti.cloud");
Alloy.Globals.Map = require('ti.map');

// turn on sync logging
Ti.App.Properties.setBool("Log" , true);
Ti.App.Properties.setBool("LogSync" , true);
Ti.App.Properties.setBool("LogSyncVerbose" , true);

Titanium.Network.registerForPushNotifications({
	types: [Titanium.Network.NOTIFICATION_TYPE_BADGE , Titanium.Network.NOTIFICATION_TYPE_ALERT] ,
	success: function (e) {
		Alloy.Globals.deviceToken = e.deviceToken;

		Ti.API.info("Push notification device token is: " + e.deviceToken);
		Ti.API.info("Push notification types: " + Titanium.Network.remoteNotificationTypes);
		Ti.API.info("Push notification enabled: " + Titanium.Network.remoteNotificationsEnabled);
	} ,
	error: function (e) {
		Ti.API.info("Error during registration: " + e.error);
	} ,
	callback: function (e) {
		// called when a push notification is received.
		//Titanium.Media.vibrate();
		alert(e.data);
		var data = JSON.parse(e.data);
		var badge = data.badge;
		if (badge > 0) {
			Titanium.UI.iPhone.appBadge = badge;
		}
		var message = data.message;
		if (message != '') {
			var my_alert = Ti.UI.createAlertDialog({
				title: '' ,
				message: message
			});
			my_alert.show();
		}
	}

});

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

// Ti.App.addEventListener('timeout' , function (e) {
// //Ti.API.debug("timeout received; currentWindow = " +
// // Alloy.Globals.currentWindow);
// if (Alloy.Globals.currentWindow != null) {
// Alloy.Globals.currentWindow.add(Ti.UI.createView({
// left: 100 ,
// top: 100 ,
// width: 200 ,
// height: 200 ,
// color: "#ffffff" ,
// backgroundColor: "red" ,
// zIndex: 10
// }));
// }
// Alloy.Globals.loading.hide();
// });

// var server = require('com.obscure.titouchdb'),
// db =
// server.databaseManager.createDatabaseNamed(Alloy.CFG.mixnmatch_cdb_name
// || 'mixnmatch');
//
// db.defineFilter('books_only', function(doc,req) {
// return doc.modelname === "book";
// });
//
// if (Alloy.CFG.remote_couchdb_server) {
// var repls =
// db.replicateWithURL(Alloy.CFG.remote_couchdb_server);
// var pull = repls[0], push = repls[1];
//
// pull.continuous = true;
// pull.addEventListener('change', function(e) {
// Ti.API.info(String.format("pull: running: %d, total: %d,
// completed: %d", !!pull.running, pull.total,
// pull.completed));
// // if (pull.total > 0 && pull.completed === pull.total) {
// Ti.App.fireEvent('books:update_from_server');
// // }
// });
// pull.start();
//
// push.continuous = true;
// push.filter = 'books_only';
//
// push.addEventListener('change', function(e) {
// Ti.API.info(String.format("push: running: %d, total: %d,
// completed: %d", !!pull.running, pull.total,
// pull.completed));
// });
// push.start();
//
// // hold references to the replications
// Alloy.Globals.replications = {
// push: push,
// pull: pull
// };
//
// // restart replication on app resume
// Ti.App.addEventListener('resume', function() {
// Alloy.Globals.replications.push.start();
// Alloy.Globals.replications.pull.start();
// });
// }

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

Alloy.Globals.Windows = function () {

	var minifyFirstLetter = function (string) {
		return string.charAt(0).toLowerCase() + string.slice(1);
	};

	var _knownControllerNames = ["Splash" , "Login" , "Home" , "CreateAccount" , "ResetPassword" , "EventDetails" , "CreateDate" , "Tc"];

	var controllers = {};
	var windows = {};
	var api = {};

	function _init () {
		_.each(_knownControllerNames , function (element , index , list) {
			api ["get" + element + "Ctrl"] = function (args) {
				if (_.isUndefined(controllers [element])) {
					controllers [element] = Alloy.createController(minifyFirstLetter(element) , args);

				}
				return controllers [element];
			};

			api ["get" + element] = function () {
				return api["get" + element + "Ctrl"]().getView();
			};
		});
	}

	_init();
	return api;
}();

if (Ti.Geolocation.locationServicesEnabled) {
	Ti.Geolocation.purpose = 'Get Current Location';
	Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_KILOMETER;
	Ti.Geolocation.distanceFilter = 1000;
	Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;

	Ti.Geolocation.addEventListener('location' , function (e) {
		if (e.error) {
			alert('Error: ' + e.error);
		}
		else {
			Ti.API.info(e.coords);
			Ti.App.Properties.setObject('currentLocation' , e.coords);
		}
	});
}
else {
	alert('Please enable location services');
};

// register a background service. this JS will run when the
// app is backgrounded but screen is OFF!!!
var service = Ti.App.iOS.registerBackgroundService({
	url: 'bg.js'
});

Ti.API.info("registered background service = " + service);

// listen for a local notification event
Ti.App.iOS.addEventListener('notification' , function (e) {
	Ti.API.info("local notification received: " + JSON.stringify(e));
});

// fired when an app resumes for suspension
Ti.App.addEventListener('resume' , function (e) {
	Ti.API.info("app is resuming from the background");
});
Ti.App.addEventListener('resumed' , function (e) {
	Ti.API.info("app has resumed from the background");
});

//This event determines that the app it was just paused
Ti.App.addEventListener('pause' , function (e) {
	Ti.API.info("app was paused from the foreground");
}); 