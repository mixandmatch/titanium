"use strict";

//var Cloud = require('ti.cloud');

Alloy.Globals.NavigationWindow = $.rootWin;
Alloy.Globals.currentWindow = $.winLogin;

Ti.App.addEventListener("resume", function(e) {
   $.videoPlayer.play(); 
});

function winLogin_Close(e){
    Ti.API.debug("winLogin_Close");
    $.videoPlayer.stop(); 
} 

function winLogin_Open(e){
    Ti.API.debug("winLogin_Open");
    $.videoPlayer.play(); 
} 

/* Event handlers */
function btnLogin_Click (e) {
	//TODO: model login
	Ti.API.debug("btnLogin_Click");
	Alloy.Globals.loading.show();
	_doLogin($.tfUsername.value , $.tfPassword.value);
}

function navigateToHome () {
	
	var homeWin = Alloy.Globals.Windows.getHome();
	homeWin.open(Alloy.Globals.SLIDE_IN);
	$.winLogin.close();
	Alloy.Globals.NavigationWindow.close();
	Alloy.Globals.NavigationWindow = homeWin;
}

function _doLogin (username , password) {

	var aUser = Alloy.createModel('User');
	aUser.login(username , password , {
		success: function (_d) {
		    Alloy.Globals.loading.hide();
			navigateToHome();
		} ,
		error: function (_e) {
			Ti.UI.createAlertDialog({
				message: _e.message ,
				ok: 'OK' ,
				title: 'Fehler'
			}).show();
		}

	});
}

exports.doLogin = _doLogin;

function btnCreateAccount_Click (e) {
	//navigateTo(REGISTER);
	Ti.API.debug("btnCreateAccount_Click");
	var win = Alloy.Globals.Windows.getCreateAccount();
	Alloy.Globals.NavigationWindow.openWindow(win);
}

function btnResetPwd_Click (e) {
	Ti.API.debug("btnResetPwd_Click");
	Alloy.Globals.NavigationWindow.openWindow(Alloy.Globals.Windows.getResetPassword());
}

function svLogin_FocusInput (e) {
	// $.ivLoginLogo.animate({
		// width: "125dp" ,
		// top: "100dp" ,
		// curve: Ti.UI.ANIMATION_EASE_IN_OUT ,
		// duration: 2000
	// });
	$.vLoginForm.animate({
		top: "20dp" ,
		curve: Ti.UI.ANIMATION_EASE_OUT ,
		duration: 350
	});
}

function tfUsername_Return (e) {
	$.tfPassword.focus();
}

function tfPassword_Return (e) {
	$.tfUsername.blur();
	$.tfPassword.blur();
	//TODO: model login
}

function tfLogin_Blur (e) {
	$.vLoginForm.animate({
		top: "120dp" ,
		curve: Ti.UI.ANIMATION_EASE_IN_OUT ,
		duration: 450
	});
}

function vLogin_Click (e) {
	$.tfUsername.blur();
	$.tfPassword.blur();
}

//$.rootWin.open();

var lastX = 0;
var lastY = 0;

// var accelerometerCallback = function (e) {
// 
	// var valueX = Math.min(10 , Math.max(-10 , Math.round(e.x * 10.0)));
	// var valueY = Math.min(10 , Math.max(-10 , Math.round(e.y * 10.0)));
// 
	// // if (Math.abs(lastX - valueX) <= 2 || Math.abs(lastY - valueY) <= 2) {
		// // lastX = valueX;
		// // lastY = valueY;
		// // return;
	// // }
	// $.background.left = valueX-5;
	// $.background.top = valueY-5;
// 
	// lastX = -valueX;
	// lastY = -valueY;
// 
// };
// 
// if (Ti.Platform.model === 'Simulator' || Ti.Platform.model.indexOf('sdk') !== -1) {
	// Ti.API.debug('Accelerometer does not work on a virtual device');
// }
// else {
	// Ti.Accelerometer.addEventListener('update' , accelerometerCallback);
	// if (Ti.Platform.name === 'android') {
		// Ti.Android.currentActivity.addEventListener('pause' , function (e) {
			// Ti.API.info("removing accelerometer callback on pause");
			// Ti.Accelerometer.removeEventListener('update' , accelerometerCallback);
		// });
		// Ti.Android.currentActivity.addEventListener('resume' , function (e) {
			// Ti.API.info("adding accelerometer callback on resume");
			// Ti.Accelerometer.addEventListener('update' , accelerometerCallback);
		// });
	// }
// }