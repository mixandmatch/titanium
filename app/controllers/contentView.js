"use strict";
var dateDataSet = [];
var data;
const BLUR_RADIUS = 1;
var currentPage = -1;

var mod = require('bencoding.blur');

Array.prototype.removeAt = function (index) {
	this.splice(index , 1);
};

var moment = require("alloy/moment");
var args = arguments [0] || {};

function scrambleWord (s) {
	var word = s.split('') , scram = '';
	while (word.length) {
		scram += word.splice(Math.floor(Math.random()*word.length), 1) [0];
	}
	return scram;
}

function btnAddDate_Click (e) {

	//Alloy.Globals.GoogleAnalytics.event("user_interaction",
	// "click", "contentView" , "btnAddDate_Click");

	//Ti.API.debug("createDateCtrl.getView = " +
	// createDateCtrl.getView());
	//Ti.API.debug("Global NavWindow = " +
	// Alloy.Globals.NavigationWindow.openWindow);

	Alloy.Globals.Animations.pulsate($.btnAddDate , 0.1);

	Alloy.Globals.pageFlow.addChild({
		arguments: {} ,
		controller: 'createDate' ,
		direction: {
			top: 0 ,
			left: 1
		}
		//TODO: title neuer Termin
	});

}

function svLocation_scrollend (e) {

	//Alloy.Globals.GoogleAnalytics.event("user_interaction",
	// "swipe", "contentView" , "svLocation_scrollend");

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
	updateListView();
}

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

function _init () {

	//Alloy.Globals.GoogleAnalytics.screen('contentView');

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
	//loadEvents($.svLocations.views [currentPage].office_id);
});

function getCurrentOfficeId () {
	return ($.svLocations.views [currentPage] ? $.svLocations.views [currentPage].office_id : "");
}

_init();

//IOS:
// var refreshControl = Ti.UI.createRefreshControl({
// tintColor: 'red'
// });
//
// $.listView.refreshControl = refreshControl;
//
// refreshControl.addEventListener('refreshstart' , function
// (e) {
// Ti.API.info('refreshstart');
// loadEvents($.svLocations.views
// [$.svLocations.currentPage].office_id);
// });

//ANDROID
// var swipeRefreshModule =
// require('com.rkam.swiperefreshlayout');
// var swipeRefresh = swipeRefreshModule.createSwipeRefresh({
// view: $.listView,
// height: Ti.UI.FILL,
// width: Ti.UI.FILL
// });
//
// $.lvContainer.add(swipeRefresh);
//
// swipeRefresh.addEventListener('refreshing', function() {
//
// // Put your refresh code here
// alert("refreshing ...");
//
// });
//
// swipeRefresh.setRefreshing(false);

function listView_Delete (e) {
	Ti.API.debug("itemindex = " + e.itemIndex);
	for (var i = 0 ; i < $.listView.sections [0].items.length ; i++) {
		Ti.API.debug("item: " + JSON.stringify($.listView.sections[0].items [i]));
	}
	Ti.API.debug("deleting ..." + JSON.stringify(dateDataSet [e.itemIndex]));

	eventToDelete = Alloy.createModel('Event' , {
		id: dateDataSet [e.itemIndex].eventId
	});

	eventToDelete.destroy();

	dateDataSet.removeAt(e.itemIndex);
}

function listView_Itemclick (e) {

	//Alloy.Globals.GoogleAnalytics.event("user_interaction",
	// "click", "contentView" , "listView_Itemclick");
	var section = $.listView.sections [e.sectionIndex];

	var item = section.getItemAt(e.itemIndex);

	Alloy.Globals.pageFlow.addChild({
		arguments: {
			dateId: item.properties.eventId ,
			date: item.properties.eventDate ,
			officeId: getCurrentOfficeId() ,
			canteen: item.properties.canteen ,
			lunchTag: item.properties.lunchTag
		} ,
		controller: 'eventDetails' ,
		navBar: {
			title: "Details"
		} ,
		direction: {
			top: 0 ,
			left: 1
		}
	});
}

