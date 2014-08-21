var args = arguments [0] || {};
var parentController = args.arguments.parentController;

var dateDataSet = [];
const LISTITEM_HEIGHT = 320;
const BLUR_RADIUS = 1;

var mod = require('bencoding.blur');

//TODO: refactor
// refreshControl.addEventListener('refreshstart' , function
// (e) {
// Ti.API.info('refreshstart');
// loadEvents($.svLocations.views
// [$.svLocations.currentPage].office_id);
// });

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

	//Alloy.Globals.GoogleAnalytics.event("user_interaction", "click", "contentView" , "listView_Itemclick");
	var section = $.listView.sections [e.sectionIndex];

	var item = section.getItemAt(e.itemIndex);

	Alloy.Globals.pageFlow.addChild({
		arguments: {
			dateId: item.properties.eventId ,
			date: item.properties.eventDate ,
			officeId: parentController.getCurrentOfficeId() ,
			canteen: item.properties.canteen ,
			lunchTag: item.properties.lunchTag
		} ,
		controller: 'eventDetails' ,
		navBar: {
		  title: "Details"  
		},
		direction: {
			top: 0 ,
			left: 1
		}
	});
}

function loadEvents (office_id) {
	//TODO refactor
}

var api = {
    
	data: {} ,

	initialize: function () {
		if (args.pulltorefresh) {
			args.pulltorefresh.setCallback(api.doRefresh);
		}

		api.updateListView(api.data);
	} ,

	doRefresh: function (e) {
		// Call your updateListView function
		api.updateListView();
	} ,

	updateListView: function () {

		if (args.pulltorefresh && api.data) {
			args.pulltorefresh.stop(api.data.length * 240 , 20);
		}

		var events = Alloy.Collections.event;
		
		var office_id = parentController.getCurrentOfficeId();
		if (office_id.length == 0) {
            return;
        }

		events.fetch({
			custompath: "byOffice" ,
			urlparams: {
				office_id: office_id
			} ,
			success: function () {

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
								image: (cf.participants [0] !== undefined ? (diff > 15 ? mod.createGPUBlurImageView({
									image: cf.participants [0].photo_url ,
									blur: {
										type: mod.IOS_BLUR ,
										radiusInPixels: BLUR_RADIUS
									}
								}).toImage() : cf.participants [0].photo_url) : "profile.png")
							} ,
							participant2: {
								text: (cf.participants [1] !== undefined ? (diff <= 15 ? cf.participants [1].name : scrambleWord(cf.participants [1].name)) : "unbesetzt")
							} ,
							participant2Image: {
								image: (cf.participants [1] !== undefined ? (diff > 15 ? mod.createGPUBlurImageView({
									image: cf.participants [1].photo_url ,
									blur: {
										type: mod.IOS_BLUR ,
										radiusInPixels: BLUR_RADIUS
									}
								}).toImage() : cf.participants [0].photo_url) : "profile.png")
							} ,
							participant3: {
								text: (cf.participants [2] !== undefined ? (diff <= 15 ? cf.participants [2].name : scrambleWord(cf.participants [2].name)) : "unbesetzt")
							} ,
							participant3Image: {
								image: (cf.participants [2] !== undefined ? (diff > 15 ? mod.createGPUBlurImageView({
									image: cf.participants [2].photo_url ,
									blur: {
										type: mod.IOS_BLUR ,
										radiusInPixels: BLUR_RADIUS
									}
								}).toImage() : cf.participants [0].photo_url) : "profile.png")
							} ,
							participant4: {
								text: (cf.participants [3] !== undefined ? (diff <= 15 ? cf.participants [3].name : scrambleWord(cf.participants [3].name)) : "unbesetzt")
							} ,
							participant4Image: {
								image: (cf.participants [3] !== undefined ? (diff > 15 ? mod.createGPUBlurImageView({
									image: cf.participants [3].photo_url ,
									blur: {
										type: mod.IOS_BLUR ,
										radiusInPixels: BLUR_RADIUS
									}
								}).toImage() : cf.participants [0].photo_url) : "profile.png")
							} ,
							properties: {
								backgroundColor: "transparent" ,
								selectedBackgroundColor: "transparent" ,
								height: LISTITEM_HEIGHT ,
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

				var height = LISTITEM_HEIGHT * dateDataSet.length;

				dateSection.setItems(dateDataSet);
				sections.push(dateSection);

				$.listView.setSections(sections);

				var end = moment();
				

				setTimeout(function () {
					Alloy.Globals.loading.hide();
				} , 1000);

			} ,
			error: function (collection , response) {
				Ti.API.error("error " + JSON.stringify(collection));
			}

		});
	}

};

module.exports = api;

api.initialize();
