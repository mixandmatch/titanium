var args = arguments [0] || {};

//TODO init on each focus
exports.postHide = function () {
};

exports.preShow = function () {
    //initControlAnimation();
    $.shadowview.opacity=0;
    if (OS_IOS) {
        $.blurview.opacity=0;
    }
    Alloy.Globals.GoogleAnalytics.trackScreen({
        screenName: "Create Account"
    });
};

function initControlAnimation () {
    // for (var i = 0 ; i < animationChain.length ; i++) {
        // animationChain [i].left = Ti.Platform.displayCaps.platformWidth;
        // animationChain [i].visible = false;
    // }
    // $.bottomNavigation.bottom=-80;
}

exports.postShow = function () {
    
    $.shadowview.animate({
        opacity:0.7,
        duration:750,
        curve: Ti.UI.ANIMATION_CURVE_EASE_OUT
    });
    if (OS_IOS) {
        $.blurview.animate({
        opacity:1,
        duration:1000,
        curve: Ti.UI.ANIMATION_CURVE_EASE_OUT
    });
    }
    
    // $.bottomNavigation.animate({
        // bottom:0,
        // duration:250,
        // curve: Ti.UI.ANIMATION_CURVE_EASE_OUT
    // });
};

var tcLinkText = "Nutzungs- und Datenschutzbedingungen.";
var tcLink;
if (OS_IOS) {
	var atrStr = Ti.UI.iOS.createAttributedString({
		text: tcLinkText ,
		attributes: [
		// Underlines text
		{
			type: Titanium.UI.iOS.ATTRIBUTE_UNDERLINES_STYLE ,
			value: Titanium.UI.iOS.ATTRIBUTE_UNDERLINE_STYLE_SINGLE ,
			range: [0 , tcLinkText.length]
		} , {
			type: Ti.UI.iOS.ATTRIBUTE_FONT ,
			value: {
				fontSize: 10
			} ,
			range: [0 , tcLinkText.length]
		}]
	});

	tcLink = Ti.UI.createLabel({
		attributedString: atrStr ,
		class: "tc"
	});
}
else
if (OS_ANDROID) {
	tcLink = Ti.UI.createLabel({
	text: tcLinkText,
	class : "tc"
	});
}

$.tc.add(tcLink);

function _init (_args) {
	Alloy.Globals.currentWindow = $.winCreateAccount;

}

exports.init = _init;

_init(args);

function tc_onClick (e) {
	Alloy.createController("tc").getView().open({
		modal: true
	});
	
	Alloy.Globals.GoogleAnalytics.trackEvent({
        category: "link",
        action: "click" ,
        label: "createAccount.tc"
    });
}

function tfFirstname_Return (e) {
	$.tfLastname.focus();
}

function tfLastname_Return (e) {
	$.tfEmailAddress.focus();
}

function tfEmailAddress_Return (e) {
	$.tfPassword.focus();
}

function tfPassword_Return (e) {
	$.tfConfirmPassword.focus();
}

function dlgPhotoAction_Click (e) {
    
    Alloy.Globals.GoogleAnalytics.trackEvent({
        category: "Dialog" ,
        action: "click" ,
        label: "createAccount.dlgPhotoAction"
    });
    
	if (e.index === 2) {
		return;
	}
	else
	if (e.index === 1) {
		getPhotoFromGallery();
	}
	else
	if (e.index === 0) {
		//todo: show camera with front cam on
		takePhoto();
	}
}

function getPhotoFromGallery (callback) {
	Ti.Media.openPhotoGallery({
		success: function (e) {
			$.ivMugshot.image = e.media;
		} ,
		cancel: function () {
			Ti.API.info('user cancelled galary.');
		} ,
		error: function (error) {
			var alert = Titanium.UI.createAlertDialog({
				title: 'Sorry!' ,
				message: 'Error: ' + error.code
			});
			alert.show();
		} ,
		mediaTypes: Ti.Media.MEDIA_TYPE_PHOTO
	});
}

function takePhoto (callback) {
	Titanium.Media.showCamera({
		success: function (event) {
			// called when media returned from the camera
			Ti.API.debug('Our type was: ' + event.mediaType);
			if (event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
			    //var tmpImage = Ti.UI.createImageView({image:event.media, width:event.width, height:event.height}).toImage();
				$.ivMugshot.image = event.media;
			}
			else {
				alert("got the wrong type back =" + event.mediaType);
			}
		} ,
		cancel: function () {
			// called when user cancels taking a picture
		} ,
		error: function (error) {
			// called when there's an error
			var a = Titanium.UI.createAlertDialog({
				title: 'Camera'
			});
			if (error.code == Titanium.Media.NO_CAMERA) {
				a.setMessage('Please run this test on device');
			}
			else {
				a.setMessage('Unexpected error: ' + error.code);
			}
			a.show();
		} ,
		saveToPhotoGallery: true ,
		// allowEditing and mediaTypes are iOS-only settings
		allowEditing: true ,
		mediaTypes: [Ti.Media.MEDIA_TYPE_PHOTO]
	});
}

function ivMugshot_Click (e) {
    Alloy.Globals.GoogleAnalytics.trackEvent({
        category: "button" ,
        action: "click" ,
        label: "createAccount.ivMugshot"
    });
	$.dlgPhotoAction.show();
}

function btnRegisterCreateAccount_Click (e) {

	Alloy.Globals.GoogleAnalytics.trackEvent({
        category: "button",
        action: "click" ,
        label: "createAccount.btnRegisterCreateAccount"
    });
    
    Alloy.Globals.loading.show();
    
	var aUser = Alloy.createModel('User');

	if ($.ivMugshot.image == '/images/profile.png') {
	    Alloy.Globals.loading.hide();
		Ti.UI.createAlertDialog({
			message: "Bitte wählen Sie ein Foto aus" ,
			ok: 'OK' ,
			title: 'Error'
		}).show();

		return;
	}

	aUser.register($.tfEmailAddress.value , $.tfPassword.value , $.tfFirstname.value , $.tfLastname.value , (OS_IOS ? $.ivMugshot.toImage() : $.ivMugshot.toImage().media) , {
		success: function (_d) {
		    Alloy.Globals.loading.hide();
		    Alloy.Globals.openHomeScreen();
			//Alloy.Globals.GoogleAnalytics.event("createAccount" , "registration" , "successful");
		} ,
		error: function (_e) {
		    Alloy.Globals.loading.hide();
			Ti.UI.createAlertDialog({
				message: _e.error ,
				ok: 'OK' ,
				title: 'Fehler'
			}).show();
			//Alloy.Globals.GoogleAnalytics.event("createAccount" , "registration" , "error" , JSON.stringify(_e));
		}

	});
}
