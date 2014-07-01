"use strict";
var mod = require('bencoding.blur');

Array.prototype.removeAt = function (index) {
    this.splice(index , 1);
};

Alloy.Globals.currentWindow = $.winHome;

var moment = require("moment-with-langs");
var args = arguments [0] || {};
//var dateDataSet = new Array ();
var dateDataSet = [];
const LISTITEM_HEIGHT = 320;
const BLUR_RADIUS = 1;

var refreshControl = Ti.UI.createRefreshControl({
    tintColor: 'red'
});

function scrambleWord (s) {
    var word = s.split('') , scram = '';
    while (word.length) {
        scram += word.splice(Math.floor(Math.random()*word.length), 1) [0];
    }
    return scram;
}

$.listView.refreshControl = refreshControl;

refreshControl.addEventListener('refreshstart' , function (e) {
    Ti.API.info('refreshstart');
    loadEvents($.svLocations.views [$.svLocations.currentPage].office_id);
});

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

    var section = $.listView.sections [e.sectionIndex];

    var item = section.getItemAt(e.itemIndex);

    var dateDetailsCtrl = Alloy.Globals.Windows.getEventDetailsCtrl().init({
        dateId: item.properties.eventId ,
        date: item.properties.eventDate,
        officeId: $.svLocations.views [$.svLocations.currentPage].office_id,
        canteen: item.properties.canteen,
        lunchTag: item.properties.lunchTag
    });
    Alloy.Globals.NavigationWindow.openWindow(Alloy.Globals.Windows.getEventDetails());
    // $.ivBackground.animate({
    // opacity: 0 ,
    // duration: 100
    // });
}

function btnAddDate_Click (e) {

    var createDateCtrl = Alloy.createController("createDate");
    Ti.API.debug("createDateCtrl.getView = " + createDateCtrl.getView());
    Ti.API.debug("Global NavWindow = " + Alloy.Globals.NavigationWindow.openWindow);
    Alloy.Globals.NavigationWindow.openWindow(createDateCtrl.getView());
}

$.svLocations.addEventListener("scrollEnd" , svLocation_scrollend);

var currentPage = -1;

function svLocation_scrollend (e) {
    //get current scrollview
    //Ti.API.debug("setting background image = " +
    // $.svLocations.views [e.currentPage].office_id);
    loadEvents($.svLocations.views [e.currentPage].office_id);

    if (currentPage != -1) {
        $.pagingControl.children [currentPage].animate({
            backgroundColor: "transparent" ,
            duration: 500
        });
    }

    $.pagingControl.children [e.currentPage].animate({
        backgroundColor: "#F2E394" ,
        duration: 500
    });

    currentPage = e.currentPage;

}

$.winHome.addEventListener("focus" , function (e) {
    //$.videoPlayer.play();

    Ti.API.debug("winHome:focus");
});

Ti.App.addEventListener("office_found" , function (e) {

    $.svLocations.removeAllChildren();
    var views = [];

    for (var i = 0 ; i < e.offices.length ; i++) {

        if (e.offices [i].name) {

            var view = Ti.UI.createView({
                "class": "titleCtrl" ,
                office_id: e.offices [i].id ,
                width: Ti.UI.SIZE ,
                height: Ti.UI.SIZE
            });

            view.add(Ti.UI.createLabel({
                "class": "titleLocation" ,
                text: e.offices [i].name.toUpperCase() ,
                width: Ti.UI.SIZE ,
                color: "#9CBCD8"

            }));
            views.push(view);

            var pagingControlView = Ti.UI.createView({
                width: Ti.Platform.displayCaps.platformWidth / e.offices.length ,
                height: Ti.UI.FILL
            });
            $.pagingControl.add(pagingControlView);
        }
    }

    $.svLocations.views = views;

    svLocation_scrollend({
        currentPage: 0
    });

    Alloy.Globals.loading.hide();
});

function _init () {

    Alloy.Globals.NavigationWindow = $.rootHome;
    Alloy.Globals.loading.show();
    var offices = Alloy.Collections.instance("office");
    offices.fetch({
        urlparams: {
            lon: Ti.App.Properties.getObject('currentLocation').longitude ,
            lat: Ti.App.Properties.getObject('currentLocation').latitude ,
            d: 10
        } ,
        success: function (data) {

            Ti.App.fireEvent('office_found' , {
                offices: data.toJSON()
            });
        }

    });
}

function loadEvents (office_id) {

    var events = Alloy.Collections.event;

    events.fetch({
        custompath: "byOffice" ,
        urlparams: {
            office_id: office_id
        } ,
        success: function () {

            Ti.API.debug("#lunch dates = " + events.length);
            var dateSection = Ti.UI.createListSection({
                headerView: Ti.UI.createView({})
            });

            dateDataSet = [];

            $.vFirstTimeInstruction.visible = (events.length == 0);
            $.listView.visible = (events.length > 0);
            
            var start = moment();

            for (var i = 0 ; i < events.length ; i++) {
                var element = events.at(i);
                var lunchtime = element.get("start_time");

                var diff = moment(lunchtime).diff(moment() , "minutes");
                Ti.API.debug("diff = " + diff);

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
                            eventId: element.get("id"),
                            eventDate: element.get("start_time"),
                            lunchTag: element.get("custom_fields").lunchTag,
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
            Ti.API.debug("time consumption for listview construction: " + end.diff(start));

            refreshControl.endRefreshing();

            setTimeout(function () {
                Alloy.Globals.loading.hide();
            } , 1000);

        } ,
        error: function (collection , response) {
            Ti.API.error("error " + JSON.stringify(collection));
        }

    });

}

_init();

