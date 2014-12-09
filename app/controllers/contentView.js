"use strict";
var args = arguments [0] || {};
var dateDataSet = [];
var data;
const BLUR_RADIUS = 1;
var currentPage = -1;
var moment = require("alloy/moment");
var mod = require('bencoding.blur');
var Animator = require('com.animecyc.animator');

Array.prototype.removeAt = function (index) {
	this.splice(index , 1);
};

function scrambleWord (s) {
	var word = s.split('') ,
	    scram = '';
	while (word.length) {
		scram += word.splice(Math.floor(Math.random()*word.length), 1) [0];
	}
	return scram;
}

exports.preHide = function () {

	// Animator.animate($.actionContainer , {
	// duration: 500 ,
	// bottom: -120
	// ,easing: Animator.ELASTIC_IN_OUT
	// });

	$.actionContainer.animate({
		duration: 500 ,
		bottom: -120
	});

	clearInterval(pulsatePlusTimer);
};

exports.postShow = function () {
	// Animator.animate($.actionContainer , {
	// duration: 500 ,
	// bottom: 0
	// ,easing: Animator.ELASTIC_IN_OUT
	// });

	$.actionContainer.animate({
		duration: 500 ,
		bottom: 0
	});

	setInterval(pulsatePlusTimer , 2000);
};

var pulsatePlusTimer = function () {
	Alloy.Globals.Animations.pulsate($.btnAddDate , 0.05);
};

function btnAddDate_Click (e) {

	//Alloy.Globals.GoogleAnalytics.event("user_interaction",
	// "click", "contentView" , "btnAddDate_Click");

	//Ti.API.debug("createDateCtrl.getView = " +
	// createDateCtrl.getView());
	//Ti.API.debug("Global NavWindow = " +
	// Alloy.Globals.NavigationWindow.openWindow);

	Alloy.Globals.pageFlow.addChild({
		arguments: {} ,
		controller: 'createDate' ,
		direction: {
			top: 0 ,
			left: 1
		} ,
		navBar: {
			title: "neuer Termin"
		} ,
		backButton: {
			title: "Übersicht"
		}
		//TODO: title neuer Termin
	});

}

function svLocation_scrollend (e) {

	//Alloy.Globals.GoogleAnalytics.event("user_interaction",
	// "swipe", "contentView" , "svLocation_scrollend");

	if ($.pagingControl.children.length > 0) {

		if (currentPage != -1) {
			$.pagingControl.children [currentPage].animate({
				backgroundColor: "transparent" ,
				duration: 500
			});
		}

		$.pagingControl.children [e.currentPage].animate({
			backgroundColor: "#ff3d39" ,
			duration: 500
		});

		currentPage = e.currentPage;

		Ti.App.fireEvent("officeSelected" , {
			office_id: $.svLocations.views [currentPage].office_id
		});
	}
}

Ti.App.addEventListener("office_found" , function (e) {

	$.svLocations.removeAllChildren();
	var views = [];

	for (var i = 0 ; i < e.offices.length ; i++) {

		if (e.offices [i].name) {

			var view = Alloy.createController("locationPage" , {
				office_id: e.offices [i].id ,
				locationTitle: e.offices [i].name.toUpperCase() ,
				locationImageUrl: e.offices [i].photo.urls.medium_640
			}).getView();
			view.office_id = e.offices [i].id;

			views.push(view);

			var pagingControlView = Ti.UI.createView({
				width: (Ti.Platform.displayCaps.platformWidth / e.offices.length) / ( OS_ANDROID ? Ti.Platform.displayCaps.logicalDensityFactor : 1) ,
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

function fetchOffices () {
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

function _init () {

	if (OS_ANDROID) {
		$.refreshList.addEventListener('refreshing' , function () {
			$.listView.updateListView();
		});
	}

	//Alloy.Globals.GoogleAnalytics.screen('contentView');

	if (Ti.App.Properties.getObject('currentLocation')) {
		fetchOffices();
	}

	Ti.App.addEventListener("setLocation" , function (e) {
		fetchOffices();
	});

}

Ti.App.addEventListener("homelistUpdated" , function (e) {
	if (OS_ANDROID) {
		$.refreshList.setRefreshing(false);
	}
});

function getCurrentOfficeId () {
	return ($.svLocations.views [currentPage] ? $.svLocations.views [currentPage].office_id : "");
}

_init();
