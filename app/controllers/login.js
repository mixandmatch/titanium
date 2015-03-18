"use strict";
var animationChain = [$.tfUsernameWrapper , $.btnLogin];

//Alloy.Globals.GoogleAnalytics.screen('login');
var inputControlsPaddingLeft = 15;

exports.postHide = function () {
};

exports.preShow = function () {
	initControlAnimation();
};

function initControlAnimation () {
	for (var i = 0 ; i < animationChain.length ; i++) {
		animationChain [i].left = Ti.Platform.displayCaps.platformWidth;
		animationChain [i].visible = false;
	}
	$.bottomNavigation.bottom = -80;
}

exports.postShow = function () {
	animateControls("IN");

	$.bottomNavigation.animate({
		bottom: 0 ,
		duration: 250 ,
		curve: Ti.UI.ANIMATION_CURVE_EASE_OUT
	});
};

exports.preHide = function () {
	animateControls("OUT");

	$.bottomNavigation.animate({
		bottom: -80 ,
		duration: 250 ,
		curve: Ti.UI.ANIMATION_CURVE_EASE_OUT
	});
};

function animateControls (direction) {

	var timeout = 0;
	var timeOutInterval = 100;
	var targetLeft = (direction === "IN" ? inputControlsPaddingLeft : Ti.Platform.displayCaps.platformWidth);

	_.each(animationChain , function (value) {
		setTimeout(function () {

			if (direction === "IN") {
				value.visible = true;
			}

			value.animate({
				left: targetLeft ,
				duration: 150 ,
				curve: Ti.UI.ANIMATION_CURVE_EASE_OUT
			} , function () {

				if (direction === "OUT") {
					value.visible = false;
				}
			});
		} , timeout);
		timeout += timeOutInterval;
	});
}

function winLogin_Close (e) {
	Ti.API.debug("winLogin_Close");
	stopVideo();
}

/* Event handlers */
function btnLogin_Click (e) {

	Alloy.Globals.GoogleAnalytics.trackEvent({
		category: "button" ,
		action: "click" ,
		label: "login.btnLogin"
	});
	Ti.API.debug("btnLogin_Click");
	Alloy.Globals.loading.show();
	_doLogin($.tfUsername.value , $.tfPassword.value);
}

function _doLogin (username , password) {

	var aUser = Alloy.createModel('User');
	aUser.login(username , password , {
		success: function (_d) {
			Ti.App.Properties.setString("username" , username);
			Ti.App.Properties.setString("password" , password);
			Alloy.Globals.loading.hide();
			Alloy.Globals.openHomeScreen();
		} ,
		error: function (_e) {
			Alloy.Globals.loading.hide();
			Ti.UI.createAlertDialog({
				message: "Ungültiger Benutzername oder Kennwort." ,
				ok: 'OK' ,
				title: 'Fehler'
			}).show();
		}

	});
}

exports.doLogin = _doLogin;

function btnCreateAccount_Click (e) {
	Alloy.Globals.GoogleAnalytics.trackEvent({
		category: "button" ,
		action: "click" ,
		label: "login.btnCreateAccount"
	});

	Alloy.Globals.pageFlow.addChild({
		arguments: {} ,
		controller: 'createAccount' ,
		backButton: {
			title: "Zurück"
		} ,
		navBar: {
			height: 100
		} ,
		direction: {
			top: 0 ,
			left: 1
		}
	});
}

function btnResetPwd_Click (e) {

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
}

function svLogin_FocusInput (e) {

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
		top: "200dp" ,
		curve: Ti.UI.ANIMATION_EASE_IN_OUT ,
		duration: 450
	});
}

function vLogin_Click (e) {
	$.tfUsername.blur();
	$.tfPassword.blur();
}
