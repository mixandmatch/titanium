var args = arguments[0] || {};

var Cloud = require('ti.cloud');

function btnResetPassword_Click (e) {
	
	Cloud.Users.requestResetPassword({
		email : $.tfEmailAddress.value
	}, function(e) {
		if(e.success == 1){
			Ti.UI.createAlertDialog({
				message: "Wir haben Dir eine E-Mail geschickt!" ,
				ok: 'OK' ,
				title: 'Hinweis'
			}).show();
			
			Alloy.Globals.NavigationWindow.close(winResetPassword);
		} else {
			Ti.UI.createAlertDialog({
				message: e.message ,
				ok: 'OK' ,
				title: 'Fehler'
			}).show();
		}
		
	});
}
