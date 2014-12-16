var args = arguments [0] || {};

exports.init = function (callback) {
	_.extend($.input , args);
	$.lblHinttext.text = $.input.hintText;
	$.input.hintText = "";
	
	$.lblHinttext.visible = ($.input.value.length > 0 ? false : true);
	
	if (callback) {
		callback();
	}
};

var getValue = function() {
    return $.input.value;
};

var setValue = function(value) {
    $.input.value = value;
};

exports.getValue = getValue;
exports.setValue = setValue;

Object.defineProperty($, "value", {
    get: getValue,
    set: setValue
});

function input_onFocus (e) {
	$.lblHinttext.visible = false;
}

function input_onBlur (e) {
	if ($.input.value.length == 0) {
		$.lblHinttext.visible = true;
	}
}

exports.init();
