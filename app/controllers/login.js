"use strict";

//
//
//
// Alloy.Globals.NavigationWindow = $.winLogin;
// Alloy.Globals.currentWindow = $.winLogin;
//
// Alloy.Globals.GoogleAnalytics.trackPageview('login');
//
Ti.App.addEventListener("resume" , function (e) {
	playVideo();
});

function winLogin_Close (e) {
	Ti.API.debug("winLogin_Close");
	stopVideo();
}

//
$.winLogin.addEventListener("close" , function (e) {
	$.destroy();
});

function stopVideo (callback) {
	$.videoPlayer.animate({
		opacity: 0 ,
		duration: 250
	} , function () {
		$.videoPlayer.opacity = 0;
		$.videoPlayer.stop();
		if (callback) {
			callback();
		}
	});
}

function playVideo (callback) {

	$.videoPlayer.play();
	$.videoPlayer.animate({
		opacity: 1 ,
		duration: 250
	} , function () {
		Ti.API.debug("videoPlayer fadeIn complete.");
		$.videoPlayer.opacity = 1;

		Ti.API.debug("videoPlayer playin'");
		if (callback) {
			callback();
		}
	});
}

$.videoPlayer.addEventListener("load" , function (e) {
	Ti.API.debug("video loaded");
	Ti.API.debug(JSON.stringify(e));
});

function winLogin_Open (e) {
	// Ti.API.debug("winLogin_Open");
	// //playVideo();
}

$.winLogin.addEventListener("focus" , function (e) {
	Ti.API.debug("winLogin:focus");
	Ti.API.debug("videoPlayer.opacity = " + $.videoPlayer.opacity);
	playVideo();
});

/* Event handlers */
function btnLogin_Click (e) {
	//TODO: model login
	Ti.API.debug("btnLogin_Click");
	Alloy.Globals.loading.show();
	_doLogin($.tfUsername.value , $.tfPassword.value);
}

function navigateToHome () {

	stopVideo(function () {

		Alloy.Globals.pageFlow.addChild({
			arguments: {} ,
			controller: 'home' ,
			backButton: {
				left: 10 ,
				title: "Zurück"
			} ,
			direction: {
				top: 0 ,
				left: 1
			}
		});
	});
}

function _doLogin (username , password) {

	var aUser = Alloy.createModel('User');
	aUser.login(username , password , {
		success: function (_d) {
			Ti.App.Properties.setString("username" , username);
			Ti.App.Properties.setString("password" , password);
			Alloy.Globals.loading.hide();
			navigateToHome();
		} ,
		error: function (_e) {
			Alloy.Globals.loading.hide();
			Ti.UI.createAlertDialog({
				message: JSON.stringify(_e) ,
				ok: 'OK' ,
				title: 'Fehler'
			}).show();
		}

	});
}

exports.doLogin = _doLogin;

function btnCreateAccount_Click (e) {
	stopVideo(function () {
		Ti.API.debug("btnCreateAccount_Click");
		Alloy.Globals.pageFlow.addChild({
			arguments: {} ,
			controller: 'createAccount' ,
			backButton: {
				left: 10 ,
				title: "Zurück"
			} ,
			direction: {
				top: 0 ,
				left: 1
			}
		});
	});
}

function btnResetPwd_Click (e) {
	stopVideo(function () {
		Ti.API.debug("btnResetPwd_Click");
		Alloy.Globals.pageFlow.addChild({
			arguments: {} ,
			controller: 'resetPassword' ,
			backButton: {
				left: 10 ,
				title: "Zurück"
			} ,
			direction: {
				top: 0 ,
				left: 1
			}
		});
	});
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
		top: "160dp" ,
		curve: Ti.UI.ANIMATION_EASE_IN_OUT ,
		duration: 450
	});
}

function vLogin_Click (e) {
	$.tfUsername.blur();
	$.tfPassword.blur();
}