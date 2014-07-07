var args = arguments[0] || {};

Alloy.Globals.GoogleAnalytics.trackPageview('menu');

function list_OnItemClick(e) {
	var section = $.list.sections[e.sectionIndex];

	var item = section.getItemAt(e.itemIndex);

	if (item.properties.target === "manual") {
		Alloy.createController("manual").getView().open({
			modal : true
		});
		Alloy.Globals.GoogleAnalytics.trackEvent("menu", "registration", "list_OnItemClick", "manual");
	} else if (item.properties.target === "feedback") {
		Alloy.createController("feedback").getView().open({
			modal : true
		});
		Alloy.Globals.GoogleAnalytics.trackEvent("menu", "registration", "list_OnItemClick", "feedback");
	} else if (item.properties.target === "tc") {
		Alloy.createController("tc").getView().open({
			modal : true
		});
		Alloy.Globals.GoogleAnalytics.trackEvent("menu", "registration", "list_OnItemClick", "tc");
	} else if (item.properties.target === "imprint") {
		Alloy.createController("imprint").getView().open({
			modal : true
		});
		Alloy.Globals.GoogleAnalytics.trackEvent("menu", "registration", "list_OnItemClick", "imprint");
	} else if (item.properties.target === "logout") {
		var alert = Titanium.UI.createAlertDialog({
			title : 'Logout',
			message : 'Wirklich abmelden?',
			buttonNames : ['Ja', 'Nein'],
			cancel : 1
		});
		alert.addEventListener('click', function(e) {
			Titanium.API.info('e = ' + JSON.stringify(e));

			switch (e.index) {
				case 0:
					Alloy.Globals.GoogleAnalytics.trackEvent("menu", "registration", "list_OnItemClick", "logout");
					var aUser = Alloy.createModel('User');
					aUser.logout(function() {
					});
					var winLogin = Alloy.Globals.Windows.getLogin();
					winLogin.open(Alloy.Globals.SLIDE_IN);
					if (Alloy.Globals.NavigationWindow) {
						Alloy.Globals.NavigationWindow.close();
					}

					Alloy.Globals.NavigationWindow = winLogin;

					break;
				case 1:
					Alloy.Globals.GoogleAnalytics.trackEvent("menu", "registration", "list_OnItemClick", "logout");
					break;
				default:
					break;

			}
		});
		alert.show();

	}
}
