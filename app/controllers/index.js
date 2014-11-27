Alloy.Globals.RootWindow = $.winSplash;
Alloy.Globals.pageFlow = $.pageflow;

var vOverlay = Ti.UI.createView(
    {
        zIndex:10,
        top:0,
        left:0,
        bottom:0,
        right:0,
        backgroundColor:"#000000",
        opacity:1
    }
);

$.winSplash.open();

if (OS_ANDROID) {
	$.winSplash.addEventListener('open' , function () {
		// Grab the window's action bar instance and call the hide
		// method
		$.winSplash.activity.actionBar.hide();
	});
	
	$.winSplash.activity.onResume = function(e) {
	    playVideo();
	};
	
	$.winSplash.activity.onPause = function(e) {
        
    };

	$.videoPlayer.addEventListener("playbackstate" , function (e) {
		console.log("playbackstate = " + JSON.stringify(e));
		if (e.playbackState === Titanium.Media.VIDEO_PLAYBACK_STATE_STOPPED) {
			$.videoPlayer.play();
		}
	});
}

function playVideo (callback) {

    $.winSplash.add(vOverlay);
    
	$.videoPlayer.play();
	
	vOverlay.animate({
        opacity: 0 ,
        duration: 2000
    } , function () {
        Ti.API.debug("videoPlayer fadeIn complete.");
        vOverlay.opacity = 0;
        $.winSplash.remove(vOverlay);
    });
}

Ti.App.Properties.removeProperty("username");
Ti.App.Properties.removeProperty("password");

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
