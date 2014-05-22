function Controller() {
    function listView_Delete(e) {
        Ti.API.debug("itemindex = " + e.itemIndex);
        for (var i = 0; $.listView.sections[0].items.length > i; i++) Ti.API.debug("item: " + JSON.stringify($.listView.sections[0].items[i]));
        Ti.API.debug("deleting ..." + JSON.stringify(dateDataSet[e.itemIndex]));
        eventToDelete = Alloy.createModel("Event", {
            id: dateDataSet[e.itemIndex].place.id
        });
        eventToDelete.destroy();
        dateDataSet.removeAt(e.itemIndex);
        $.listView.height -= LISTITEM_HEIGHT;
    }
    function listView_Itemclick(e) {
        Ti.API.debug("$.listView_ItemClick");
        var section = $.listView.sections[e.sectionIndex];
        var item = section.getItemAt(e.itemIndex);
        Ti.API.debug(JSON.stringify(item));
        Alloy.Globals.Windows.getDateDetailsCtrl().init({
            dateId: item.properties.eventId,
            officeId: $.svLocations.views[$.svLocations.currentPage].office_id
        });
        Alloy.Globals.NavigationWindow.openWindow(Alloy.Globals.Windows.getDateDetails());
    }
    function btnAddDate_Click() {
        Alloy.Globals.Windows.getCreateDateCtrl().init({});
        Alloy.Globals.NavigationWindow.openWindow(Alloy.Globals.Windows.getCreateDate());
    }
    function svLocation_scrollend(e) {
        Ti.API.debug("setting background image = " + $.svLocations.views[e.currentPage].office_id);
        loadEvents($.svLocations.views[e.currentPage].office_id);
        $.videoPlayer.url = "/" + $.svLocations.views[e.currentPage].office_id + ".mp4";
        $.videoPlayer.play();
    }
    function _init() {
        var offices = Alloy.Collections.instance("office");
        offices.fetch({
            urlparams: {
                lon: Alloy.Globals.currentLocation.longitude,
                lat: Alloy.Globals.currentLocation.latitude,
                d: 10
            },
            success: function(data) {
                Ti.App.fireEvent("office_found", {
                    offices: data.toJSON()
                });
            }
        });
    }
    function loadEvents(office_id) {
        var events = Alloy.Collections.event;
        events.fetch({
            custompath: "byOffice",
            urlparams: {
                office_id: office_id
            },
            success: function() {
                var dateSection = Ti.UI.createListSection({
                    headerView: Ti.UI.createView({})
                });
                dateDataSet = [];
                for (var i = 0; events.length - 1 > i; i++) {
                    var element = events.at(i);
                    _.isEmpty(element) || dateDataSet.push({
                        date: {
                            text: moment(element.get("start_time")).format("DD.MM.YYYY hh:mm")
                        },
                        location: {
                            text: element.get("place").name
                        },
                        properties: {
                            backgroundColor: "transparent",
                            selectedBackgroundColor: "transparent",
                            canEdit: true,
                            height: LISTITEM_HEIGHT,
                            eventId: element.get("id")
                        }
                    });
                }
                var sections = [];
                $.listView.setSections([]);
                var height = LISTITEM_HEIGHT * dateDataSet.length;
                dateSection.setItems(dateDataSet);
                sections.push(dateSection);
                $.listView.setSections(sections);
                $.listView.height = height;
                refreshControl.endRefreshing();
                setTimeout(function() {
                    Alloy.Globals.loading.hide();
                }, 1e3);
            },
            error: function(collection) {
                Ti.API.error("error " + JSON.stringify(collection));
            }
        });
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "home";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    Alloy.Collections.instance("event");
    Alloy.Collections.instance("place");
    $.__views.winHome = Ti.UI.createWindow({
        barColor: "#A0D468",
        id: "winHome",
        title: "Mix&Match",
        showPagingControl: "true",
        navBarHidden: "false"
    });
    $.__views.__alloyId41 = Ti.UI.createView({
        height: "70dp",
        id: "__alloyId41"
    });
    var __alloyId42 = [];
    $.__views.svLocations = Ti.UI.createScrollableView({
        left: 0,
        right: 20,
        views: __alloyId42,
        id: "svLocations",
        scrollEnd: "svLocation_scrollend"
    });
    $.__views.__alloyId41.add($.__views.svLocations);
    $.__views.btnSettings = Ti.UI.createImageView({
        right: "0dp",
        image: "gear.png",
        id: "btnSettings"
    });
    $.__views.__alloyId41.add($.__views.btnSettings);
    $.__views.winHome.titleControl = $.__views.__alloyId41;
    $.__views.videoPlayer = Ti.Media.createVideoPlayer({
        id: "videoPlayer",
        ns: Ti.Media,
        top: "-70dp",
        mediaControlStyle: Titanium.Media.VIDEO_CONTROL_NONE,
        scalingMode: Ti.Media.VIDEO_SCALING_ASPECT_FILL,
        repeatMode: Ti.Media.VIDEO_REPEAT_MODE_ONE,
        width: "100%",
        height: "100%",
        autoplay: "false"
    });
    $.__views.winHome.add($.__views.videoPlayer);
    $.__views.lvContainer = Ti.UI.createView({
        width: "90%",
        top: 0,
        bottom: "60dp",
        id: "lvContainer"
    });
    $.__views.winHome.add($.__views.lvContainer);
    var __alloyId43 = {};
    var __alloyId46 = [];
    var __alloyId48 = {
        type: "Ti.UI.View",
        childTemplates: function() {
            var __alloyId49 = [];
            var __alloyId51 = {
                type: "Ti.UI.Label",
                bindId: "date",
                properties: {
                    bindId: "date",
                    fontSize: "12dp",
                    top: "5dp",
                    left: "20dp",
                    color: "#333333"
                }
            };
            __alloyId49.push(__alloyId51);
            var __alloyId53 = {
                type: "Ti.UI.Label",
                bindId: "location",
                properties: {
                    bindId: "location",
                    fontSize: "17dp",
                    bottom: "5dp",
                    left: "20dp",
                    color: "#333333"
                }
            };
            __alloyId49.push(__alloyId53);
            return __alloyId49;
        }(),
        properties: {
            backgroundColor: "#ffffff",
            opacity: "0.7",
            height: "55dp",
            borderColor: "#666666",
            borderWidth: "1",
            borderRadius: "6"
        }
    };
    __alloyId46.push(__alloyId48);
    var __alloyId45 = {
        properties: {
            name: "template",
            height: "60dp"
        },
        childTemplates: __alloyId46
    };
    __alloyId43["template"] = __alloyId45;
    $.__views.listView = Ti.UI.createListView({
        top: "15dp",
        height: Ti.UI.FILL,
        separatorStyle: "Ti.UI.iPhone.ListViewSeparatorStyle.NONE",
        templates: __alloyId43,
        id: "listView",
        backgroundColor: "transparent",
        defaultItemTemplate: "template",
        editable: "true",
        deleteButtonTitle: "Verlassen"
    });
    $.__views.lvContainer.add($.__views.listView);
    listView_Delete ? $.__views.listView.addEventListener("delete", listView_Delete) : __defers["$.__views.listView!delete!listView_Delete"] = true;
    listView_Itemclick ? $.__views.listView.addEventListener("itemclick", listView_Itemclick) : __defers["$.__views.listView!itemclick!listView_Itemclick"] = true;
    $.__views.vBtnWrapper = Ti.UI.createView({
        bottom: "0",
        height: "80dp",
        id: "vBtnWrapper"
    });
    $.__views.winHome.add($.__views.vBtnWrapper);
    $.__views.btnAddDate = Ti.UI.createButton({
        width: "80%",
        top: "15dp",
        height: "40dp",
        font: {
            fontFamily: "Lobster",
            fontSize: "19dp"
        },
        borderRadius: 6,
        borderWidth: 1,
        borderColor: "#666666",
        color: "#333333",
        backgroundColor: "#ffffff",
        opacity: .7,
        id: "btnAddDate",
        title: "Date erstellen"
    });
    $.__views.vBtnWrapper.add($.__views.btnAddDate);
    btnAddDate_Click ? $.__views.btnAddDate.addEventListener("click", btnAddDate_Click) : __defers["$.__views.btnAddDate!click!btnAddDate_Click"] = true;
    $.__views.rootHome = Ti.UI.iOS.createNavigationWindow({
        backgroundImage: "http://lorempixel.com/660/1156/food/",
        backgroundLeftCap: 30,
        backgroundTopCap: 30,
        window: $.__views.winHome,
        id: "rootHome"
    });
    $.__views.rootHome && $.addTopLevelView($.__views.rootHome);
    exports.destroy = function() {};
    _.extend($, $.__views);
    "use strict";
    Array.prototype.removeAt = function(index) {
        this.splice(index, 1);
    };
    Alloy.Globals.currentWindow = $.winHome;
    require("ti.cloud");
    var moment = require("moment-with-langs");
    arguments[0] || {};
    var dateDataSet = [];
    const LISTITEM_HEIGHT = 60;
    var refreshControl = Ti.UI.createRefreshControl({
        tintColor: "red"
    });
    $.listView.refreshControl = refreshControl;
    refreshControl.addEventListener("refreshstart", function() {
        Ti.API.info("refreshstart");
        loadEvents();
    });
    $.svLocations.addEventListener("scrollEnd", svLocation_scrollend);
    $.winHome.addEventListener("focus", function() {
        $.videoPlayer.play();
        Ti.API.debug("winHome:focus");
    });
    Ti.App.addEventListener("office_found", function(e) {
        $.svLocations.removeAllChildren();
        var views = [];
        for (var i = 0; e.offices.length > i; i++) if (e.offices[i].name) {
            Ti.API.debug("office name = " + e.offices[i].name);
            Ti.API.debug("office id = " + e.offices[i].id);
            var view = Ti.UI.createView({
                "class": "titleCtrl",
                height: "70dp",
                office_id: e.offices[i].id
            });
            view.add(Ti.UI.createLabel({
                "class": "titleLocation",
                text: e.offices[i].name
            }));
            views.push(view);
        }
        $.svLocations.views = views;
        svLocation_scrollend({
            currentPage: 0
        });
    });
    _init();
    __defers["$.__views.listView!delete!listView_Delete"] && $.__views.listView.addEventListener("delete", listView_Delete);
    __defers["$.__views.listView!itemclick!listView_Itemclick"] && $.__views.listView.addEventListener("itemclick", listView_Itemclick);
    __defers["$.__views.btnAddDate!click!btnAddDate_Click"] && $.__views.btnAddDate.addEventListener("click", btnAddDate_Click);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;