function updateListView () {

	var events = Alloy.Collections.event;

	var office_id = getCurrentOfficeId();
	if (office_id.length == 0) {
		return;
	}

	events.fetch({
		custompath: "byOffice" ,
		urlparams: {
			office_id: office_id
		} ,
		success: function () {

			// if (args.pulltorefresh && api.data) {
			// args.pulltorefresh.stop(api.data.length * 340 , 20);
			// }

			data = [];

			var dateSection = Ti.UI.createListSection({
				headerView: Ti.UI.createView({})
			});

			dateDataSet = [];

			//$.vFirstTimeInstruction.visible = (events.length == 0);
			$.listView.visible = (events.length > 0);

			for (var i = 0 ; i < events.length ; i++) {
				var element = events.at(i);
				var lunchtime = element.get("start_time");

				var diff = moment(lunchtime).diff(moment() , "minutes");

				if (!_.isEmpty(element)) {

					var cf = element.get("custom_fields");
					dateDataSet.push({
						date: {
							text: moment(lunchtime).format("DD.MM.YYYY - HH:mm") + " Uhr"
						} ,
						location: {
							text: element.get("place").name.toUpperCase()
						} ,
						participant1: {
							text: (cf.participants [0] !== undefined ? (diff <= 15 ? cf.participants [0].name : scrambleWord(cf.participants [0].name)) : "unbesetzt")
						} ,
						participant1Image: {
							image: (cf.participants [0] !== undefined ? (diff > 15 ? ( OS_ANDROID ? mod.createBasicBlurView({
								image: cf.participants [0].photo_url ,
								blurRadius: BLUR_RADIUS
							}) : mod.createGPUBlurImageView({
								image: cf.participants [0].photo_url ,
								blur: {
									type: mod.IOS_BLUR ,
									radiusInPixels: BLUR_RADIUS
								}
							})).toImage() : cf.participants [0].photo_url) : "profile.png")
						} ,
						participant2: {
							text: (cf.participants [1] !== undefined ? (diff <= 15 ? cf.participants [1].name : scrambleWord(cf.participants [1].name)) : "unbesetzt")
						} ,
						participant2Image: {
							image: (cf.participants [1] !== undefined ? (diff > 15 ? ( OS_ANDROID ? mod.createBasicBlurView({
								image: cf.participants [1].photo_url ,
								blurRadius: BLUR_RADIUS
							}) : mod.createGPUBlurImageView({
								image: cf.participants [1].photo_url ,
								blur: {
									type: mod.IOS_BLUR ,
									radiusInPixels: BLUR_RADIUS
								}
							})).toImage() : cf.participants [1].photo_url) : "profile.png")
						} ,
						participant3: {
							text: (cf.participants [2] !== undefined ? (diff <= 15 ? cf.participants [2].name : scrambleWord(cf.participants [2].name)) : "unbesetzt")
						} ,
						participant3Image: {
							image: (cf.participants [2] !== undefined ? (diff > 15 ? ( OS_ANDROID ? mod.createBasicBlurView({
								image: cf.participants [2].photo_url ,
								blurRadius: BLUR_RADIUS
							}) : mod.createGPUBlurImageView({
								image: cf.participants [2].photo_url ,
								blur: {
									type: mod.IOS_BLUR ,
									radiusInPixels: BLUR_RADIUS
								}
							})).toImage() : cf.participants [2].photo_url) : "profile.png")
						} ,
						participant4: {
							text: (cf.participants [3] !== undefined ? (diff <= 15 ? cf.participants [3].name : scrambleWord(cf.participants [3].name)) : "unbesetzt")
						} ,
						participant4Image: {
							image: (cf.participants [3] !== undefined ? (diff > 15 ? ( OS_ANDROID ? mod.createBasicBlurView({
								image: cf.participants [3].photo_url ,
								blurRadius: BLUR_RADIUS
							}) : mod.createGPUBlurImageView({
								image: cf.participants [3].photo_url ,
								blur: {
									type: mod.IOS_BLUR ,
									radiusInPixels: BLUR_RADIUS
								}
							})).toImage() : cf.participants [3].photo_url) : "profile.png")
						} ,
						properties: {
							// backgroundColor: "transparent" ,
							// selectedBackgroundColor: "transparent" ,
							//height: LISTITEM_HEIGHT ,
							eventId: element.get("id") ,
							eventDate: element.get("start_time") ,
							lunchTag: element.get("custom_fields").lunchTag ,
							canteen: element.get("place")
						}
					});
				}
			}

			var sections = [];
			$.listView.setSections( []);

			//var height = LISTITEM_HEIGHT * dateDataSet.length;

			data = dateDataSet;

			dateSection.setItems(dateDataSet);
			sections.push(dateSection);

			$.listView.setSections(sections);

			var end = moment();

			//refreshControl.endRefreshing();

			setTimeout(function () {
				Alloy.Globals.loading.hide();
			} , 1000);

		} ,
		error: function (collection , response) {
			Ti.API.error("error " + JSON.stringify(collection));
		}

	});
}