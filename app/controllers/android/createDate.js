var moment = require("alloy/moment");
var args = arguments [0] || {};
var eventData = {
};

$.lblDate.addEventListener("click" , function () {
	var picker = Ti.UI.createPicker({
		type: Ti.UI.PICKER_TYPE_DATE ,
		minDate: new Date () ,
		maxDate: new Date (2020 , 12 , 31)
	});

	picker.showDatePickerDialog({
		value: moment(eventData.start_time) ,
		callback: function (e) {
			if (!e.cancel) {
				eventData.start_time = moment(e.value).format("YYYY-MM-DDTHH:mm:00ZZ");
				$.lblTime.title = moment(e.value).format("HH:mm");
			}
		}

	});
});

$.lblTime.addEventListener("click" , function () {
	var picker = Ti.UI.createPicker({
		type: Ti.UI.PICKER_TYPE_TIME ,
		useSpinner: true ,
		minuteInterval: 15
	});
	picker.value = moment(eventData.start_time);

	picker.showTimePickerDialog({
		format24: true ,
		callback: function (e) {
			if (!e.cancel) {
				var time = e.value;
				eventData.start_time = moment(e.value).format("YYYY-MM-DDTHH:mm:00ZZ");
				$.lblDate.title = moment(e.value).format("DD.MM.YYYY");
			}
		}

	});
});

function goBack (e) {
	Ti.App.fireEvent("updateLunchDates");
	Alloy.Globals.NavigationWindow.closeWindow($.winCreateDate);
	//Alloy.Globals.GoogleAnalytics.event("createDate" ,
	// "goBack");
}

$.winCreateDate.addEventListener("close" , function () {
	Alloy.Globals.loading.hide();
	$.destroy();
});

function pkrCanteen_Change (e) {
	eventData.placeId = $.pkrCanteen.getSelectedRow(0).id;
}

function pkrOffice_Change (e) {
	//populate pkrCanteen

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

				data.push(Ti.UI.createPickerRow({
					title: element.get("name") ,
					id: element.get("id")
				}));

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
			$.pkrCanteen.setSelectedRow(0 , 0 , false);
			eventData.placeId = canteens.at(0).id;
			Alloy.Globals.loading.hide();

			$.pkrCanteen.removeEventListener("change" , pkrCanteen_Change);
			$.pkrCanteen.addEventListener("change" , pkrCanteen_Change);
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
			Alloy.Globals.NavigationWindow.closeWindow(Alloy.Globals.currentWindow);
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

	eventData = {
		name: "Essen" ,
		start_time: moment() ,
		duration: null ,
		placeId: null
	};
	
	$.lblDate.title = moment(eventData.start_time).format("DD.MM.YYYY");
	$.lblTime.title = moment(eventData.start_time).format("HH:mm");

	Alloy.Globals.loading.show();

	//delete old data workaround
	if ($.pkrOffice.columns [0]) {
		var col = $.pkrOffice.columns [0];
		var len = col.rowCount;
		for (var x = len - 1 ; x >= 0 ; x--) {
			var row = col.rows [x];
			col.removeRow(row);
		}
	}

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

				data.push(Ti.UI.createPickerRow({
					title: element.get("name").toUpperCase() ,
					id: element.get("id")
				}));
			}

			$.pkrOffice.add(data);
			$.pkrOffice.setSelectedRow(0 , 0 , false);
			
			pkrOffice_Change();
			

			$.pkrOffice.removeEventListener("change" , pkrOffice_Change);
			$.pkrOffice.addEventListener("change" , pkrOffice_Change);
		}

	});
}

//exports.init = _init;

_init();
