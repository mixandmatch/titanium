var pkrOffice , pkrCanteen , pkrDate;
var args = arguments [0] || {};
var pickerViews = ["vOffice" , "vCanteen" , "vDateAndTime"];
var eventData = {};

function goBack (e) {
	Alloy.Globals.NavigationWindow.closeWindow($.winCreateDate);
}

$.winCreateDate.addEventListener("close" , function () {
	$.destroy();
});

// # section toggler events # //
function lblOffice_Click (e) {
	_toggleSectionStatus("vOffice");
}

function lblCanteen_Click (e) {
	_toggleSectionStatus("vCanteen");
}

function lblDateAndTime_Click (e) {
	_toggleSectionStatus("vDateAndTime");
}

function _compactAllSections () {
	for (var i = 0 ; i < pickerViews.length ; i++) {
		$ [pickerViews [i]].height = "40dp";
	}
}

function _toggleSectionStatusInner (viewName) {

	var view = $ [viewName];
	var viewSiblings = $ [viewName + "_Siblings"];

	var targetHeight = (view.status === "compact" ? 236 : 0);
	var targetStatus = (view.status === "compact" ? "expand" : "compact");

    Ti.API.debug("_toggleSectionStatusInner(" + viewName + "): targetHeight = " + targetHeight);
	if (viewSiblings) {
		Ti.API.debug("viewSiblings.top + targetHeight" + (parseInt(viewSiblings.top) + parseInt(targetHeight)));
		viewSiblings.animate({
			top: parseInt(viewSiblings.top) + parseInt(targetHeight) ,
			duration: 250 ,
			curve: Ti.UI.ANIMATION_CURVE_EASE_IN
		});
	}
	view.status = targetStatus;
	view.animate({
		height: targetHeight + 40 ,
		duration: 250 ,
		curve: Ti.UI.ANIMATION_CURVE_EASE_IN
	} , function () {
		view.height = targetHeight + 40;
	});
}

function _toggleSectionStatus (viewName) {

	var view = $ [viewName];
	var viewSiblings = $ [viewName + "_Siblings"];

	_toggleSectionStatusInner(viewName);

	for (var i = 0 ; i < pickerViews.length ; i++) {
		var pickerView = $ [pickerViews [i]];
		
		Ti.API.debug("toggling " + viewName + ", viewName.status = " + pickerView.status);
		if (pickerView != view && pickerView.status != "compact") {
			_toggleSectionStatusInner(pickerViews [i]);
		}
	}

}

// # end section toggler events # //

// # section picker events # //
function pkrDate_Change (e) {
	console.log("Selected date: " + moment(e.value).format("YYYY-MM-DDThh:mm:00ZZ"));

	eventData.start_time = moment(e.value).format("YYYY-MM-DDThh:mm:00ZZ");
	$.lblDateAndTimeValue.text = e.value.toLocaleDateString() + " " + String.formatTime(e.value);
}

function pkrCanteen_Change (e) {
	eventData.placeId = $.pkrCanteen.getSelectedRow(0).id;
	$.lblCanteenValue.text = $.pkrCanteen.getSelectedRow(0).title.toUpperCase();
}

function pkrOffice_Change (e) {
	//populate pkrCanteen

	$.lblOfficeValue.text = $.pkrOffice.getSelectedRow(0).title.toUpperCase();
	var canteens = Alloy.Collections.instance("canteen");
	canteens.fetch({
		custompath: "byOffice" ,
		urlparams: {
			office_id: $.pkrOffice.getSelectedRow(0).id
		} ,
		success: function () {

			var data = [];

			for (var i = 0 ; i < canteens.length ; i++) {
				var element = canteens.at(i);

				Ti.API.debug("canteen: " + JSON.stringify(element));

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
			$.lblCanteenValue.text = canteens.at(0).get("name");
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
			Alloy.Globals.NavigationWindow.closeWindow(Alloy.Globals.currentWindow);
		} ,
		error: function (_m , _r) {
			alert("something went wrong ...");
		}

	});
}

function _init (_args) {

	//delete old data workaround
	if ($.pkrOffice.columns [0]) {
		var col = $.pkrOffice.columns [0];
		var len = col.rowCount;
		for (var x = len - 1 ; x >= 0 ; x--) {
			var row = col.rows [x];
			col.removeRow(row);
		}
	}

	Alloy.Globals.currentWindow = $.winCreateDate;
	_compactAllSections();

	eventData = {
		name: "Essen" ,
		start_time: null ,
		duration: null ,
		placeId: null
	};

	var offices = Alloy.Collections.instance("office");
	offices.fetch({
		urlparams: {
			lon: Ti.App.Properties.getObject('currentLocation').longitude ,
			lat: Ti.App.Properties.getObject('currentLocation').latitude ,
			d: 10
		} ,
		success: function (data) {

			var data = [];

			for (var i = 0 ; i < offices.length ; i++) {
				var element = offices.at(i);

				Ti.API.debug("office:" + JSON.stringify(element));

				data.push(Ti.UI.createPickerRow({
					title: element.get("name").toUpperCase() ,
					id: element.get("id")
				}));
			}

			$.pkrOffice.add(data);
			$.pkrOffice.setSelectedRow(0 , 0 , false);
			$.lblOfficeValue.text = offices.at(0).get("name").toUpperCase();
			//pkrOffice_Change();
		}

	});

	$.pkrDate.minDate = new Date ();
	$.pkrDate.maxDate = new Date (2020 , 12 , 31);
	$.pkrDate.value = new Date ();
	$.lblDateAndTimeValue.text = $.pkrDate.value.toLocaleDateString() + " " + String.formatTime($.pkrDate.value);
}

exports.init = _init;

_init();
