var args = arguments [0] || {};

Alloy.Globals.currentWindow = $.winDateDetails;

//shuffle names until short timespan before lunch is taking place
String.prototype.shuffle = function () {
    var a = this.split(""),
        n = a.length;

    for(var i = n - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
    return a.join("");
};

function _init (_args) {
	Ti.API.debug(JSON.stringify($.lblDateId));

	$.evt = Alloy.createModel("event" , {
		id: _args.dateId
	});
	
	$.videoPlayer.url = _args.officeId;

	$.evt.on('fetch' , function (model) {
		Ti.API.debug(JSON.stringify($.evt));
		
		$.lblName.text = $.evt.get("name");
		$.lblOrganizer.text = $.evt.get("user").first_name + " " + $.evt.get("user").last_name;
		$.lblDate.text = moment($.evt.get("start_time")).format('dd.mm.YYYY, hh:mm');

		//todo: bind listview to participants array
		var participantSection = Ti.UI.createListSection({
			headerTitle: 'Teilnehmer'
		});
		var participants = $.evt.get("custom_fields").participants;

		var participantsDataSet = [];
		for (var i = 0 ; i < participants.length ; i++) {
			participantsDataSet.push({
				name: {
					text: participants [i].name
				} ,
				picture: {
					image: participants [i].photo_url
				}
			});
		}

		participantSection.setItems(participantsDataSet);
		var sections = [];

		sections.push(participantSection);

		$.listView.setSections(sections);
	});

	$.evt.fetch();
}

function listView_Itemclick (e) {
	alert("not yet implemented.");
}

function btnJoinLeave_Click (e) {
    var join = true;
    if (join) {
        $.evt.join(function(result) {
           alert(JSON.stringify(result)); 
        });
    } else 
    {
        //leave
    }
}

$.winDateDetails.addEventListener("close" , function (e) {
	$.destroy();
});

exports.init = _init;
