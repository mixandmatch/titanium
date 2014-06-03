var args = arguments [0] || {};

//TODO init on each focus

function _init (_args) {
	Alloy.Globals.currentWindow = $.winCreateAccount;
}

exports.init = _init;

_init(args);

function tfFirstname_Return (e) {
	$.tfLastname.focus();
}

function tfLastname_Return (e) {
	$.tfEmailAddress.focus();
}

function tfEmailAddress_Return (e) {
	$.tfPassword.focus();
}

function tfPassword_Return (e) {
	$.tfConfirmPassword.focus();
}

function btnRegisterCreateAccount_Click (e) {

	var aUser = Alloy.createModel('User');
	aUser.register($.tfEmailAddress.value , $.tfPassword.value, $.tfFirstname.value, $.tfLastname.value , {
		success: function (_d) {
			var homeWin = Alloy.Globals.Windows.getHome();
			homeWin.open(Alloy.Globals.SLIDE_IN);
			Alloy.Globals.NavigationWindow.close();
			Alloy.Globals.NavigationWindow = homeWin;
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
