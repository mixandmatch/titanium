var args = arguments [0] || {};

var dateDataSet = [];
const LISTITEM_HEIGHT = 320;
const BLUR_RADIUS = 1;
var current_office_id = "";

var mod = require('bencoding.blur');

function refreshListview (e) {
	loadEvents($.svLocations.views [$.svLocations.currentPage].office_id);
}

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

	var eventDetailsController = Alloy.createController("eventDetails" , {
		dateId: item.properties.eventId ,
		date: item.properties.eventDate ,
		officeId: current_office_id ,
		canteen: item.properties.canteen ,
		lunchTag: item.properties.lunchTag
	});
	
	eventDetailsController.getView().open();

	//not working when using maps in conjunction with nappdrawer
	// Alloy.Globals.pageFlow.addChild({
	// arguments: {
	// dateId: item.properties.eventId ,
	// date: item.properties.eventDate ,
	// officeId: current_office_id ,
	// canteen: item.properties.canteen ,
	// lunchTag: item.properties.lunchTag
	// } ,
	// controller: 'eventDetails' ,
	// navBar: {
	// title: "Details"
	// } ,
	// direction: {
	// top: 0 ,
	// left: 1
	// }
	// });
}

function updateListView () {

	var events = Alloy.Collections.event;

	if (current_office_id.length == 0) {
		return;
	}

	events.fetch({
		custompath: "byOffice" ,
		urlparams: {
			office_id: current_office_id
		} ,
		success: function () {

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

			if (OS_IOS) {
				$.ptr.endRefreshing();
			}

			Ti.App.fireEvent("homelistUpdated");

			setTimeout(function () {
				Alloy.Globals.loading.hide();
			} , 1000);

		} ,
		error: function (collection , response) {
			Ti.API.error("error " + JSON.stringify(collection));
		}

	});
}

function initialize () {
	//updateListView();

	Ti.App.addEventListener("officeSelected" , function (e) {
		current_office_id = e.office_id;
		updateListView();
	});

	if (OS_IOS) {
		$.ptr.addEventListener('refreshstart' , function (e) {
			Ti.API.info('refreshstart');
			updateListView();
		});
	}
}

exports.initialize = initialize;
exports.updateListView = updateListView;

initialize();
