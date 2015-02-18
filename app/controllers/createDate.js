var moment = require("alloy/moment");
var pkrOffice ,
    pkrCanteen ,
    pkrDate;
var args = arguments [0] || {};
var pickerViews = ["vOffice" , "vCanteen" , "vDateAndTime"];
var eventData = {
};

exports.preHide = function() {
    $.actionContainer.animate( {
       duration: 500,
       bottom: -120 
    });
    
    clearInterval(pulsatePlusTimer);
};

exports.preShow = function () {
    Alloy.Globals.GoogleAnalytics.trackScreen({
        screenName: "Create Date"
    });
};

exports.postShow = function() {
    $.actionContainer.animate( {
       duration: 500,
       bottom: 0
    });
    
    setInterval(pulsatePlusTimer, 2000);
};

var pulsatePlusTimer = function() {
    Alloy.Globals.Animations.pulsate($.btnAddDate , 0.05);
};

if (OS_ANDROID) {
	$.lblDate.addEventListener("click" , function () {
		var picker = Ti.UI.createPicker({
			type: Ti.UI.PICKER_TYPE_DATE,
			useSpinner:true,
			minDate: new Date (),
            maxDate: new Date (2020 , 12 , 31)
		});

		

		picker.showDatePickerDialog({
		    value: moment($.lblDateAndTimeValue.text),
			callback: function (e) {
				if (!e.cancel) {
					var dateValue = e.value;
					$.lblDate.text = (dateValue.getMonth() + 1) + "/" + dateValue.getDate() + "/" + dateValue.getFullYear();
					$.lblDate.blur();
					
					eventData.start_time = moment(e.value).format("YYYY-MM-DDTHH:mm:00ZZ");
					$.lblDateAndTimeValue.text = moment(eventData.start_time).format("DD.MM.YYYY - HH:mm");
				}
			}

		});
	});

	$.lblTime.addEventListener("click" , function () {
		var picker = Ti.UI.createPicker({
			type: Ti.UI.PICKER_TYPE_TIME,
			useSpinner:true,
			minuteInterval: 15
		});
		picker.value = moment($.lblDateAndTimeValue.text);
		
		picker.showTimePickerDialog({
		    format24:true,
			callback: function (e) {
				if (!e.cancel) {
					var time = e.value;
					$.lblTime.text = time.getHours() + ":" + time.getMinutes();
					$.lblTime.blur();
					eventData.start_time = moment(e.value).format("YYYY-MM-DDTHH:mm:00ZZ");
                    $.lblDateAndTimeValue.text = moment(eventData.start_time).format("DD.MM.YYYY - HH:mm");
				}
			}

		});
	});
}

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
			eventData.placeId = canteens.at(0).id;
			Alloy.Globals.loading.hide();
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

function _init (_args) {

    Alloy.Globals.loading.show();
    
    eventData.start_time = moment();
    $.lblDateAndTimeValue.text = moment(eventData.start_time).format("DD.MM.YYYY - HH:mm");

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
			pkrOffice_Change();
		}

	});

	if (OS_IOS) {
		$.pkrDate.minDate = new Date ();
		$.pkrDate.maxDate = new Date (2020 , 12 , 31);
		$.pkrDate.value = new Date ();
		
	} else if (OS_ANDROID) {
	    
	}
	
}

//exports.init = _init;

_init();
