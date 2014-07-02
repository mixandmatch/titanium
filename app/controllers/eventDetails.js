var args = arguments [0] || {};
var moment = require("moment-with-langs");

Alloy.Globals.GoogleAnalytics.trackPageview('eventDetails');

function _init (_args) {

	Ti.API.debug(JSON.stringify(_args));
	Alloy.Globals.currentWindow = $.winDateDetails;
	$.lblDate.text = moment(_args.date).format("DD.MM.YYYY - HH:mm") + " Uhr";
	$.lblLocation.text = _args.canteen.name;
	$.lblLunchTag.text = "#" + _args.lunchTag;

	//$.videoPlayer.url = _args.officeId;
	$.videoPlayer.play();

	var userPosition = Ti.App.Properties.getObject('currentLocation');

	var userLocation = Alloy.Globals.Map.createAnnotation({
		latitude: userPosition.latitude ,
		longitude: userPosition.longitude ,
		title: "Mein Standort" ,
		pincolor: Alloy.Globals.Map.ANNOTATION_RED ,
		myid: 1 // Custom property to uniquely identify this
		// annotation.
	});

	$.mapview.region = {
		latitude: userPosition.latitude ,
		longitude: userPosition.longitude ,
		latitudeDelta: 0.01 ,
		longitudeDelta: 0.01
	};
	$.mapview.addAnnotation(userLocation);

	var canteenLocation = Alloy.Globals.Map.createAnnotation({
		latitude: _args.canteen.longitude ,
		longitude: _args.canteen.latitude ,
		title: _args.canteen.name ,
		pincolor: Alloy.Globals.Map.ANNOTATION_BLUE ,
		myid: 2 // Custom property to uniquely identify this
		// annotation.
	});
	$.mapview.addAnnotation(canteenLocation);

	var route = Alloy.Globals.Map.createRoute({
		points: [{
			latitude: userPosition.longitude ,
			longitude: userPosition.latitude
		} , {
			//sic!
			latitude: _args.canteen.longitude ,
			longitude: _args.canteen.latitude
		}] ,
		color: "blue" ,
		width: 4
	});
	$.mapview.addRoute(route);
}

$.winDateDetails.addEventListener("close" , function (e) {
	$.destroy();
});

$.vInfo.addEventListener("swipe" , function (e) {
	$.vInfo.animate({
		top: -250 ,
		duration: 500 ,
		curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
	});

	$.mapview.animate({
		top: 500 ,
		duration: 500 ,
		curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
	});
});

$.vInfo.addEventListener("touchend" , function (e) {
	$.vInfo.animate({
		top: 0 ,
		duration: 500 ,
		curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
	});
	$.mapview.animate({
		top: "50%" ,
		duration: 500 ,
		curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
	});
});

Ti.Gesture.addEventListener('orientationchange' , function (e) {

	Alloy.Globals.GoogleAnalytics.trackEvent("eventDetails" , "orientationchange");
	if (e.orientation === Titanium.UI.LANDSCAPE_LEFT || e.orientation === Ti.UI.LANDSCAPE_RIGHT) {
		//todo: hide map, location and date, zoom meeting number
		$.vInfo.animate({
			top: 0 ,
			duration: 500 ,
			curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
		});

		$.mapview.animate({
			top: "100%" ,
			duration: 500 ,
			curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
		});
		$.vInfo.height = "100%";
		$.vInfo.width = "100%";
		$.shortInfo.hide();
		$.winDateDetails.hideNavBar();
		$.vInfo.backgroundColor = "#FFFFFF";
		$.lblLunchTag.animate({
			transform: Ti.UI.create2DMatrix().rotate(90).scale(2) ,
			duration: 500 ,
			top: "40%"
		});

	}
	else {
		$.vInfo.animate({
			top: 0 ,
			duration: 500 ,
			curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
		});
		$.mapview.animate({
			top: "50%" ,
			duration: 500 ,
			curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT
		});
		$.vInfo.height = "50%";
		$.vInfo.width = "100%";
		$.shortInfo.show();
		$.winDateDetails.showNavBar();
		$.vInfo.backgroundColor = "#aaFFFFFF";
		$.lblLunchTag.animate({
			transform: Ti.UI.create2DMatrix().rotate(0).scale(1) ,
			duration: 500 ,
			top: 100
		});
	}
});

exports.init = _init;
