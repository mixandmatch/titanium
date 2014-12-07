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

function input_onFocus (e) {
	$.lblHinttext.visible = false;
}

function input_onBlur (e) {
	if ($.input.value.length == 0) {
		$.lblHinttext.visible = true;
	}
}

exports.init();
