var args = arguments [0] || {};



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
    Alloy.Globals.currentWindow = $.winDateDetails;
	Ti.API.debug(JSON.stringify($.lblDateId));

	$.evt = Alloy.createModel("event" , {
		id: _args.dateId
	});
	
	//$.videoPlayer.url = _args.officeId;
	$.videoPlayer.play();

	$.evt.on('fetch' , function (model) {
		Ti.API.debug(JSON.stringify($.evt));
		
		$.lblName.text = $.evt.get("name");
		$.lblOrganizer.text = $.evt.get("user").first_name + " " + $.evt.get("user").last_name;
		$.lblDate.text = moment($.evt.get("start_time")).format('dd.mm.YYYY, hh:mm');

		var headerView = Ti.UI.createView({
		    height:40,
		    backgroundColor: "#8C4646"
		});
		headerView.add(Ti.UI.createLabel({
		    text:"Teilnehmer",
		    left:10,
		    width: Ti.UI.FILL,
		    color: "#F2AE72",
		    class:"lobster"
		}));
		
		var participantSection = Ti.UI.createListSection({
			headerView: headerView
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
