function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "com.mcongrove.toast/" + s : s.substring(0, index) + "/com.mcongrove.toast/" + s.substring(index + 1);
    return path;
}

function Controller() {
    function open() {
        CONFIG.view.add($.Wrapper);
        $.Modal.animate({
            top: "20dp",
            duration: 250
        });
    }
    function close() {
        $.Modal.animate({
            top: "70dp",
            duration: 250
        }, function() {
            "undefined" != typeof CONFIG.close && CONFIG.view.remove($.Wrapper);
        });
    }
    new (require("alloy/widget"))("com.mcongrove.toast");
    this.__widgetId = "com.mcongrove.toast";
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "widget";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.Wrapper = Ti.UI.createView({
        width: Ti.UI.FILL,
        height: "70dp",
        bottom: "0dp",
        id: "Wrapper"
    });
    $.__views.Wrapper && $.addTopLevelView($.__views.Wrapper);
    $.__views.Modal = Ti.UI.createView({
        top: "70dp",
        width: "280dp",
        height: "30dp",
        borderRadius: 5,
        backgroundColor: "#000",
        id: "Modal"
    });
    $.__views.Wrapper.add($.__views.Modal);
    $.__views.textLabel = Ti.UI.createLabel({
        top: "0dp",
        left: "0dp",
        right: "0dp",
        height: "30dp",
        color: "#FFF",
        textAlign: "center",
        font: {
            fontSize: 13,
            fontWeight: "bold"
        },
        id: "textLabel"
    });
    $.__views.Modal.add($.__views.textLabel);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var CONFIG = arguments[0] || {};
    if (CONFIG.text) {
        $.textLabel.text = CONFIG.text;
        open();
        setTimeout(function() {
            close();
        }, CONFIG.duration ? CONFIG.duration + 250 : 3e3);
    }
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;