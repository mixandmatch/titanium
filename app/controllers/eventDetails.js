var args = arguments [0] || {};
var moment = require("alloy/moment");
Ti.API.info("eventDetails controller created");
//Alloy.Globals.GoogleAnalytics.screen('eventDetails');

function closeWindow (e) {

	var a = Ti.UI.createAnimation({
		transform: Ti.UI.create2DMatrix().scale(1.1) ,
		duration: 200
	});

	$.winDateDetails.animate(a);

	a.addEventListener('complete' , function () {
		var b = Ti.UI.createAnimation({
			transform: Ti.UI.create2DMatrix().scale(0) ,
			duration: 200,
		});

		b.addEventListener("complete" , function () {
			$.winDateDetails.close();
		});

		$.winDateDetails.animate(b);
	});
}

var upscaleAnimation = Ti.UI.createAnimation({
	transform: Ti.UI.create2DMatrix().scale(1.1) ,
	duration: 200
});

function animateOpen () {
	$.winDateDetails.animate(upscaleAnimation);
}

function _init () {

	if (OS_IOS) {
		$.winDateDetails.transform = Titanium.UI.create2DMatrix().scale(0);

		upscaleAnimation.addEventListener('complete' , function () {
			$.winDateDetails.animate({
				transform: Ti.UI.create2DMatrix() ,
				duration: 200
			});
		});
	}

	if (OS_ANDROID) {
		var rc = Alloy.Globals.Map.isGooglePlayServicesAvailable();
		switch (rc) {
			case Alloy.Globals.Map.SUCCESS:
				Ti.API.info('Google Play services is installed.');
				break;
			case Alloy.Globals.Map.SERVICE_MISSING:
				alert('Google Play services is missing. Please install Google Play services from the Google Play store.');
				break;
			case Alloy.Globals.Map.SERVICE_VERSION_UPDATE_REQUIRED:
				alert('Google Play services is out of date. Please update Google Play services.');
				break;
			case Alloy.Globals.Map.SERVICE_DISABLED:
				alert('Google Play services is disabled. Please enable Google Play services.');
				break;
			case Alloy.Globals.Map.SERVICE_INVALID:
				alert('Google Play services cannot be authenticated. Reinstall Google Play services.');
				break;
			default:
				alert('Unknown error.');
				break;
		}
	}

	var _args = args;

	var canteenLocation = Alloy.Globals.Map.createAnnotation({
		latitude: _args.canteen.latitude ,
		longitude: _args.canteen.longitude ,
		title: _args.canteen.name ,
		pincolor: Alloy.Globals.Map.ANNOTATION_BLUE ,
		rightButton: Titanium.UI.iPhone.SystemButton.INFO_DARK
	});

	var mapview = Alloy.Globals.Map.createView({
		mapType: Alloy.Globals.Map.NORMAL_TYPE ,
		region: {
			latitude: _args.canteen.latitude ,
			longitude: _args.canteen.longitude ,
			latitudeDelta: 0.01 ,
			longitudeDelta: 0.01
		} ,
		animate: true ,
		regionFit: true ,
		userLocation: true ,
		annotations: [canteenLocation]
	});

	$.mapwrapper.add(mapview);

	mapview.selectAnnotation(canteenLocation);

	mapview.addEventListener('click' , function (e) {
		Ti.API.info(e.type);
		Ti.API.info(JSON.stringify(e.clicksource));

		if (e.type === "click" && e.clicksource === "rightButton") {
			//TODO: show alert box to start navigation app
			var alert = Titanium.UI.createAlertDialog({
				title: 'Navigation' ,
				message: 'Wollen Sie zur Karten-App wechseln?' ,
				buttonNames: ['Ja' , 'Nein'] ,
				cancel: 1
			});
			alert.addEventListener('click' , function (e2) {

				var userPosition = Ti.App.Properties.getObject('currentLocation');
				switch (e2.index) {
					case 0:
						//TODO change to nav app
						if (OS_IOS) {
							Ti.Platform.openURL("http://maps.apple.com/?daddr=" + _args.canteen.latitude + "," + _args.canteen.longitude + "&saddr=" + userPosition.latitude + "," + userPosition.longitude);
						}
						else
						if (OS_ANDROID) {
							var mapIntent = Ti.Android.createIntent({
								action: Ti.Android.ACTION_VIEW ,
								data: "http://maps.google.com/maps?ll=" + _args.canteen.latitude + "," + _args.canteen.longitude
							});
							Ti.Android.currentActivity.startActivity(mapIntent);
						}
						break;
					default:
						break;

				}
			});
			alert.show();
		}
	});

	Ti.API.debug(JSON.stringify(_args));
	Alloy.Globals.currentWindow = $.winDateDetails;
	$.lblDate.text = moment(_args.date).format("DD.MM.YYYY - HH:mm") + " Uhr";
	$.lblLocation.text = _args.canteen.name;
	$.lblLunchTag.text = "#" + _args.lunchTag;
}

$.winDateDetails.addEventListener("close" , function (e) {
	$.destroy();
});

// $.vInfo.addEventListener("swipe" , function (e) {
// $.vInfo.animate({
// top: -250 ,
// duration: 500 ,
// curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
// });
//
// $.mapwrapper.animate({
// top: 500 ,
// duration: 500 ,
// curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
// });
// });

// $.vInfo.addEventListener("touchend" , function (e) {
// $.vInfo.animate({
// top: 44 ,
// duration: 500 ,
// curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
// });
// $.mapwrapper.animate({
// top: "50%" ,
// duration: 500 ,
// curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
// });
// });

Ti.Gesture.addEventListener('orientationchange' , function (e) {

	//Alloy.Globals.GoogleAnalytics.event("eventDetails" ,
	// "orientationchange");
	if (e.orientation === Titanium.UI.LANDSCAPE_LEFT || e.orientation === Ti.UI.LANDSCAPE_RIGHT) {
		//todo: hide map, location and date, zoom meeting number
		// $.vInfo.animate({
		// top: 0 ,
		// duration: 500 ,
		// curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
		// });

		$.mapwrapper.animate({
			top: "100%" ,
			duration: 500 ,
			curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
		});
		// $.vInfo.height = "100%";
		// $.vInfo.width = "100%";
		$.shortInfo.hide();
		if (OS_IOS) {
			$.winDateDetails.hideNavBar();
		}
		//$.vInfo.backgroundColor = "#FFFFFF";
		$.lblLunchTag.animate({
			transform: Ti.UI.create2DMatrix().rotate(90).scale(2) ,
			duration: 500 ,
			top: "40%"
		});

	}
	else {
		// $.vInfo.animate({
		// top: 44 ,
		// duration: 500 ,
		// curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
		// });
		$.mapwrapper.animate({
			top: "55%" ,
			duration: 500 ,
			curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
		});
		// $.vInfo.height = "50%";
		// $.vInfo.width = "100%";
		$.shortInfo.show();
		if (OS_IOS) {
			$.winDateDetails.showNavBar();
		}
		//$.vInfo.backgroundColor = "#aaFFFFFF";
		$.lblLunchTag.animate({
			transform: Ti.UI.create2DMatrix().scale(1) ,
			duration: 500 ,
			top: 100
		});
	}
});

exports.init = _init;

_init();
