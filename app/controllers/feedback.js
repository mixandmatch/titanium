var args = arguments[0] || {};

//Alloy.Globals.GoogleAnalytics.screen('feedback');

function btnSubmit_Click(e) {

	var aUser = Alloy.createModel('User');
	var content = $.txtFeedback.value;
	var rating = $.starwidget.getRating();

	aUser.saveFeedback(Ti.App.Properties.getString("username"), content, rating, {
		success : function(_e) {
			Ti.UI.createAlertDialog({
				message : _e.message,
				ok : 'Danke für Dein Feedback!',
				title : 'MixnMatch'
			}).show();
		},
		error : function(_e) {
			Ti.UI.createAlertDialog({
				message : _e.message,
				ok : 'OK',
				title : 'Fehler'
			}).show();
		}
	});
}

$.starwidget.init();
