"use strict";


Array.prototype.removeAt = function (index) {
	this.splice(index , 1);
};

Alloy.Globals.currentWindow = $.winHome;

var moment = require("moment-with-langs");
var args = arguments [0] || {};


function scrambleWord (s) {
	var word = s.split('') , scram = '';
	while (word.length) {
		scram += word.splice(Math.floor(Math.random()*word.length), 1) [0];
	}
	return scram;
}





function btnAddDate_Click (e) {

	//Alloy.Globals.GoogleAnalytics.trackEvent("contentView" , "btnAddDate_Click");

	//Ti.API.debug("createDateCtrl.getView = " + createDateCtrl.getView());
	//Ti.API.debug("Global NavWindow = " + Alloy.Globals.NavigationWindow.openWindow);
	
	Alloy.Globals.pageFlow.addChild({
        arguments: {} ,
        controller: 'createDate' ,
        navBarHidden: true ,
        direction: {
            top: 0 ,
            left: 1
        }
        //TODO: title neuer Termin
    });
	
	
}

//$.svLocations.addEventListener("scrollEnd" , svLocation_scrollend);

var currentPage = -1;

function svLocation_scrollend (e) {
	
	Alloy.Globals.GoogleAnalytics.trackEvent("contentView" , "svLocation_scrollend");
	
	//TODO: refactor
	loadEvents($.svLocations.views [e.currentPage].office_id);

	if (currentPage != -1) {
		$.pagingControl.children [currentPage].animate({
			backgroundColor: "transparent" ,
			duration: 500
		});
	}

	$.pagingControl.children [e.currentPage].animate({
		backgroundColor: "#F2E394" ,
		duration: 500
	});

	currentPage = e.currentPage;

}

// $.winHome.addEventListener("focus" , function (e) {
	// //$.videoPlayer.play();
// 
	// Ti.API.debug("winHome:focus");
// });

Ti.App.addEventListener("office_found" , function (e) {

	$.svLocations.removeAllChildren();
	var views = [];

	for (var i = 0 ; i < e.offices.length ; i++) {

		if (e.offices [i].name) {

			var view = Ti.UI.createView({
				"class": "titleCtrl" ,
				office_id: e.offices [i].id ,
				width: Ti.UI.SIZE ,
				height: Ti.UI.SIZE
			});

			view.add(Ti.UI.createLabel({
				"class": "titleLocation" ,
				text: e.offices [i].name.toUpperCase() ,
				width: Ti.UI.SIZE ,
				color: "#9CBCD8"

			}));
			views.push(view);

			var pagingControlView = Ti.UI.createView({
				width: Ti.Platform.displayCaps.platformWidth / e.offices.length ,
				height: Ti.UI.FILL
			});
			$.pagingControl.add(pagingControlView);
		}
	}

	$.svLocations.views = views;

	svLocation_scrollend({
		currentPage: 0
	});

	Alloy.Globals.loading.hide();
});

function _init () {

	Alloy.Globals.GoogleAnalytics.trackPageview('contentView');

	$.pulltorefresh.initialize({
		controller: 'homelist' ,

		iosRefreshControl: {
			tintColor: '#FF7A00',
		} ,

		headerPullView: {
			arrow: {
				bottom: 10 ,
				height: 46 ,
				left: 35 ,
				width: 11
			} ,
			border: {
				backgroundColor: '#FF7A00',
			} ,
			lastUpdate: {
				color: "#FF7A00",
			} ,
			status: {
				color: '#FF7A00',
			},
		}
	});

	Alloy.Globals.loading.show();
	var offices = Alloy.Collections.instance("office");
	offices.fetch({
		urlparams: {
			lon: Ti.App.Properties.getObject('currentLocation').longitude ,
			lat: Ti.App.Properties.getObject('currentLocation').latitude ,
			d: 10
		} ,
		success: function (data) {

			Ti.App.fireEvent('office_found' , {
				offices: data.toJSON()
			});
		}
	});
}

Ti.App.addEventListener("updateLunchDates" , function (e) {
	Ti.API.debug("contentView: event updateLunchDates detected, currentPage = " + currentPage);

    //TODO: refactor using homelist/pulltorefresh controller
	loadEvents($.svLocations.views [currentPage].office_id);
});



_init();

