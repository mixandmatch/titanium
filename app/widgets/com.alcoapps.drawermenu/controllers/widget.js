var menuOpen = false;
var duration = 400;
var parent;
var x_touchStart = 0;

var init = function (opts) {
	$.drawermainview.add(opts.mainview);
	$.drawermenuview.add(opts.menuview);
	duration = opts.duration;
	parent = opts.parent;

	setSwipe();
};

var setSwipe = function () {
	// parent.addEventListener('touchstart' , function (e) {
	// x_touchStart = e.x;
	// console.log("touchstart =" + e.x);
	// });
	// parent.addEventListener('touchend' , function (e) {
	// console.log("touchend =" + e.x);
	// if (!menuOpen && x_touchStart <
	// Ti.Platform.displayCaps.platformWidth / 2 && e.x -
	// x_touchStart > (Ti.Platform.displayCaps.platformWidth /
	// 10)) {
	// e.cancelBubble = true;
	// showhidemenu();
	// menuOpen = true;
	// }
	// else
	// if (menuOpen && x_touchStart - e.x >
	// (Ti.Platform.displayCaps.platformWidth / 10)) {
	// e.cancelBubble = true;
	// showhidemenu();
	// menuOpen = false;
	// }
	// });
	parent.addEventListener("swipe" , function (e) {
		console.log("swipe = " + e.direction);
		if (!menuOpen && e.direction == "right") {
			e.cancelBubble = true;
			showhidemenu();
			menuOpen = true;
		}
		else
		if (menuOpen && e.direction == "left") {
			e.cancelBubble = true;
			showhidemenu();
			menuOpen = false;
		} else {
		    $.drawermainview.fireEvent("swipe", e);
		}
	});

	// parent.addEventListener('touchcancel' , function (e) {
		// console.log("touchcancel: " + e.x + ":" + e.y);
	// });
};

var showhidemenu = function () {
	if (menuOpen) {
		moveTo = "0";
		menuOpen = false;
	}
	else {
		moveTo = "250dp";
		menuOpen = true;
	}

	var newWidth = Ti.Platform.displayCaps.platformWidth;
	if (OS_ANDROID)
		newWidth /= Ti.Platform.displayCaps.logicalDensityFactor;
	$.drawermainview.width = newWidth;
	$.drawermainview.animate({
		left: moveTo ,
		curve: Ti.UI.ANIMATION_CURVE_EASE_OUT ,
		duration: duration
	});
};

Ti.Gesture.addEventListener('orientationchange' , function (e) {
	var newWidth;
	newWidth = Ti.Platform.displayCaps.platformWidth;
	if (OS_ANDROID)
		newWidth /= Ti.Platform.displayCaps.logicalDensityFactor;
	$.drawermainview.width = newWidth;
});

exports.init = init;
exports.showhidemenu = showhidemenu;
exports.menuOpen = menuOpen;
exports.setDuration = function (dur) {
	duration = dur;
};
