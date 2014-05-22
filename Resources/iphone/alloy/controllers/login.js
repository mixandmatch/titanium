function Controller() {
    function winLogin_Close() {
        Ti.API.debug("winLogin_Close");
        $.videoPlayer.stop();
    }
    function winLogin_Open() {
        Ti.API.debug("winLogin_Open");
        $.videoPlayer.play();
    }
    function btnLogin_Click() {
        Ti.API.debug("btnLogin_Click");
        Alloy.Globals.loading.show();
        _doLogin($.tfUsername.value, $.tfPassword.value);
    }
    function navigateToHome() {
        var homeWin = Alloy.Globals.Windows.getHome();
        homeWin.open(Alloy.Globals.SLIDE_IN);
        $.winLogin.close();
        Alloy.Globals.NavigationWindow.close();
        Alloy.Globals.NavigationWindow = homeWin;
    }
    function _doLogin(username, password) {
        var aUser = Alloy.createModel("User");
        aUser.login(username, password, {
            success: function() {
                Alloy.Globals.loading.hide();
                navigateToHome();
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
    function btnCreateAccount_Click() {
        Ti.API.debug("btnCreateAccount_Click");
        var win = Alloy.Globals.Windows.getCreateAccount();
        Alloy.Globals.NavigationWindow.openWindow(win);
    }
    function btnResetPwd_Click() {
        Ti.API.debug("btnResetPwd_Click");
        Alloy.Globals.NavigationWindow.openWindow(Alloy.Globals.Windows.getResetPassword());
    }
    function svLogin_FocusInput() {
        $.vLoginForm.animate({
            top: "20dp",
            curve: Ti.UI.ANIMATION_EASE_OUT,
            duration: 350
        });
    }
    function tfUsername_Return() {
        $.tfPassword.focus();
    }
    function tfPassword_Return() {
        $.tfUsername.blur();
        $.tfPassword.blur();
    }
    function tfLogin_Blur() {
        $.vLoginForm.animate({
            top: "120dp",
            curve: Ti.UI.ANIMATION_EASE_IN_OUT,
            duration: 450
        });
    }
    function vLogin_Click() {
        $.tfUsername.blur();
        $.tfPassword.blur();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "login";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.winLogin = Ti.UI.createWindow({
        id: "winLogin",
        title: "Login",
        position: "absolute",
        barColor: "#F2AE72",
        navBarHidden: "true"
    });
    winLogin_Close ? $.__views.winLogin.addEventListener("close", winLogin_Close) : __defers["$.__views.winLogin!close!winLogin_Close"] = true;
    winLogin_Open ? $.__views.winLogin.addEventListener("open", winLogin_Open) : __defers["$.__views.winLogin!open!winLogin_Open"] = true;
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
    $.__views.winLogin.add($.__views.videoPlayer);
    $.__views.svLogin = Ti.UI.createView({
        backgroundColor: "transparent",
        id: "svLogin"
    });
    $.__views.winLogin.add($.__views.svLogin);
    vLogin_Click ? $.__views.svLogin.addEventListener("click", vLogin_Click) : __defers["$.__views.svLogin!click!vLogin_Click"] = true;
    $.__views.ivLoginLogo = Ti.UI.createImageView({
        image: "logo.png",
        width: "150dp",
        top: "50dp",
        id: "ivLoginLogo"
    });
    $.__views.svLogin.add($.__views.ivLoginLogo);
    $.__views.vLoginForm = Ti.UI.createView({
        id: "vLoginForm",
        top: "170dp",
        layout: "vertical",
        height: Ti.UI.FILL
    });
    $.__views.svLogin.add($.__views.vLoginForm);
    $.__views.__alloyId55 = Ti.UI.createView({
        top: "0dp",
        height: Ti.UI.SIZE,
        layout: "vertical",
        id: "__alloyId55"
    });
    $.__views.vLoginForm.add($.__views.__alloyId55);
    $.__views.tfUsername = Ti.UI.createTextField({
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
        id: "tfUsername",
        value: "max@mustermann.de",
        returnKeyType: Ti.UI.RETURNKEY_NEXT,
        hintText: "Benutzername",
        bubbleParent: "false"
    });
    $.__views.__alloyId55.add($.__views.tfUsername);
    tfUsername_Return ? $.__views.tfUsername.addEventListener("return", tfUsername_Return) : __defers["$.__views.tfUsername!return!tfUsername_Return"] = true;
    svLogin_FocusInput ? $.__views.tfUsername.addEventListener("focus", svLogin_FocusInput) : __defers["$.__views.tfUsername!focus!svLogin_FocusInput"] = true;
    tfLogin_Blur ? $.__views.tfUsername.addEventListener("blur", tfLogin_Blur) : __defers["$.__views.tfUsername!blur!tfLogin_Blur"] = true;
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
        value: "1qayxsw2",
        returnKeyType: Ti.UI.RETURNKEY_SEND,
        hintText: "Kennwort",
        bubbleParent: "false",
        passwordMask: "true"
    });
    $.__views.__alloyId55.add($.__views.tfPassword);
    tfPassword_Return ? $.__views.tfPassword.addEventListener("return", tfPassword_Return) : __defers["$.__views.tfPassword!return!tfPassword_Return"] = true;
    svLogin_FocusInput ? $.__views.tfPassword.addEventListener("focus", svLogin_FocusInput) : __defers["$.__views.tfPassword!focus!svLogin_FocusInput"] = true;
    tfLogin_Blur ? $.__views.tfPassword.addEventListener("blur", tfLogin_Blur) : __defers["$.__views.tfPassword!blur!tfLogin_Blur"] = true;
    $.__views.btnLogin = Ti.UI.createButton({
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
        id: "btnLogin",
        title: "Anmelden"
    });
    $.__views.__alloyId55.add($.__views.btnLogin);
    btnLogin_Click ? $.__views.btnLogin.addEventListener("click", btnLogin_Click) : __defers["$.__views.btnLogin!click!btnLogin_Click"] = true;
    $.__views.__alloyId56 = Ti.UI.createView({
        height: Ti.UI.SIZE,
        layout: "vertical",
        bottom: "10dp",
        id: "__alloyId56"
    });
    $.__views.vLoginForm.add($.__views.__alloyId56);
    $.__views.__alloyId57 = Ti.UI.createView({
        height: "20dp",
        top: "40dp",
        id: "__alloyId57"
    });
    $.__views.__alloyId56.add($.__views.__alloyId57);
    $.__views.__alloyId58 = Ti.UI.createView({
        height: "1",
        backgroundColor: "#ffffff",
        width: "34%",
        opacity: "0.7",
        left: "15",
        id: "__alloyId58"
    });
    $.__views.__alloyId57.add($.__views.__alloyId58);
    $.__views.__alloyId59 = Ti.UI.createLabel({
        font: {
            fontFamily: "Lobster"
        },
        text: "oder",
        color: "#ffffff",
        id: "__alloyId59"
    });
    $.__views.__alloyId57.add($.__views.__alloyId59);
    $.__views.__alloyId60 = Ti.UI.createView({
        height: "1",
        backgroundColor: "#ffffff",
        width: "34%",
        opacity: "0.7",
        right: "15",
        id: "__alloyId60"
    });
    $.__views.__alloyId57.add($.__views.__alloyId60);
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
        title: "Konto anlegen"
    });
    $.__views.__alloyId56.add($.__views.btnCreateAccount);
    btnCreateAccount_Click ? $.__views.btnCreateAccount.addEventListener("click", btnCreateAccount_Click) : __defers["$.__views.btnCreateAccount!click!btnCreateAccount_Click"] = true;
    $.__views.btnResetPwd = Ti.UI.createButton({
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
        id: "btnResetPwd",
        title: "Kennwort vergessen"
    });
    $.__views.__alloyId56.add($.__views.btnResetPwd);
    btnResetPwd_Click ? $.__views.btnResetPwd.addEventListener("click", btnResetPwd_Click) : __defers["$.__views.btnResetPwd!click!btnResetPwd_Click"] = true;
    $.__views.rootWin = Ti.UI.iOS.createNavigationWindow({
        window: $.__views.winLogin,
        id: "rootWin"
    });
    $.__views.rootWin && $.addTopLevelView($.__views.rootWin);
    exports.destroy = function() {};
    _.extend($, $.__views);
    "use strict";
    Alloy.Globals.NavigationWindow = $.rootWin;
    Alloy.Globals.currentWindow = $.winLogin;
    Ti.App.addEventListener("resume", function() {
        $.videoPlayer.play();
    });
    exports.doLogin = _doLogin;
    __defers["$.__views.winLogin!close!winLogin_Close"] && $.__views.winLogin.addEventListener("close", winLogin_Close);
    __defers["$.__views.winLogin!open!winLogin_Open"] && $.__views.winLogin.addEventListener("open", winLogin_Open);
    __defers["$.__views.svLogin!click!vLogin_Click"] && $.__views.svLogin.addEventListener("click", vLogin_Click);
    __defers["$.__views.tfUsername!return!tfUsername_Return"] && $.__views.tfUsername.addEventListener("return", tfUsername_Return);
    __defers["$.__views.tfUsername!focus!svLogin_FocusInput"] && $.__views.tfUsername.addEventListener("focus", svLogin_FocusInput);
    __defers["$.__views.tfUsername!blur!tfLogin_Blur"] && $.__views.tfUsername.addEventListener("blur", tfLogin_Blur);
    __defers["$.__views.tfPassword!return!tfPassword_Return"] && $.__views.tfPassword.addEventListener("return", tfPassword_Return);
    __defers["$.__views.tfPassword!focus!svLogin_FocusInput"] && $.__views.tfPassword.addEventListener("focus", svLogin_FocusInput);
    __defers["$.__views.tfPassword!blur!tfLogin_Blur"] && $.__views.tfPassword.addEventListener("blur", tfLogin_Blur);
    __defers["$.__views.btnLogin!click!btnLogin_Click"] && $.__views.btnLogin.addEventListener("click", btnLogin_Click);
    __defers["$.__views.btnCreateAccount!click!btnCreateAccount_Click"] && $.__views.btnCreateAccount.addEventListener("click", btnCreateAccount_Click);
    __defers["$.__views.btnResetPwd!click!btnResetPwd_Click"] && $.__views.btnResetPwd.addEventListener("click", btnResetPwd_Click);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;