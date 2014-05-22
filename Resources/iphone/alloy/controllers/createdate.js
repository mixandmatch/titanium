function Controller() {
    function goBack() {
        Alloy.Globals.NavigationWindow.closeWindow($.winCreateDate);
    }
    function lblOffice_Click() {
        _toggleSectionStatus($.vOffice);
    }
    function lblCanteen_Click() {
        _toggleSectionStatus($.vCanteen);
    }
    function lblDateAndTime_Click() {
        _toggleSectionStatus($.vDateAndTime);
    }
    function lblDuration_Click() {
        _toggleSectionStatus($.vDuration);
    }
    function _compactAllSections() {
        for (var i = 0; pickerViews.length > i; i++) pickerViews[i].height = "30dp";
    }
    function _toggleSectionStatusInner(view) {
        var targetHeight = "compact" === view.status ? "236dp" : "30dp";
        var targetStatus = "compact" === view.status ? "expand" : "compact";
        view.status = targetStatus;
        view.animate({
            height: targetHeight,
            duration: 250,
            curve: Ti.UI.ANIMATION_CURVE_EASE_IN
        });
    }
    function _toggleSectionStatus(view) {
        _toggleSectionStatusInner(view);
        for (var i = 0; pickerViews.length > i; i++) {
            Ti.API.debug("pickerview height = " + pickerViews[i].height);
            if (pickerViews[i] != view && "compact" != pickerViews[i].status) {
                Ti.API.debug("toggling height ...");
                _toggleSectionStatusInner(pickerViews[i]);
            }
        }
    }
    function pkrDate_Change(e) {
        console.log("Selected date: " + e.value);
        eventData.start_time = e.value;
    }
    function pkrCanteen_Change() {
        eventData.placeId = $.pkrCanteen.getSelectedRow(0).id;
    }
    function pkrDuration_Change() {
        eventData.duration = $.pkrDuration.getSelectedRow(0).value;
    }
    function pkrOffice_Change() {
        var places = Alloy.Collections.place;
        places.fetch({
            data: {
                where: JSON.stringify({
                    type: "canteen"
                }),
                sel: JSON.stringify({
                    all: [ "id", "name" ]
                })
            },
            success: function() {
                Ti.API.info("success " + JSON.stringify(places));
                Ti.API.debug("events: " + JSON.stringify(places.at(0)));
                var data = [];
                for (var i = 0; places.length > i; i++) {
                    var element = places.at(i);
                    Ti.API.debug(JSON.stringify(element));
                    data.push({
                        title: element.get("name"),
                        id: element.get("id")
                    });
                }
                if ($.pkrCanteen.columns[0]) {
                    var col = $.pkrCanteen.columns[0];
                    var len = col.rowCount;
                    for (var x = len - 1; x >= 0; x--) {
                        var row = col.rows[x];
                        col.removeRow(row);
                    }
                }
                $.pkrCanteen.add(data);
                eventData.placeId = $.pkrCanteen.getSelectedRow(0).id;
            },
            error: function(collection) {
                Ti.API.error("error " + JSON.stringify(collection));
            }
        });
    }
    function btnCreateDate_Click() {
        var aDate = Alloy.createModel("event");
        aDate.save({
            name: eventData.name,
            start_time: eventData.start_time,
            duration: eventData.duration,
            place_id: eventData.placeId
        }, {
            success: function() {
                Alloy.Globals.NavigationWindow.closeWindow(Alloy.Globals.Windows.getCreateDate());
            },
            error: function() {
                alert("something went wrong ...");
            }
        });
    }
    function _init() {
        var places = Alloy.Collections.place;
        Alloy.Globals.currentWindow = $.winCreateDate;
        _compactAllSections();
        eventData = {
            name: "Essen",
            start_time: null,
            duration: null,
            placeId: null
        };
        places.fetch({
            data: {
                where: JSON.stringify({
                    type: "office"
                }),
                sel: JSON.stringify({
                    all: [ "id", "name" ]
                })
            },
            success: function() {
                Ti.API.info("success " + JSON.stringify(places));
                Ti.API.debug("events: " + JSON.stringify(places.at(0)));
                var data = [];
                for (var i = 0; places.length > i; i++) {
                    var element = places.at(i);
                    Ti.API.debug(JSON.stringify(element));
                    data.push({
                        title: element.get("name"),
                        placeId: element.get("id")
                    });
                }
                if ($.pkrOffice.columns[0]) {
                    var col = $.pkrOffice.columns[0];
                    var len = col.rowCount;
                    for (var x = len - 1; x >= 0; x--) {
                        var row = col.rows[x];
                        col.removeRow(row);
                    }
                }
                $.pkrOffice.add(data);
                pkrOffice_Change();
            },
            error: function(collection) {
                Ti.API.error("error " + JSON.stringify(collection));
            }
        });
        $.pkrDate.minDate = new Date(2014, 1, 1);
        $.pkrDate.maxDate = new Date(2020, 12, 31);
        $.pkrDate.value = new Date();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "createDate";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    Alloy.Collections.instance("place");
    $.__views.winCreateDate = Ti.UI.createWindow({
        id: "winCreateDate",
        title: "neuer Termin"
    });
    $.__views.winCreateDate && $.addTopLevelView($.__views.winCreateDate);
    $.__views.__alloyId4 = Ti.UI.createButton({
        width: "80%",
        top: "15dp",
        height: "40dp",
        font: {
            fontFamily: "Lobster"
        },
        title: "Abbrechen",
        id: "__alloyId4"
    });
    goBack ? $.__views.__alloyId4.addEventListener("click", goBack) : __defers["$.__views.__alloyId4!click!goBack"] = true;
    $.__views.winCreateDate.leftNavButton = $.__views.__alloyId4;
    $.__views.__alloyId6 = Ti.UI.createButton({
        width: "80%",
        top: "15dp",
        height: "40dp",
        font: {
            fontFamily: "Lobster"
        },
        title: "Fertig",
        id: "__alloyId6"
    });
    btnCreateDate_Click ? $.__views.__alloyId6.addEventListener("click", btnCreateDate_Click) : __defers["$.__views.__alloyId6!click!btnCreateDate_Click"] = true;
    $.__views.winCreateDate.rightNavButton = $.__views.__alloyId6;
    $.__views.videoPlayer = Ti.Media.createVideoPlayer({
        id: "videoPlayer",
        ns: Ti.Media,
        top: "0",
        url: "/default_office.mp4",
        mediaControlStyle: Titanium.Media.VIDEO_CONTROL_NONE,
        scalingMode: Ti.Media.VIDEO_SCALING_ASPECT_FILL,
        repeatMode: Ti.Media.VIDEO_REPEAT_MODE_ONE,
        width: "100%",
        height: "100%",
        autoplay: "true"
    });
    $.__views.winCreateDate.add($.__views.videoPlayer);
    $.__views.__alloyId7 = Ti.UI.createScrollView({
        top: "0dp",
        layout: "vertical",
        id: "__alloyId7"
    });
    $.__views.winCreateDate.add($.__views.__alloyId7);
    $.__views.__alloyId8 = Ti.UI.createView({
        height: Ti.UI.SIZE,
        top: "10dp",
        id: "__alloyId8"
    });
    $.__views.__alloyId7.add($.__views.__alloyId8);
    $.__views.vOffice = Ti.UI.createView({
        height: "40dp",
        backgroundColor: "#967ADC",
        top: 0,
        id: "vOffice",
        layout: "absolute",
        status: "compact"
    });
    $.__views.__alloyId8.add($.__views.vOffice);
    $.__views.lblOffice = Ti.UI.createLabel({
        text: "Ort",
        id: "lblOffice",
        width: "90%",
        top: "0"
    });
    $.__views.vOffice.add($.__views.lblOffice);
    lblOffice_Click ? $.__views.lblOffice.addEventListener("click", lblOffice_Click) : __defers["$.__views.lblOffice!click!lblOffice_Click"] = true;
    $.__views.pkrOffice = Ti.UI.createPicker({
        top: "40dp",
        id: "pkrOffice",
        selectionIndicator: "true",
        useSpinner: "true"
    });
    $.__views.vOffice.add($.__views.pkrOffice);
    var __alloyId9 = [];
    $.__views.__alloyId10 = Ti.UI.createPickerRow({
        title: "",
        id: "__alloyId10"
    });
    __alloyId9.push($.__views.__alloyId10);
    $.__views.pkrOffice.add(__alloyId9);
    pkrOffice_Change ? $.__views.pkrOffice.addEventListener("change", pkrOffice_Change) : __defers["$.__views.pkrOffice!change!pkrOffice_Change"] = true;
    $.__views.__alloyId11 = Ti.UI.createView({
        height: Ti.UI.SIZE,
        top: "10dp",
        id: "__alloyId11"
    });
    $.__views.__alloyId7.add($.__views.__alloyId11);
    $.__views.vCanteen = Ti.UI.createView({
        height: "40dp",
        backgroundColor: "#967ADC",
        top: 0,
        id: "vCanteen",
        layout: "absolute",
        status: "compact"
    });
    $.__views.__alloyId11.add($.__views.vCanteen);
    $.__views.lblCanteen = Ti.UI.createLabel({
        text: "Kantine",
        id: "lblCanteen",
        width: "90%",
        top: "0"
    });
    $.__views.vCanteen.add($.__views.lblCanteen);
    lblCanteen_Click ? $.__views.lblCanteen.addEventListener("click", lblCanteen_Click) : __defers["$.__views.lblCanteen!click!lblCanteen_Click"] = true;
    $.__views.pkrCanteen = Ti.UI.createPicker({
        top: "40dp",
        id: "pkrCanteen",
        selectionIndicator: "true",
        useSpinner: "true"
    });
    $.__views.vCanteen.add($.__views.pkrCanteen);
    var __alloyId12 = [];
    $.__views.__alloyId13 = Ti.UI.createPickerRow({
        title: "",
        id: "__alloyId13"
    });
    __alloyId12.push($.__views.__alloyId13);
    $.__views.pkrCanteen.add(__alloyId12);
    pkrCanteen_Change ? $.__views.pkrCanteen.addEventListener("change", pkrCanteen_Change) : __defers["$.__views.pkrCanteen!change!pkrCanteen_Change"] = true;
    $.__views.__alloyId14 = Ti.UI.createView({
        height: Ti.UI.SIZE,
        top: "10dp",
        id: "__alloyId14"
    });
    $.__views.__alloyId7.add($.__views.__alloyId14);
    $.__views.vDateAndTime = Ti.UI.createView({
        height: "40dp",
        backgroundColor: "#967ADC",
        top: 0,
        id: "vDateAndTime",
        layout: "absolute",
        status: "compact"
    });
    $.__views.__alloyId14.add($.__views.vDateAndTime);
    $.__views.lblDateAndTime = Ti.UI.createLabel({
        text: "Beginn",
        id: "lblDateAndTime",
        width: "90%",
        top: "0"
    });
    $.__views.vDateAndTime.add($.__views.lblDateAndTime);
    lblDateAndTime_Click ? $.__views.lblDateAndTime.addEventListener("click", lblDateAndTime_Click) : __defers["$.__views.lblDateAndTime!click!lblDateAndTime_Click"] = true;
    $.__views.pkrDate = Ti.UI.createPicker({
        top: "40dp",
        id: "pkrDate",
        type: Titanium.UI.PICKER_TYPE_DATE_AND_TIME,
        minuteInterval: "15",
        format24: "true",
        selectionIndicator: "true"
    });
    $.__views.vDateAndTime.add($.__views.pkrDate);
    pkrDate_Change ? $.__views.pkrDate.addEventListener("change", pkrDate_Change) : __defers["$.__views.pkrDate!change!pkrDate_Change"] = true;
    $.__views.__alloyId15 = Ti.UI.createView({
        height: Ti.UI.SIZE,
        top: "10dp",
        id: "__alloyId15"
    });
    $.__views.__alloyId7.add($.__views.__alloyId15);
    $.__views.vDuration = Ti.UI.createView({
        height: "40dp",
        backgroundColor: "#967ADC",
        top: 0,
        id: "vDuration",
        layout: "absolute",
        status: "compact"
    });
    $.__views.__alloyId15.add($.__views.vDuration);
    $.__views.lblDuration = Ti.UI.createLabel({
        text: "Zeitrahmen",
        id: "lblDuration",
        width: "90%",
        top: "0"
    });
    $.__views.vDuration.add($.__views.lblDuration);
    lblDuration_Click ? $.__views.lblDuration.addEventListener("click", lblDuration_Click) : __defers["$.__views.lblDuration!click!lblDuration_Click"] = true;
    $.__views.pkrDuration = Ti.UI.createPicker({
        top: "40dp",
        id: "pkrDuration",
        selectionIndicator: "true",
        useSpinner: "true"
    });
    $.__views.vDuration.add($.__views.pkrDuration);
    var __alloyId16 = [];
    $.__views.column1 = Ti.UI.createPickerColumn({
        id: "column1"
    });
    __alloyId16.push($.__views.column1);
    $.__views.__alloyId17 = Ti.UI.createPickerRow({
        title: "30 Min",
        value: "1800",
        id: "__alloyId17"
    });
    $.__views.column1.addRow($.__views.__alloyId17);
    $.__views.__alloyId18 = Ti.UI.createPickerRow({
        title: "45 Min",
        value: "2700",
        id: "__alloyId18"
    });
    $.__views.column1.addRow($.__views.__alloyId18);
    $.__views.__alloyId19 = Ti.UI.createPickerRow({
        title: "1 Std.",
        value: "3600",
        id: "__alloyId19"
    });
    $.__views.column1.addRow($.__views.__alloyId19);
    $.__views.__alloyId20 = Ti.UI.createPickerRow({
        title: "1:15 Std.",
        value: "4500",
        id: "__alloyId20"
    });
    $.__views.column1.addRow($.__views.__alloyId20);
    $.__views.pkrDuration.add(__alloyId16);
    pkrDuration_Change ? $.__views.pkrDuration.addEventListener("change", pkrDuration_Change) : __defers["$.__views.pkrDuration!change!pkrDuration_Change"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    require("ti.cloud");
    arguments[0] || {};
    var pickerViews = [ $.vOffice, $.vCanteen, $.vDateAndTime, $.vDuration ];
    var eventData = {};
    exports.init = _init;
    _init();
    __defers["$.__views.__alloyId4!click!goBack"] && $.__views.__alloyId4.addEventListener("click", goBack);
    __defers["$.__views.__alloyId6!click!btnCreateDate_Click"] && $.__views.__alloyId6.addEventListener("click", btnCreateDate_Click);
    __defers["$.__views.lblOffice!click!lblOffice_Click"] && $.__views.lblOffice.addEventListener("click", lblOffice_Click);
    __defers["$.__views.pkrOffice!change!pkrOffice_Change"] && $.__views.pkrOffice.addEventListener("change", pkrOffice_Change);
    __defers["$.__views.lblCanteen!click!lblCanteen_Click"] && $.__views.lblCanteen.addEventListener("click", lblCanteen_Click);
    __defers["$.__views.pkrCanteen!change!pkrCanteen_Change"] && $.__views.pkrCanteen.addEventListener("change", pkrCanteen_Change);
    __defers["$.__views.lblDateAndTime!click!lblDateAndTime_Click"] && $.__views.lblDateAndTime.addEventListener("click", lblDateAndTime_Click);
    __defers["$.__views.pkrDate!change!pkrDate_Change"] && $.__views.pkrDate.addEventListener("change", pkrDate_Change);
    __defers["$.__views.lblDuration!click!lblDuration_Click"] && $.__views.lblDuration.addEventListener("click", lblDuration_Click);
    __defers["$.__views.pkrDuration!change!pkrDuration_Change"] && $.__views.pkrDuration.addEventListener("change", pkrDuration_Change);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;