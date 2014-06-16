var args = arguments [0] || {};

//TODO init on each focus

function _init (_args) {
	Alloy.Globals.currentWindow = $.winCreateAccount;
}

exports.init = _init;

_init(args);

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
	$.dlgPhotoAction.show();
}

function btnRegisterCreateAccount_Click (e) {

	var aUser = Alloy.createModel('User');

    //.toImage() outputs .png format
	aUser.register($.tfEmailAddress.value , $.tfPassword.value , $.tfFirstname.value , $.tfLastname.value , $.ivMugshot.toImage() , {
		success: function (_d) {
			var homeWin = Alloy.Globals.Windows.getHome();
			homeWin.open(Alloy.Globals.SLIDE_IN);
			Alloy.Globals.NavigationWindow.close();
			Alloy.Globals.NavigationWindow = homeWin;
		} ,
		error: function (_e) {
			Ti.UI.createAlertDialog({
				message: _e.message ,
				ok: 'OK' ,
				title: 'Fehler'
			}).show();
		}

	});
}
