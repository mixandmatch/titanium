var args = arguments [0] || {};

//Alloy.Globals.GoogleAnalytics.screen('menu');

function list_OnItemClick (e) {

	Ti.API.debug("List_OnItemClick: " + JSON.stringify(e));

	var target = e.source.target;

	if (target === "manual" || target === "feedback" || target === "tc" || target === "imprint") {
		Alloy.Globals.pageFlow.addChild({
			controller: target ,
			backButton: {
				left: 10 ,
				title: "Zurück"
			} ,
			navBar: {
				title: "Anleitung"
			} ,
			direction: {
				top: 1 ,
				left: 0
			}
		});

		//Alloy.Globals.GoogleAnalytics.event("menu" , "registration"
		// , "list_OnItemClick" , "manual");
	}
	else
	if (target === "logout") {
		var alert = Titanium.UI.createAlertDialog({
			title: 'Logout' ,
			message: 'Wirklich abmelden?' ,
			buttonNames: ['Ja' , 'Nein'] ,
			cancel: 1
		});
		alert.addEventListener('click' , function (e2) {

			switch (e2.index) {
				case 0:
					//Alloy.Globals.GoogleAnalytics.event("menu" , "registration"
					// , "list_OnItemClick" , "logout");
					var aUser = Alloy.createModel('User');
					aUser.logout(function () {
					});

					//TODO refactor
					var winLogin = Alloy.Globals.Windows.getLogin();
					winLogin.open(Alloy.Globals.SLIDE_IN);
					if (Alloy.Globals.NavigationWindow) {
						Alloy.Globals.NavigationWindow.close();
					}

					Alloy.Globals.NavigationWindow = winLogin;

					break;
				case 1:
					//Alloy.Globals.GoogleAnalytics.event("menu" , "registration"
					// , "list_OnItemClick" , "logout");
					break;
				default:
					break;

			}
		});
		alert.show();
	}

	if (OS_IOS) {
		Alloy.Globals.sidemenu.hideMenuViewController();
	}
	else {
		Alloy.Globals.sidemenu.toggleLeftWindow();
	}
}