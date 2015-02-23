var args = arguments [0] || {};

exports.preShow = function () {

	Alloy.Globals.GoogleAnalytics.trackScreen({
		screenName: "my"
	});

	var currentUser = Ti.App.Properties.getObject("currentUser");
	if (currentUser != null) {
		$.myImg.image = currentUser.photo.urls.square_75;
		$.myImgBackground.image = currentUser.photo.urls.large_1024;
		
		$.lblMyName.text = currentUser.first_name + " " + currentUser.last_name;
	}
}; 