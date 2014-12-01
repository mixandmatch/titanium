"use strict";

//Alloy.Globals.GoogleAnalytics.screen('login');


exports.postHide = function () {
};

exports.preShow = function () {
};

function winLogin_Close (e) {
	Ti.API.debug("winLogin_Close");
	stopVideo();
}

/* Event handlers */
function btnLogin_Click (e) {
	//TODO: model login
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
				message: JSON.stringify(_e) ,
				ok: 'OK' ,
				title: 'Fehler'
			}).show();
		}

	});
}

exports.doLogin = _doLogin;

function btnCreateAccount_Click (e) {
	Alloy.Globals.pageFlow.addChild({
		arguments: {} ,
		controller: 'createAccount' ,
		backButton: {
			left: 10 ,
			width: 50,
			title: "Zurück"
		} ,
		navBar: {
		  height: 100  
		},
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
		top: "160dp" ,
		curve: Ti.UI.ANIMATION_EASE_IN_OUT ,
		duration: 450
	});
}

function vLogin_Click (e) {
	$.tfUsername.blur();
	$.tfPassword.blur();
}
