var args = arguments [0] || {};

//TODO init on each focus
Alloy.Globals.currentWindow = $.winCreateAccount;

//var Cloud = require('ti.cloud');

function btnRegisterCreateAccount_Click (e) {

	var aUser = Alloy.createModel('User');
	aUser.login(username , password , {
		success: function (_d) {
			Alloy.createController("login").doLogin($.tfEmailAddress.value , $.tfPassword.value);
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
