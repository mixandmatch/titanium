"use strict";

Array.prototype.removeAt = function (index) {
	this.splice(index , 1);
};

Alloy.Globals.currentWindow = $.winHome;

var moment = require("moment-with-langs");
var args = arguments [0] || {};
//var dateDataSet = new Array ();
var dateDataSet = [];
const LISTITEM_HEIGHT = 320;

var refreshControl = Ti.UI.createRefreshControl({
	tintColor: 'red'
});

$.listView.refreshControl = refreshControl;

refreshControl.addEventListener('refreshstart' , function (e) {
	Ti.API.info('refreshstart');
	loadEvents();
});

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

	$.listView.height -= LISTITEM_HEIGHT;
}

function listView_Itemclick (e) {
	//TODO: open detail window
	Ti.API.debug("$.listView_ItemClick");

	var section = $.listView.sections [e.sectionIndex];

	var item = section.getItemAt(e.itemIndex);

	Ti.API.debug(JSON.stringify(item));

	var dateDetailsCtrl = Alloy.Globals.Windows.getEventDetailsCtrl().init({
		dateId: item.properties.eventId ,
		officeId: $.svLocations.views [$.svLocations.currentPage].office_id
	});
	Alloy.Globals.NavigationWindow.openWindow(Alloy.Globals.Windows.getEventDetails());
	// $.ivBackground.animate({
	// opacity: 0 ,
	// duration: 100
	// });
}

function btnAddDate_Click (e) {

	// var createDateCtrl =
	// Alloy.Globals.Windows.getCreateDateCtrl().init({
	// //officeId: $.svLocations.views
	// [$.svLocations.currentPage].office_id
	// });
	//
	// Alloy.Globals.NavigationWindow.openWindow(Alloy.Globals.Windows.getCreateDate());

	var createDateCtrl = Alloy.createController("createDate");
	Alloy.Globals.NavigationWindow.openWindow(createDateCtrl.getView());
}

$.svLocations.addEventListener("scrollEnd" , svLocation_scrollend);

var currentPage = -1;

function svLocation_scrollend (e) {
	//get current scrollview
	//Ti.API.debug("setting background image = " +
	// $.svLocations.views [e.currentPage].office_id);
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

	// $.videoPlayer.url="/" + $.svLocations.views
	// [e.currentPage].office_id + ".mp4";
	//$.videoPlayer.play();

	// $.ivBackground.animate({
	// opacity: 0 ,
	// duration: 100
	// } , function () {
	// $.ivBackground.image = $.svLocations.views
	// [e.currentPage].bgUrl;
	// $.ivBackground.animate({
	// opacity: 1 ,
	// duration: 100
	// });
	// });
}

$.winHome.addEventListener("focus" , function (e) {
	//$.videoPlayer.play();

	Ti.API.debug("winHome:focus");
});

Ti.App.addEventListener("office_found" , function (e) {

	$.svLocations.removeAllChildren();
	var views = [];

	for (var i = 0 ; i < e.offices.length ; i++) {

		if (e.offices [i].name) {

			var view = Ti.UI.createView({
				"class": "titleCtrl" ,
				//bgUrl: e.offices [i].photo.urls.original
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
	Ti.API.debug("offices found = " + views.length);
	$.svLocations.views = views;

	svLocation_scrollend({
		currentPage: 0
	});

	Alloy.Globals.loading.hide();
});

function _init () {

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

	//loadEvents();

}

function loadEvents (office_id) {

	var events = Alloy.Collections.event;

	events.fetch({
		custompath: "byOffice" ,
		urlparams: {
			office_id: office_id
		} ,
		success: function () {

			Ti.API.debug("#lunch dates = " + events.length);
			var dateSection = Ti.UI.createListSection({
				// headerTitle: 'nächste Dates' ,
				// backgroundColor: "#8CC152",
				headerView: Ti.UI.createView({})
			});

			//dateDataSet = new Array ();
			dateDataSet = [];

			$.vFirstTimeInstruction.visible = (events.length == 0);
			$.listView.visible = (events.length > 0);

			for (var i = 0 ; i < events.length ; i++) {
				var element = events.at(i);
				Ti.API.debug("element.get('place').name = " + element.get("place").name);
				if (!_.isEmpty(element)) {

					dateDataSet.push({
						date: {
							text: moment(element.get("start_time")).format("DD.MM.YYYY - HH:mm") + " Uhr"
						} ,
						location: {
							text: element.get("place").name.toUpperCase()
						} ,
						participant1: {
							text: (element.get("custom_fields").participants [0] !== undefined ? element.get("custom_fields").participants [0].name : "unbesetzt")
						} ,
						participant1Image: {
							image: (element.get("custom_fields").participants [0] !== undefined ? element.get("custom_fields").participants [0].photo_url : "profile.png")
						} ,
						participant2: {
							text: (element.get("custom_fields").participants [1] !== undefined ? element.get("custom_fields").participants [1].name : "unbesetzt")
						} ,
						participant2Image: {
							image: (element.get("custom_fields").participants [1] !== undefined ? element.get("custom_fields").participants [1].photo_url : "profile.png")
						} ,
						participant3: {
							text: (element.get("custom_fields").participants [2] !== undefined ? element.get("custom_fields").participants [2].name : "unbesetzt")
						} ,
						participant3Image: {
							image: (element.get("custom_fields").participants [2] !== undefined ? element.get("custom_fields").participants [2].photo_url : "profile.png")
						} ,
						participant4: {
							text: (element.get("custom_fields").participants [3] !== undefined ? element.get("custom_fields").participants [3].name : "unbesetzt")
						} ,
						participant4Image: {
							image: (element.get("custom_fields").participants [3] !== undefined ? element.get("custom_fields").participants [3].photo_url : "profile.png")
						} ,
						properties: {
							backgroundColor: "transparent" ,
							selectedBackgroundColor: "transparent" ,
							height: LISTITEM_HEIGHT ,
							eventId: element.get("id")
						}
					});
				}
			}

			var sections = [];
			$.listView.setSections( []);

			var height = LISTITEM_HEIGHT * dateDataSet.length;

			dateSection.setItems(dateDataSet);
			sections.push(dateSection);

			$.listView.setSections(sections);

			$.listView.height = height;

			refreshControl.endRefreshing();

			setTimeout(function () {
				Alloy.Globals.loading.hide();
			} , 1000);

		} ,
		error: function (collection , response) {
			Ti.API.error("error " + JSON.stringify(collection));
		}

	});

}

_init();

