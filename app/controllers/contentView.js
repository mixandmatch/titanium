"use strict";
var args = arguments [0] || {};
var dateDataSet = [];
var data;
const BLUR_RADIUS = 1;
var currentPage = -1;
var moment = require("alloy/moment");
var mod = require('bencoding.blur');
//var Animator = require('com.animecyc.animator');
var pulsatePlusTimer = null;

Array.prototype.removeAt = function (index) {
	this.splice(index , 1);
};

exports.preHide = function () {

	$.actionContainer.animate({
		duration: 500 ,
		bottom: -120
	});

	clearInterval(pulsatePlusTimer);
};

exports.postHide = function () {
    Ti.App.removeEventListener("office_found" , officeFoundEventHandler);
    Ti.App.removeEventListener("setLocation" , fetchOffices);
};

exports.postShow = function () {

	$.actionContainer.animate({
		duration: 500 ,
		bottom: 0
	});

	pulsatePlusTimer = setInterval(pulsatePlusFunction , 2000);
};

exports.preShow = function () {
	Ti.App.addEventListener("office_found" , officeFoundEventHandler);

    if (OS_ANDROID) {
        $.refreshList.addEventListener('refreshing' , function () {
            $.listView.updateListView();
        });
    }

    if (Ti.App.Properties.getObject('currentLocation')) {
        fetchOffices();
    }

    Ti.App.addEventListener("homelistUpdated" , function (e) {
        if (OS_ANDROID) {
            $.refreshList.setRefreshing(false);
        }
    });

    Ti.App.addEventListener("setLocation" , fetchOffices);
    
	Alloy.Globals.GoogleAnalytics.trackScreen("contentView");
};

pulsatePlusFunction = function () {
	Alloy.Globals.Animations.pulsate($.btnAddDate , 0.05);
};

function btnAddDate_Click (e) {

	Alloy.Globals.GoogleAnalytics.trackEvent({
		category: "button" ,
		action: "click" ,
		label: "btnAddDate"
	});

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
	});

}

function svLocation_scrollend (e) {

	Alloy.Globals.GoogleAnalytics.trackEvent({
		category: "ScrollView" ,
		action: "scrollend" ,
		label: "contentView.svLocation"
	});

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

var officeFoundEventHandler = function (e) {

	$.svLocations.removeAllChildren();
	var views = [];
	
	var offices = JSON.parse(e.offices);

	for (var i = 0 ; i < offices.length ; i++) {

		if (offices [i].name) {

			var view = Alloy.createController("locationPage" , {
				office_id: offices [i].id ,
				locationTitle: offices [i].name.toUpperCase() ,
				locationImageUrl: offices [i].photo.urls.medium_640
			}).getView();
			view.office_id = offices [i].id;

			views.push(view);

			var pagingControlView = Ti.UI.createView({
				width: (Ti.Platform.displayCaps.platformWidth / offices.length) / ( OS_ANDROID ? Ti.Platform.displayCaps.logicalDensityFactor : 1) ,
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
};

function fetchOffices () {

	var officesFromCache;

	if ( ( officesFromCache = Ti.App.Properties.getString("offices" , null)) != null) {
		Ti.API.debug("loading offices from cache");
		Ti.App.fireEvent('office_found' , {
			offices: officesFromCache
		});
	}

	Alloy.Globals.loading.show();
	var offices = Alloy.Collections.instance("office");
	offices.fetch({
		urlparams: {
			lon: Ti.App.Properties.getObject('currentLocation').longitude ,
			lat: Ti.App.Properties.getObject('currentLocation').latitude ,
			d: 10
		} ,
		success: function (data) {

			//update only if data changed
			Ti.API.debug("received up-to-date offices from server; officesFromCache = " + officesFromCache);
			Ti.API.debug("offices from server = " + JSON.stringify(data));
			if (officesFromCache == null || (officesFromCache != null && officesFromCache !== JSON.stringify(data))) {
				Ti.API.debug("syncing offices data with caching and updating UI");
				Ti.App.Properties.setString("offices" , JSON.stringify(data));
				Ti.App.fireEvent('office_found' , {
					offices: JSON.stringify(data)
				});
			}
		}

	});
}

function getCurrentOfficeId () {
	return ($.svLocations.views [currentPage] ? $.svLocations.views [currentPage].office_id : "");
}

