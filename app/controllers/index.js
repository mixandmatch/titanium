Alloy.Globals.loading.show();
Alloy.Globals.GoogleAnalytics.trackPageview('index');
//Alloy.Globals.GoogleAnalytics.trackEvent("category", "action", "label", 1);    

if (!Ti.App.Properties.getString("username") || !Ti.App.Properties.getString("password")) {
	Alloy.Globals.loading.hide();
	//no credentials found, request to log in
    Alloy.Globals.Windows.getLogin().open(Alloy.Globals.SLIDE_IN);
}
else {
	//login the user again in background
	var aUser = Alloy.createModel('User');

	aUser.login(Ti.App.Properties.getString("username") , Ti.App.Properties.getString("password") , {
		success: function (_d) {
			var homeWin = Alloy.Globals.Windows.getHome();
			homeWin.open(Alloy.Globals.SLIDE_IN);

			if (Alloy.Globals.NavigationWindow) {
				Alloy.Globals.NavigationWindow.close();
			}

			//Alloy.Globals.NavigationWindow = homeWin;
			Alloy.Globals.loading.hide();
			Alloy.Globals.GoogleAnalytics.trackEvent("login", "auto", "successful");   
		} ,
		error: function (_e) {
			//todo: navigate to login screen
			var winLogin = Alloy.Globals.Windows.getLogin();
			winLogin.open(Alloy.Globals.SLIDE_IN);
			if (Alloy.Globals.NavigationWindow) {
				Alloy.Globals.NavigationWindow.close();
			}

			Alloy.Globals.NavigationWindow = winLogin;
			Alloy.Globals.loading.hide();
			Alloy.Globals.GoogleAnalytics.trackEvent("login", "auto", "error", JSON.stringify(_e));   
		}

	});
}

