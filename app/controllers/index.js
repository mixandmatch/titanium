Alloy.Globals.RootWindow = $.winSplash;

if (OS_ANDROID) {
	$.winSplash.addEventListener('open' , function () {
		// Grab the window's action bar instance and call the hide
		// method
		$.winSplash.activity.actionBar.hide();
	});
}

if (!Ti.App.Properties.getString("username") || !Ti.App.Properties.getString("password")) {
	//Alloy.Globals.loading.hide();
	//no credentials found, request to log in
	Alloy.Globals.pageFlow.addChild({
		arguments: {} ,
		controller: 'login' ,
		navBarHidden: true ,
		direction: {
			top: 0 ,
			left: 1
		}
	});

}
else {
	//login the user again in background
	var aUser = Alloy.createModel('User');

	aUser.login(Ti.App.Properties.getString("username") , Ti.App.Properties.getString("password") , {
		success: function (_d) {
		    
		    // Alloy.Globals.pageFlow.addChild({
                // arguments: {} ,
                // controller: 'home' ,
                // navBarHidden: true ,
                // direction: {
                    // top: 0 ,
                    // left: 1
                // }
            // });
            
            var winHome = Alloy.createController("home").getView();
            Alloy.Globals.RootWindow = winHome;
            winHome.open();

			$.winSplash.close();
			Alloy.Globals.GoogleAnalytics.trackEvent("login" , "auto" , "successful");
		} ,
		error: function (_e) {
			//todo: navigate to login screen
			Alloy.Globals.pageFlow.addChild({
				arguments: {} ,
				controller: 'login' ,
				navBarHidden: true ,
				direction: {
					top: 0 ,
					left: 1
				}
			});
			Alloy.Globals.loading.hide();
			Alloy.Globals.GoogleAnalytics.trackEvent("login" , "auto" , "error" , JSON.stringify(_e));
		}

	});
}

// $.winSplash.addEventListener("close" , function () {
    // Alloy.Globals.loading.hide();
    // $.destroy();
// });

$.winSplash.open();