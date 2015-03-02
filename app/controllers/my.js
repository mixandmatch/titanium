var args = arguments [0] || {};

exports.preShow = function () {

	Alloy.Globals.GoogleAnalytics.trackScreen({
		screenName: "my"
	});

	var currentUser = Ti.App.Properties.getObject("currentUser");
	if (currentUser != null) {
		$.myImg.image = currentUser.photo.urls.square_75;
		//$.myImgBackground.image =
		// currentUser.photo.urls.large_1024;

		$.lblMyName.text = currentUser.first_name + " " + currentUser.last_name;
	}
};

exports.postShow = function () {

	if (OS_IOS) {
		$.blurview.animate({
			opacity: 1 ,
			duration: 1000 ,
			curve: Ti.UI.ANIMATION_CURVE_EASE_OUT
		});
	}

};

exports.preHide = function () {
	if (OS_IOS) {
		$.blurview.animate({
			opacity: 0 ,
			duration: 1000 ,
			curve: Ti.UI.ANIMATION_CURVE_EASE_OUT
		});
	}
}; 