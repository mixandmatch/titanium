var args = arguments [0] || {};

Alloy.Globals.GoogleAnalytics.trackScreen({
	screenName: "Menu"
});

var currentUser = Ti.App.Properties.getObject("currentUser");
if (currentUser != null) {
	$.myImg.image = currentUser.photo.urls.square_75;
}

function myImg_onClick (e) {
	Alloy.Globals.pageFlow.addChild({
		controller: "my" ,
		backButton: {
			left: 10 ,
			title: "Zurück"
		} ,
		navBar: {
			title: "Mein Account"
		} ,
		direction: {
			top: 1 ,
			left: 0
		}
	});

	if (OS_IOS) {
		Alloy.Globals.sidemenu.hideMenuViewController();
	}
	else {
		Alloy.Globals.sidemenu.toggleLeftWindow();
	}
}

function list_OnItemClick (e) {
	var target = e.source.target;
	Ti.API.debug("menu.click on " + e.source.text);
	if (target === "leaderboard" || target === "manual" || target === "feedback" || target === "tc" || target === "imprint") {
		Alloy.Globals.pageFlow.addChild({
			controller: target ,
			backButton: {
				left: 10 ,
				title: "Zurück"
			} ,
			navBar: {
				title: e.source.text
			} ,
			direction: {
				top: 1 ,
				left: 0
			}
		});
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