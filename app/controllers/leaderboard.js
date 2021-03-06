var args = arguments[0] || {};
var user = Alloy.Collections.instance("user");

exports.preShow = function () {
    
    Alloy.Globals.GoogleAnalytics.trackScreen({
        screenName: "Leaderboard"
    });
    
    user.fetch();
};

exports.postShow = function () {

    if (OS_IOS) {
        $.blurview.animate({
            opacity: 1 ,
            duration: 1000 ,
            curve: Ti.UI.ANIMATION_CURVE_EASE_OUT
        });
    }

};

exports.preHide = function () {
    if (OS_IOS) {
        $.blurview.animate({
            opacity: 0 ,
            duration: 1000 ,
            curve: Ti.UI.ANIMATION_CURVE_EASE_OUT
        });
    }
}; 

function doTransform(model) {
    
    var o = model.toJSON();
    o.userPoints = o.points;
    o.userName = o.first_name + " " + o.last_name;
    o.userImage = (o.photo ? o.photo.urls.square_75: "/images/profile.png");
    
    return o;
}