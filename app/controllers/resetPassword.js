var args = arguments [0] || {};

var Cloud = require('ti.cloud');

exports.postHide = function () {
};

exports.preShow = function () {
	//initControlAnimation();
	$.shadowview.opacity = 0;
	if (OS_IOS) {
		$.blurview.opacity = 0;
	}
	Alloy.Globals.GoogleAnalytics.trackScreen({
		screenName: "Reset Password"
	});
};

function initControlAnimation () {
	// for (var i = 0 ; i < animationChain.length ; i++) {
	// animationChain [i].left =
	// Ti.Platform.displayCaps.platformWidth;
	// animationChain [i].visible = false;
	// }
	// $.bottomNavigation.bottom=-80;
}

exports.postShow = function () {

	$.shadowview.animate({
		opacity: 0.6 ,
		duration: 1000 ,
		curve: Ti.UI.ANIMATION_CURVE_EASE_OUT
	});
	if (OS_IOS) {

		$.blurview.animate({
			opacity: 1 ,
			duration: 1000 ,
			curve: Ti.UI.ANIMATION_CURVE_EASE_OUT
		});
	}
	// $.bottomNavigation.animate({
	// bottom:0,
	// duration:250,
	// curve: Ti.UI.ANIMATION_CURVE_EASE_OUT
	// });
};

function btnResetPassword_Click (e) {

	Alloy.Globals.GoogleAnalytics.trackEvent({
		category: "button" ,
		action: "click" ,
		label: "resetPassword.btnResetPassword"
	});
	
	Cloud.Users.requestResetPassword({
		email: $.tfEmailAddress.value
	} , function (e) {
		if (e.success == 1) {
			Ti.UI.createAlertDialog({
				message: "Wir haben Dir eine E-Mail geschickt!" ,
				ok: 'OK' ,
				title: 'Hinweis'
			}).show();
			//TODO track event

			Alloy.Globals.pageFlow.back();
		}
		else {
			Ti.UI.createAlertDialog({
				message: e.message ,
				ok: 'OK' ,
				title: 'Fehler'
			}).show();
			//TODO track event
		}

	});
}
