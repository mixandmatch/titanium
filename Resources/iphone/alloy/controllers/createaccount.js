function Controller() {
    function btnRegisterCreateAccount_Click() {
        var aUser = Alloy.createModel("User");
        aUser.login(username, password, {
            success: function() {
                Alloy.createController("login").doLogin($.tfEmailAddress.value, $.tfPassword.value);
            },
            error: function(_e) {
                Ti.UI.createAlertDialog({
                    message: _e.message,
                    ok: "OK",
                    title: "Fehler"
                }).show();
            }
        });
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "createAccount";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.winCreateAccount = Ti.UI.createWindow({
        id: "winCreateAccount"
    });
    $.__views.winCreateAccount && $.addTopLevelView($.__views.winCreateAccount);
    $.__views.videoPlayer = Ti.Media.createVideoPlayer({
        id: "videoPlayer",
        ns: Ti.Media,
        top: "0",
        url: "/login.mp4",
        mediaControlStyle: Titanium.Media.VIDEO_CONTROL_NONE,
        scalingMode: Ti.Media.VIDEO_SCALING_ASPECT_FILL,
        repeatMode: Ti.Media.VIDEO_REPEAT_MODE_ONE,
        width: "100%",
        height: "100%",
        autoplay: "true"
    });
    $.__views.winCreateAccount.add($.__views.videoPlayer);
    $.__views.__alloyId0 = Ti.UI.createScrollView({
        top: "0dp",
        layout: "vertical",
        id: "__alloyId0"
    });
    $.__views.winCreateAccount.add($.__views.__alloyId0);
    $.__views.lblRegister = Ti.UI.createLabel({
        text: "Konto anlegen",
        id: "lblRegister"
    });
    $.__views.__alloyId0.add($.__views.lblRegister);
    $.__views.tfFirstname = Ti.UI.createTextField({
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
        id: "tfFirstname",
        hintText: "Max"
    });
    $.__views.__alloyId0.add($.__views.tfFirstname);
    $.__views.tfLastname = Ti.UI.createTextField({
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
        id: "tfLastname",
        hintText: "Mustermann"
    });
    $.__views.__alloyId0.add($.__views.tfLastname);
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
        hintText: "steve@apple.com"
    });
    $.__views.__alloyId0.add($.__views.tfEmailAddress);
    $.__views.tfPassword = Ti.UI.createTextField({
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
        id: "tfPassword",
        hintText: "Kennwort",
        passwordMask: "true"
    });
    $.__views.__alloyId0.add($.__views.tfPassword);
    $.__views.tfConfirmPassword = Ti.UI.createTextField({
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
        id: "tfConfirmPassword",
        hintText: "bestätigen",
        passwordMask: "true"
    });
    $.__views.__alloyId0.add($.__views.tfConfirmPassword);
    $.__views.btnCreateAccount = Ti.UI.createButton({
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
        id: "btnCreateAccount",
        title: "Konto erstellen"
    });
    $.__views.__alloyId0.add($.__views.btnCreateAccount);
    btnRegisterCreateAccount_Click ? $.__views.btnCreateAccount.addEventListener("click", btnRegisterCreateAccount_Click) : __defers["$.__views.btnCreateAccount!click!btnRegisterCreateAccount_Click"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    arguments[0] || {};
    Alloy.Globals.currentWindow = $.winCreateAccount;
    __defers["$.__views.btnCreateAccount!click!btnRegisterCreateAccount_Click"] && $.__views.btnCreateAccount.addEventListener("click", btnRegisterCreateAccount_Click);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;