function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "com.mcongrove.toast/" + s : s.substring(0, index) + "/com.mcongrove.toast/" + s.substring(index + 1);
    return path;
}

module.exports = [ {
    isApi: true,
    priority: 1000.0003,
    key: "Button",
    style: {
        width: "80%",
        top: "15dp",
        height: "40dp",
        font: {
            fontFamily: "Lobster"
        }
    }
}, {
    isClass: true,
    priority: 10000.0002,
    key: "form",
    style: {
        top: "0dp"
    }
}, {
    isClass: true,
    priority: 10000.0004,
    key: "mybutton",
    style: {
        borderRadius: 6,
        borderWidth: 1,
        borderColor: "#666666",
        color: "#333333",
        backgroundColor: "#ffffff",
        opacity: .7,
        font: {
            fontFamily: "Lobster",
            fontSize: "19dp"
        }
    }
}, {
    isClass: true,
    priority: 10000.0005,
    key: "italic",
    style: {
        font: {
            fontStyle: "italic"
        }
    }
}, {
    isClass: true,
    priority: 10000.0006,
    key: "lobster",
    style: {
        font: {
            fontFamily: "Lobster"
        }
    }
}, {
    isClass: true,
    priority: 10000.0007,
    key: "input",
    style: {
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
        borderRadius: 6
    }
}, {
    isId: true,
    priority: 100000.0001,
    key: "ivLoginLogo",
    style: {
        image: "logo.png",
        width: "150dp",
        top: "10dp"
    }
}, {
    isId: true,
    priority: 100000.0009,
    key: "Wrapper",
    style: {
        width: Ti.UI.FILL,
        height: "70dp",
        bottom: "0dp"
    }
}, {
    isId: true,
    priority: 100000.001,
    key: "Modal",
    style: {
        top: "70dp",
        width: "280dp",
        height: "30dp",
        borderRadius: 5,
        backgroundColor: "#000"
    }
}, {
    isId: true,
    priority: 100000.0011,
    key: "textLabel",
    style: {
        top: "0dp",
        left: "0dp",
        right: "0dp",
        height: "30dp",
        color: "#FFF",
        textAlign: "center",
        font: {
            fontSize: 13,
            fontWeight: "bold"
        }
    }
} ];