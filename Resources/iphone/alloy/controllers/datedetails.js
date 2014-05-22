function Controller() {
    function _init(_args) {
        Ti.API.debug(JSON.stringify($.lblDateId));
        $.evt = Alloy.createModel("event", {
            id: _args.dateId
        });
        $.videoPlayer.url = _args.officeId;
        $.evt.on("fetch", function() {
            Ti.API.debug(JSON.stringify($.evt));
            $.lblName.text = $.evt.get("name");
            $.lblOrganizer.text = $.evt.get("user").first_name + " " + $.evt.get("user").last_name;
            $.lblDate.text = moment($.evt.get("start_time")).format("dd.mm.YYYY, hh:mm");
            var participantSection = Ti.UI.createListSection({
                headerTitle: "Teilnehmer"
            });
            var participants = $.evt.get("custom_fields").participants;
            var participantsDataSet = [];
            for (var i = 0; participants.length > i; i++) participantsDataSet.push({
                name: {
                    text: participants[i].name
                },
                picture: {
                    image: participants[i].photo_url
                }
            });
            participantSection.setItems(participantsDataSet);
            var sections = [];
            sections.push(participantSection);
            $.listView.setSections(sections);
        });
        $.evt.fetch();
    }
    function listView_Itemclick() {
        alert("not yet implemented.");
    }
    function btnJoinLeave_Click() {
        var join = true;
        join && $.evt.join(function(result) {
            alert(JSON.stringify(result));
        });
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "dateDetails";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.evt = Alloy.createModel("event");
    $.__views.winDateDetails = Ti.UI.createWindow({
        id: "winDateDetails"
    });
    $.__views.winDateDetails && $.addTopLevelView($.__views.winDateDetails);
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
    $.__views.winDateDetails.add($.__views.videoPlayer);
    $.__views.__alloyId21 = Ti.UI.createView({
        layout: "vertical",
        id: "__alloyId21"
    });
    $.__views.winDateDetails.add($.__views.__alloyId21);
    $.__views.lblName = Ti.UI.createLabel({
        width: Ti.UI.FILL,
        id: "lblName"
    });
    $.__views.__alloyId21.add($.__views.lblName);
    $.__views.lblDate = Ti.UI.createLabel({
        width: Ti.UI.FILL,
        id: "lblDate"
    });
    $.__views.__alloyId21.add($.__views.lblDate);
    $.__views.lblOrganizer = Ti.UI.createLabel({
        width: Ti.UI.FILL,
        id: "lblOrganizer"
    });
    $.__views.__alloyId21.add($.__views.lblOrganizer);
    var __alloyId22 = {};
    var __alloyId25 = [];
    var __alloyId27 = {
        type: "Ti.UI.View",
        childTemplates: function() {
            var __alloyId28 = [];
            var __alloyId30 = {
                type: "Ti.UI.Label",
                bindId: "name",
                properties: {
                    width: Ti.UI.FILL,
                    bindId: "name",
                    fontSize: "12dp",
                    fontFamily: "Open Sans",
                    top: "10dp",
                    left: "42dp",
                    color: "#333333"
                }
            };
            __alloyId28.push(__alloyId30);
            var __alloyId32 = {
                type: "Ti.UI.ImageView",
                bindId: "picture",
                properties: {
                    bindId: "picture",
                    top: "2dp",
                    left: "2dp",
                    width: "37dp",
                    height: "37dp"
                }
            };
            __alloyId28.push(__alloyId32);
            var __alloyId34 = {
                type: "Ti.UI.View",
                properties: {
                    height: "20dp"
                }
            };
            __alloyId28.push(__alloyId34);
            return __alloyId28;
        }(),
        properties: {}
    };
    __alloyId25.push(__alloyId27);
    var __alloyId24 = {
        properties: {
            name: "template"
        },
        childTemplates: __alloyId25
    };
    __alloyId22["template"] = __alloyId24;
    $.__views.listView = Ti.UI.createListView({
        templates: __alloyId22,
        id: "listView",
        backgroundColor: "transparent",
        defaultItemTemplate: "template",
        height: "240dp"
    });
    $.__views.__alloyId21.add($.__views.listView);
    listView_Itemclick ? $.__views.listView.addEventListener("itemclick", listView_Itemclick) : __defers["$.__views.listView!itemclick!listView_Itemclick"] = true;
    $.__views.btnJoinLeave = Ti.UI.createButton({
        width: "80%",
        top: "15dp",
        height: "40dp",
        font: {
            fontFamily: "Lobster"
        },
        title: "Teilnehmen",
        id: "btnJoinLeave"
    });
    $.__views.__alloyId21.add($.__views.btnJoinLeave);
    btnJoinLeave_Click ? $.__views.btnJoinLeave.addEventListener("click", btnJoinLeave_Click) : __defers["$.__views.btnJoinLeave!click!btnJoinLeave_Click"] = true;
    var __alloyId35 = function() {
        $.lblName.text = _.isFunction($.evt.transform) ? $.evt.transform()["name"] : $.evt.get("name");
        $.lblName.text = _.isFunction($.evt.transform) ? $.evt.transform()["name"] : $.evt.get("name");
    };
    $.evt.on("fetch change destroy", __alloyId35);
    exports.destroy = function() {
        $.evt.off("fetch change destroy", __alloyId35);
    };
    _.extend($, $.__views);
    arguments[0] || {};
    Alloy.Globals.currentWindow = $.winDateDetails;
    String.prototype.shuffle = function() {
        var a = this.split(""), n = a.length;
        for (var i = n - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = a[i];
            a[i] = a[j];
            a[j] = tmp;
        }
        return a.join("");
    };
    $.winDateDetails.addEventListener("close", function() {
        $.destroy();
    });
    exports.init = _init;
    __defers["$.__views.listView!itemclick!listView_Itemclick"] && $.__views.listView.addEventListener("itemclick", listView_Itemclick);
    __defers["$.__views.btnJoinLeave!click!btnJoinLeave_Click"] && $.__views.btnJoinLeave.addEventListener("click", btnJoinLeave_Click);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;