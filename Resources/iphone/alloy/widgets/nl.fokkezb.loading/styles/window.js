function WPATH(s) {
    var index = s.lastIndexOf("/");
    var path = -1 === index ? "nl.fokkezb.loading/" + s : s.substring(0, index) + "/nl.fokkezb.loading/" + s.substring(index + 1);
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
    priority: 10000.0002,
    key: "loadingMask",
    style: {
        backgroundColor: "#5000",
        backgroundImage: null,
        opacity: 1,
        modal: false
    }
}, {
    isClass: true,
    priority: 10000.0003,
    key: "loadingOuter",
    style: {
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        borderRadius: 10,
        backgroundColor: "#C000"
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
    priority: 10000.0004,
    key: "loadingInner",
    style: {
        top: "20dp",
        right: "20dp",
        bottom: "20dp",
        left: "20dp",
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        layout: "vertical"
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
    priority: 10000.0005,
    key: "loadingIndicator",
    style: {
        top: "0dp",
        style: Ti.UI.ActivityIndicatorStyle.BIG
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
    isClass: true,
    priority: 10000.0007,
    key: "loadingImages",
    style: {
        top: "0dp",
        images: [ "/images/nl.fokkezb.loading/00.png", "/images/nl.fokkezb.loading/01.png", "/images/nl.fokkezb.loading/02.png", "/images/nl.fokkezb.loading/03.png", "/images/nl.fokkezb.loading/04.png", "/images/nl.fokkezb.loading/05.png", "/images/nl.fokkezb.loading/06.png", "/images/nl.fokkezb.loading/07.png", "/images/nl.fokkezb.loading/08.png", "/images/nl.fokkezb.loading/09.png", "/images/nl.fokkezb.loading/10.png", "/images/nl.fokkezb.loading/11.png" ]
    }
}, {
    isClass: true,
    priority: 10000.0008,
    key: "loadingMessage",
    style: {
        top: "20dp",
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        text: L("loadingMessage", "Loading.."),
        color: "#fff",
        textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
    }
}, {
    isClass: true,
    priority: 10101.0006,
    key: "loadingIndicator",
    style: {
        style: Ti.UI.iPhone.ActivityIndicatorStyle.BIG
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
} ];