"use strict";

Array.prototype.removeAt = function (index) {
	this.splice(index , 1);
};

Alloy.Globals.currentWindow = $.winHome;

var moment = require("moment-with-langs");
var args = arguments [0] || {};
//var dateDataSet = new Array ();
var dateDataSet = [];
const LISTITEM_HEIGHT = 60;

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
		dateId: item.properties.eventId,
		officeId: $.svLocations.views [$.svLocations.currentPage].office_id
	});
	Alloy.Globals.NavigationWindow.openWindow(Alloy.Globals.Windows.getEventDetails());
	// $.ivBackground.animate({
		// opacity: 0 ,
		// duration: 100
	// });
}

function btnAddDate_Click (e) {
    
    // var createDateCtrl = Alloy.Globals.Windows.getCreateDateCtrl().init({
        // //officeId: $.svLocations.views [$.svLocations.currentPage].office_id
    // });
//     
	// Alloy.Globals.NavigationWindow.openWindow(Alloy.Globals.Windows.getCreateDate());
	
	var createDateCtrl = Alloy.createController("createDate");
	Alloy.Globals.NavigationWindow.openWindow(createDateCtrl.getView());
}

$.svLocations.addEventListener("scrollEnd" , svLocation_scrollend);

function svLocation_scrollend (e) {
	//get current scrollview
	Ti.API.debug("setting background image = " + $.svLocations.views [e.currentPage].office_id);
	loadEvents($.svLocations.views [e.currentPage].office_id);

	// $.videoPlayer.url="/" + $.svLocations.views [e.currentPage].office_id + ".mp4";
	$.videoPlayer.play();
	
	// $.ivBackground.animate({
		// opacity: 0 ,
		// duration: 100
	// } , function () {
		// $.ivBackground.image = $.svLocations.views [e.currentPage].bgUrl;
		// $.ivBackground.animate({
			// opacity: 1 ,
			// duration: 100
		// });
	// });

}

$.winHome.addEventListener("focus" , function (e) {
	$.videoPlayer.play();

	Ti.API.debug("winHome:focus");
});

Ti.App.addEventListener("office_found" , function (e) {

	$.svLocations.removeAllChildren();
	var views = [];

	for (var i = 0 ; i < e.offices.length ; i++) {

        
		if (e.offices [i].name) {
		    Ti.API.debug("office name = " + e.offices [i].name);
		    Ti.API.debug("office id = " + e.offices [i].id);
			var view = Ti.UI.createView({
				"class": "titleCtrl" ,
				height: "70dp" ,
				//bgUrl: e.offices [i].photo.urls.original
				office_id: e.offices [i].id
			});

			view.add(Ti.UI.createLabel({
				"class": "titleLocation" ,
				text: e.offices [i].name

			}));
			views.push(view);
		}
	}
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
			lon: Alloy.Globals.currentLocation.longitude ,
			lat: Alloy.Globals.currentLocation.latitude ,
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
	    custompath:"byOffice",
	    urlparams: {
	        office_id: office_id
	    },
		success: function () {
		    
			var dateSection = Ti.UI.createListSection({
				// headerTitle: 'nächste Dates' ,
				// backgroundColor: "#8CC152",
				headerView: Ti.UI.createView({})
			});

			//dateDataSet = new Array ();
			dateDataSet = [];

			for (var i = 0 ; i < events.length - 1 ; i++) {
				var element = events.at(i);

				if (!_.isEmpty(element)) {

					dateDataSet.push({
						date: {
							text: moment(element.get("start_time")).format("DD.MM.YYYY hh:mm")
						} ,
						location: {
							text: element.get("place").name
						} ,
						properties: {
							backgroundColor: "transparent" ,
							selectedBackgroundColor: "transparent",
							canEdit: true ,
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

