var args = arguments[0] || {};
var parameters = args["parameters"];

var moment = require('alloy/moment');

var api = {

    initialize : function() {
        if (parameters) {
            $.headerPullView.height = parameters.size ? parameters.size : 60;
        }

    },

    formatDate: function(date) {
        var date = date ? date : new Date();
        return moment(date).format('LLL');
    },

    pulling: function() {
        var t = Ti.UI.create2DMatrix();
        t = t.rotate(-180);
        $.arrow.animate({
            transform: t,
            duration: 180
        });
        $.status.text = L('release_to_update');
    },

    pullingComplete: function() {
        $.arrow.hide();
        $.indicator.show();
        $.status.text = L('loading');
        $.arrow.transform = Ti.UI.create2DMatrix();
    },

    pullingStop: function() {
        var t = Ti.UI.create2DMatrix();
        $.arrow.animate({
            transform: t,
            duration: 180
        });
        $.status.text = L('pull_to_reload');
    },

    updateComplete: function() {
        $.indicator.hide();
        $.arrow.show();
        $.status.text = L('pull_to_reload');
        $.lastUpdate.text = L('updated_at') + ' ' + api.formatDate();
    }
};

exports.pulling = api.pulling;
exports.pullingComplete = api.pullingComplete;
exports.pullingStop = api.pullingStop;
exports.updateComplete = api.updateComplete;

api.initialize();
api.updateComplete();
