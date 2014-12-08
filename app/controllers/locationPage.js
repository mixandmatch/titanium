var args = arguments [0] || {};

$.office_id = args.office_id;
$.locationTitle.text = args.locationTitle;
$.locationBackground.image = args.locationImageUrl;

// var shadowLabels = [$.locationTitle , $.participantsTodayLabel , $.participantsTodayValue , $.participantsTomorrowLabel , $.participantsTomorrowValue , $.skillsLabel , $.skillsValue];
// 
// for (var i = 0 ; i < shadowLabels.length ; i++) {
	// var labelText = shadowLabels [i].text;
	// shadowLabels [i].attributedString = Ti.UI.iOS.createAttributedString({
		// text: labelText ,
		// attributes: [
		// // {
		// // type: Ti.UI.iOS.ATTRIBUTE_SHADOW ,
		// //
		// // value: {
		// // color: '#fff' ,
		// // offset: {
		// // width: 0 ,
		// // height: 0
		// // } ,
		// // blurRadius: 2
		// // } ,
		// // range: [0 , labelText.length]
		// // }
		// {
			// type: Ti.UI.iOS.ATTRIBUTE_FOREGROUND_COLOR ,
			// value: '#eee' ,
			// range: [0 , labelText.length]
		// }
// 
		// // , {
		// // type: Ti.UI.iOS.ATTRIBUTE_STROKE_COLOR ,
		// // value: '#fff' ,
		// // range: [0 , labelText.length]
		// // } , {
		// // type: Ti.UI.iOS.ATTRIBUTE_STROKE_WIDTH ,
		// // value: 3.0 ,
		// // range: [0 , labelText.length]
		// // }
// 
// 
		// // ,{
		// // type: Ti.UI.iOS.ATTRIBUTE_TEXT_EFFECT,
		// // value: Ti.UI.iOS.ATTRIBUTE_LETTERPRESS_STYLE,
		// // range: [0 , labelText.length]
		// //
		// // }
		// ]
	// });
// }
