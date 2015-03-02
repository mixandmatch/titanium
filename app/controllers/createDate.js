var moment = require("alloy/moment");
var pkrOffice ,
    pkrCanteen ,
    pkrDate;
var args = arguments [0] || {};
var pickerViews = ["vOffice" , "vCanteen" , "vDateAndTime"];
var eventData = {
};

exports.preHide = function () {
	$.actionContainer.animate({
		duration: 500 ,
		bottom: -120
	});

	clearInterval(pulsatePlusTimer);
};

exports.preShow = function () {
	Alloy.Globals.GoogleAnalytics.trackScreen({
		screenName: "Create Date"
	});

	Alloy.Globals.loading.show();

};

exports.postShow = function () {

	eventData = {
		name: "Essen" ,
		start_time: null ,
		duration: null ,
		placeId: null
	};

	$.actionContainer.animate({
		duration: 500 ,
		bottom: 0
	});

	var now = moment();

	var minutes = now.minutes();
	var hours = now.hours();

	var m = (parseInt( (minutes + 7.5) / 15) * 15) % 60;
	var h = minutes > 52 ? (hours === 23 ? 0 : ++hours) : hours;

	now.minutes(m);
	now.hours(h);
	now.add(15 , "m");

	// eventData.start_time = now;
	$.lblDateAndTimeValue.text = moment(now).format("DD.MM.YYYY - HH:mm");

	eventData.start_time = moment(now).format("YYYY-MM-DDTHH:mm:00ZZ");
	console.log("preshow:start_time = " + eventData.start_time);
	//$.lblDateAndTimeValue.text = now.toLocaleDateString() + " "
	// + String.formatTime(now);

	//delete old data workaround
	if ($.pkrOffice.columns [0]) {
		var col = $.pkrOffice.columns [0];
		var len = col.rowCount;
		for (var x = len - 1 ; x >= 0 ; x--) {
			var row = col.rows [x];
			col.removeRow(row);
		}
	}

	//Alloy.Globals.currentWindow = $.winCreateDate;
	_compactAllSections();

	var officesFromCache;

	if ( ( officesFromCache = Ti.App.Properties.getString("offices" , null)) != null) {
		Ti.API.debug("loading offices from cache");
		populateOfficeList(JSON.parse(officesFromCache));
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
			if (officesFromCache == null || (officesFromCache != null && officesFromCache !== JSON.stringify(data))) {
				Ti.API.debug("syncing offices data with caching and updating UI");
				Ti.App.Properties.setString("offices" , JSON.stringify(data));
				populateOfficeList(JSON.parse(officesFromCache));
			}

		}

	});

	if (OS_IOS) {
		$.pkrDate.minDate = new Date ();
		$.pkrDate.maxDate = new Date (2020 , 12 , 31);
		$.pkrDate.value = new Date ();

	}
	else
	if (OS_ANDROID) {

	}

	setInterval(pulsatePlusTimer , 2000);
};

var pulsatePlusTimer = function () {
	Alloy.Globals.Animations.pulsate($.btnAddDate , 0.05);
};

function goBack (e) {
	Ti.App.fireEvent("updateLunchDates");
	Alloy.Globals.pageFlow.back();
	//Alloy.Globals.GoogleAnalytics.event("createDate" ,
	// "goBack");
}

$.winCreateDate.addEventListener("close" , function () {
	Alloy.Globals.loading.hide();
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
	Ti.API.debug("lblDateAndTime_Click");
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
	Ti.API.debug("Selected date: " + moment(e.value).format("YYYY-MM-DDTHH:mm:00ZZ"));

	eventData.start_time = moment(e.value).format("YYYY-MM-DDTHH:mm:00ZZ");
	$.lblDateAndTimeValue.text = moment(now).format("DD.MM.YYYY - HH:mm");
	//$.lblDateAndTimeValue.text = e.value.toLocaleDateString() +
	// " " + String.formatTime(e.value);
}

function pkrCanteen_Change (e) {
	eventData.placeId = $.pkrCanteen.getSelectedRow(0).id;
	$.lblCanteenValue.text = $.pkrCanteen.getSelectedRow(0).title.toUpperCase();
}

function populateCanteenList (canteens) {
	var data = [];

	for (var i = 0 ; i < canteens.length ; i++) {
		var element = canteens [i];

		data.push({
			title: element.name ,
			id: element.id
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
	$.lblCanteenValue.text = canteens [0].name;
	eventData.placeId = canteens [0].id;

}

function pkrOffice_Change (e) {
	//populate pkrCanteen

	$.lblOfficeValue.text = $.pkrOffice.getSelectedRow(0).title.toUpperCase();
	var office_id = $.pkrOffice.getSelectedRow(0).id;

	var canteensFromCache;

	if ( ( canteensFromCache = Ti.App.Properties.getString("canteens_" + office_id , null)) != null) {
		Ti.API.debug("loading offices from cache");
		populateCanteenList(JSON.parse(canteensFromCache));
		Alloy.Globals.loading.hide();
	}

	var offices = Alloy.Collections.instance("canteen");
	offices.fetch({
		custompath: "byOffice" ,
		urlparams: {
			office_id: office_id
		} ,
		success: function (data) {

			//update only if data changed
			if (canteensFromCache == null || (canteensFromCache != null && canteensFromCache !== JSON.stringify(data))) {

				Ti.App.Properties.setString("canteens_" + office_id , JSON.stringify(data));

				canteensFromCache = Ti.App.Properties.getString("canteens_" + office_id , null);

				populateCanteenList(JSON.parse(canteensFromCache));

				Alloy.Globals.loading.hide();
			}

		} ,
		error: function (collection , response) {
			Ti.API.error("error " + JSON.stringify(collection));
			Alloy.Globals.loading.hide();
			//Alloy.Globals.GoogleAnalytics.event("createDate" ,
			// "pkrOffice_Change", "error", JSON.stringify(collection));
		}

	});
}

// # end section picker events # //

function btnCreateDate_Click (e) {
	Alloy.Globals.loading.show();
	//Alloy.Globals.GoogleAnalytics.event("createDate" ,
	// "btnCreateDate_Click");
	var aDate = Alloy.createModel("event");
	console.log("start_time = " + eventData.start_time);
	aDate.save({
		name: eventData.name ,
		start_time: eventData.start_time ,
		duration: eventData.duration ,
		place_id: eventData.placeId
	} , {
		success: function (_m , _r) {
			Ti.App.fireEvent("updateLunchDates");
			Alloy.Globals.loading.hide();
			Alloy.Globals.pageFlow.back();
			//Alloy.Globals.GoogleAnalytics.event("createDate" ,
			// "btnCreateDate_Click", "successful");
		} ,
		error: function (_m , _r) {
			alert("something went wrong ...");
			//Alloy.Globals.GoogleAnalytics.event("createDate" ,
			// "btnCreateDate_Click", "error", JSON.stringify(_m));
			Alloy.Globals.loading.hide();
		}

	});
}

function populateOfficeList (offices) {
	var data = [];

	for (var i = 0 ; i < offices.length ; i++) {
		var element = offices [i];

		data.push(Ti.UI.createPickerRow({
			title: element.name.toUpperCase() ,
			id: element.id
		}));
	}

	$.pkrOffice.add(data);
	$.pkrOffice.setSelectedRow(0 , 0 , false);
	$.lblOfficeValue.text = offices [0].name.toUpperCase();
	pkrOffice_Change();
}