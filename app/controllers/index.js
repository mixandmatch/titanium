Alloy.Globals.RootWindow = $.winSplash;
Alloy.Globals.pageFlow = $.pageflow;
$.winSplash.open();
playVideo();

if (OS_ANDROID) {
	$.winSplash.addEventListener('open' , function () {
		// Grab the window's action bar instance and call the hide
		// method
		//$.winSplash.activity.actionBar.hide();
	});
	
    $.videoPlayer.addEventListener("playbackstate", function(e) {
        console.log("playbackstate = " + e.playbackstate);
        
        if (e.playbackstate == Ti.Media.VIDEO_PLAYBACK_STATE_STOPPED) {
            $.videoPlayer.play();
        }
    });
}

function playVideo (callback) {

    $.videoPlayer.play();
    $.videoPlayer.animate({
        opacity: 1 ,
        duration: 250
    } , function () {
        Ti.API.debug("videoPlayer fadeIn complete.");
        $.videoPlayer.opacity = 1;

        Ti.API.debug("videoPlayer playin'");
        if (callback) {
            callback();
        }
    });
}

// Ti.App.Properties.removeProperty("username");
// Ti.App.Properties.removeProperty("password");

if (!Ti.App.Properties.getString("username") || !Ti.App.Properties.getString("password")) {
	Alloy.Globals.loading.hide();
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

			Alloy.Globals.openHomeScreen();

			//Alloy.Globals.GoogleAnalytics.event("login" , "auto" ,
			// "description", "successful");
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
			//Alloy.Globals.GoogleAnalytics.event("login" , "auto" ,
			// "error" , JSON.stringify(_e));
		}

	});
}

// $.winSplash.addEventListener("close" , function () {
// Alloy.Globals.loading.hide();
// $.destroy();
// });

//$.winSplash.open();
