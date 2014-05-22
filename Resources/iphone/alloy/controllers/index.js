function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.winSplash = Ti.UI.createWindow({
        id: "winSplash"
    });
    $.__views.winSplash && $.addTopLevelView($.__views.winSplash);
    $.__views.__alloyId54 = Ti.UI.createView({
        backgroundColor: "white",
        id: "__alloyId54"
    });
    $.__views.winSplash.add($.__views.__alloyId54);
    exports.destroy = function() {};
    _.extend($, $.__views);
    setTimeout(function() {
        Alloy.Globals.Windows.getLogin().open(Alloy.Globals.SLIDE_IN);
    }, 500);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;