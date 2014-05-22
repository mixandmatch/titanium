function Controller() {
    function btnResetPassword_Click() {
        Cloud.Users.requestResetPassword({
            email: $.tfEmailAddress.value
        }, function(e) {
            if (1 == e.success) {
                Ti.UI.createAlertDialog({
                    message: "Wir haben Dir eine E-Mail geschickt!",
                    ok: "OK",
                    title: "Hinweis"
                }).show();
                Alloy.Globals.NavigationWindow.close(winResetPassword);
            } else Ti.UI.createAlertDialog({
                message: e.message,
                ok: "OK",
                title: "Fehler"
            }).show();
        });
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "resetPassword";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.winResetPassword = Ti.UI.createWindow({
        id: "winResetPassword",
        layout: "vertical"
    });
    $.__views.winResetPassword && $.addTopLevelView($.__views.winResetPassword);
    $.__views.tfEmailAddress = Ti.UI.createTextField({
        font: {
            fontFamily: "Varela",
            fontSize: "16dp"
        },
        width: "80%",
        top: "15dp",
        height: "40dp",
        paddingLeft: "5dp",
        opacity: .7,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        borderWidth: 1,
        borderColor: "#666666",
        borderRadius: 6,
        id: "tfEmailAddress",
        styleClass: "input",
        hintText: "steve@apple.com"
    });
    $.__views.winResetPassword.add($.__views.tfEmailAddress);
    $.__views.btnResetPassword = Ti.UI.createButton({
        width: "80%",
        top: "15dp",
        height: "40dp",
        font: {
            fontFamily: "Lobster"
        },
        id: "btnResetPassword",
        styleClass: "mybutton",
        title: "Kennwort zurücksetzen"
    });
    $.__views.winResetPassword.add($.__views.btnResetPassword);
    btnResetPassword_Click ? $.__views.btnResetPassword.addEventListener("click", btnResetPassword_Click) : __defers["$.__views.btnResetPassword!click!btnResetPassword_Click"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    arguments[0] || {};
    var Cloud = require("ti.cloud");
    __defers["$.__views.btnResetPassword!click!btnResetPassword_Click"] && $.__views.btnResetPassword.addEventListener("click", btnResetPassword_Click);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;