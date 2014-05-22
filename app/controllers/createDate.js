var Cloud = require('ti.cloud');

var args = arguments [0] || {};

var pickerViews = [$.vOffice , $.vCanteen , $.vDateAndTime , $.vDuration];

var eventData = {};

function goBack(e) {
    Alloy.Globals.NavigationWindow.closeWindow($.winCreateDate);
}

// # section toggler events # //
function lblOffice_Click (e) {
	_toggleSectionStatus($.vOffice);
}

function lblCanteen_Click (e) {
	_toggleSectionStatus($.vCanteen);
}

function lblDateAndTime_Click (e) {
	_toggleSectionStatus($.vDateAndTime);
}

function lblDuration_Click (e) {
	_toggleSectionStatus($.vDuration);
}

function _compactAllSections() {
    for (var i = 0 ; i < pickerViews.length ; i++) {
        pickerViews [i].height = "30dp";
    }
}

function _toggleSectionStatusInner (view) {
	var targetHeight = (view.status === "compact" ? "236dp" : "30dp");
	var targetStatus = (view.status === "compact" ? "expand" : "compact");

	view.status = targetStatus;
	view.animate({
		height: targetHeight ,
		duration: 250 ,
		curve: Ti.UI.ANIMATION_CURVE_EASE_IN
	});
}

function _toggleSectionStatus (view) {

	_toggleSectionStatusInner(view);

	for (var i = 0 ; i < pickerViews.length ; i++) {
		Ti.API.debug("pickerview height = " + pickerViews [i].height);
		if (pickerViews [i] != view && pickerViews [i].status != "compact") {
			Ti.API.debug("toggling height ...");
			_toggleSectionStatusInner(pickerViews [i]);
		}
	}

}

// # end section toggler events # //

// # section picker events # //
function pkrDate_Change (e) {
	console.log("Selected date: " + e.value);
	eventData.start_time = e.value;
}

function pkrCanteen_Change (e) {
	eventData.placeId = $.pkrCanteen.getSelectedRow(0).id;
}

function pkrDuration_Change (e) {
	eventData.duration = $.pkrDuration.getSelectedRow(0).value;
}

function pkrOffice_Change (e) {
	//populate pkrCanteen

	var places = Alloy.Collections.place;
	places.fetch({
		data: {
			where: JSON.stringify({
				"type": "canteen"
			}) ,
			sel: JSON.stringify({
				"all": ["id" , "name"]
			})
		} ,
		success: function () {

			Ti.API.info("success " + JSON.stringify(places));

			Ti.API.debug("events: " + JSON.stringify(places.at(0)));

			var data = [];

			for (var i = 0 ; i < places.length ; i++) {
				var element = places.at(i);

				Ti.API.debug(JSON.stringify(element));

				data.push({
					title: element.get("name") ,
					id: element.get("id")
				});

			}

			//delete old data workaround
			if ($.pkrCanteen.columns [0]) {
				var col = $.pkrCanteen.columns [0];
				var len = col.rowCount;
				for (var x = len - 1 ; x >= 0 ; x--) {
					var row = col.rows [x];
					col.removeRow(row);
				}
			}

			$.pkrCanteen.add(data);
			eventData.placeId = $.pkrCanteen.getSelectedRow(0).id;
		} ,
		error: function (collection , response) {
			Ti.API.error("error " + JSON.stringify(collection));
		}

	});
}

// # end section picker events # //

function btnCreateDate_Click (e) {

	var aDate = Alloy.createModel("event");
	aDate.save({
		name: eventData.name ,
		start_time: eventData.start_time ,
		duration: eventData.duration ,
		place_id: eventData.placeId
	} , {
		success: function (_m , _r) {
			Alloy.Globals.NavigationWindow.closeWindow(Alloy.Globals.Windows.getCreateDate());
		} ,
		error: function (_m , _r) {
			alert("something went wrong ...");
		}

	});
}

function _init (_args) {

	var places = Alloy.Collections.place;
	Alloy.Globals.currentWindow = $.winCreateDate;
	_compactAllSections();

	eventData = {
		name: "Essen" ,
		start_time: null ,
		duration: null ,
		placeId: null
	};

	places.fetch({
		data: {
			where: JSON.stringify({
				"type": "office"
			}) ,
			sel: JSON.stringify({
				"all": ["id" , "name"]
			})
		} ,
		success: function () {

			Ti.API.info("success " + JSON.stringify(places));

			Ti.API.debug("events: " + JSON.stringify(places.at(0)));

			var data = [];

			for (var i = 0 ; i < places.length ; i++) {
				var element = places.at(i);

				Ti.API.debug(JSON.stringify(element));

				data.push({
					title: element.get("name") ,
					placeId: element.get("id")
				});

			}

			//delete old data workaround
			if ($.pkrOffice.columns [0]) {
				var col = $.pkrOffice.columns [0];
				var len = col.rowCount;
				for (var x = len - 1 ; x >= 0 ; x--) {
					var row = col.rows [x];
					col.removeRow(row);
				}
			}

			$.pkrOffice.add(data);
			pkrOffice_Change();
		} ,
		error: function (collection , response) {
			Ti.API.error("error " + JSON.stringify(collection));
		}

	});

	$.pkrDate.minDate = new Date (2014 , 1 , 1);
	$.pkrDate.maxDate = new Date (2020 , 12 , 31);
	$.pkrDate.value = new Date ();
}

exports.init = _init;

_init();
