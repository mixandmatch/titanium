exports.definition = {
	config: {
		"URL": require("alloy").CFG.restapi + "user" ,
		adapter: {
			type: "restapi" ,
			"idAttribute": "id" ,
			collection_name: "users" ,
			"debug": 1,
		} ,
		headers: {
			"_session_id": function () {
				return Ti.App.Properties.getString("acs.sessionId");
			}

		}
	} ,

	extendModel: function (Model) {

		var that = this;
		function login (_login , _password , _opts) {
			var xhr = require("xhr");
			xhr.do({

				type: "POST" ,
				url: that.config.URL + "/login" ,
				data: {
					username: _login ,
					password: _password
				}

			} , function (e) {

				if (e.success) {

					Ti.App.Properties.setString("acs.sessionId" , e.responseJSON.sessionId);
					Ti.App.Properties.setString("username" , _login);
					Ti.App.Properties.setObject("currentUser" , JSON.parse(e.responseText).user);

					if (Ti.Platform.name == "iPhone OS" && parseInt(Ti.Platform.version.split(".") [0]) >= 8) {

						// Wait for user settings to be registered before registering
						// for push notifications
						Ti.App.iOS.addEventListener('usernotificationsettings' , function registerForPush () {

							// Remove event listener once registered for push
							// notifications
							Ti.App.iOS.removeEventListener('usernotificationsettings' , registerForPush);

							Ti.Network.registerForPushNotifications({
								success: deviceTokenSuccess ,
								error: deviceTokenError ,
								callback: receivePush
							});
						});

						// Register notification types to use
						Ti.App.iOS.registerUserNotificationSettings({
							types: [Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT , Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND , Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE]
						});
					}

					// For iOS 7 and earlier
					else {
						Ti.Network.registerForPushNotifications({
							// Specifies which notifications to receive
							types: [Ti.Network.NOTIFICATION_TYPE_BADGE , Ti.Network.NOTIFICATION_TYPE_ALERT , Ti.Network.NOTIFICATION_TYPE_SOUND] ,
							success: deviceTokenSuccess ,
							error: deviceTokenError ,
							callback: receivePush
						});
					}
					// Process incoming push notifications
					function receivePush (e2) {

						if (e2.inBackground) {
							var notification = Ti.App.iOS.scheduleLocalNotification({
								// Alert will display 'slide to update' instead of 'slide to
								// view'
								// or 'Update' instead of 'Open' in the alert dialog
								alertAction: "open" ,
								// Alert will display the following message
								alertBody: e2.data.alert ,
								sound: "notification.wav"
							});
						}
						else {

							Alloy.Globals.Notifier.show({
								message: e2.data.alert ,
								icon: '/appicon.png' ,
								pushForce: 10 ,
								duration: 2500 ,
								click: function () {
									//TODO: go to current meeting.
								}

							});
						}

					}

					// Save the device token for subsequent API calls
					function deviceTokenSuccess (e2) {
						Alloy.Globals.DeviceToken = e2.deviceToken;

						//need to refactor soon because we are already logged in.

						Cloud.Users.login({
							login: _login ,
							password: _password
						} , function (login_e) {
							if (login_e.success) {

								Cloud.PushNotifications.subscribe({
									device_token: Alloy.Globals.DeviceToken ,
									channel: 'appointments' ,
									//user_id: e.responseJSON.user.id,
									type: Ti.Platform.name == 'android' ? 'android' : 'ios'
								} , function (e3) {
									if (e3.success) {

										Ti.API.debug('Subscribed');
									}
									else {
										alert('Die Registrierung für Push-Nachrichten ist fehlgeschlagen.');
										Alloy.Globals.GoogleAnalytics.trackEvent({
											category: "models.users.login" ,
											action: "Cloud.PushNotifications.subscribe" ,
											label: 'Failed to register for push notifications! ' + ( (e3.error && e3.message) || JSON.stringify(e3))
										});
									}
								});
							}
							else {
								alert('Bei der Anmeldung ist unbekannter Fehler aufgetreten.');
								Alloy.Globals.GoogleAnalytics.trackEvent({
									category: "models.users.login" ,
									action: "Cloud.Users.login" ,
									label: 'Failed to register for push notifications! ' + ( (login_e.error && login_e.message) || JSON.stringify(login_e))
								});
							}
						});

					}

					function deviceTokenError (e4) {
						alert('Die Registrierung für Push-Nachrichten ist fehlgeschlagen (DeviceTokenError).');
						Alloy.Globals.GoogleAnalytics.trackEvent({
							category: "models.users.login" ,
							action: "deviceTokenError" ,
							label: 'Failed to register for push notifications! ' + JSON.stringify(e4.error)
						});
					}

					if (_opts.success) {
						Ti.API.debug("login user model success with callback ...");
						_opts.success(e);
					}
				}
				else {
					if (_opts.error) {
						Ti.API.debug("login user model error with callback ...");
						_opts.error(e);
					}
				}
			});
		}

		function logout (_callback) {
			Ti.App.Properties.removeProperty("acs.sessionId");
			Ti.App.Properties.removeProperty("username");
			Ti.App.Properties.removeProperty("password");
			if (_callback) {
				Ti.API.debug("login user model success with callback ...");
				_callback();
			}
		}

		function register (_login , _password , _first_name , _last_name , _img , _opts) {

			var xhr = require("xhr");
			var img = Ti.Utils.base64encode(_img).toString();

			console.log("register data = " + JSON.stringify({
				username: _login ,
				email: _login ,
				password: _password ,
				first_name: _first_name ,
				last_name: _last_name ,
				photo: img
			}));
			xhr.do({

				type: "POST" ,
				url: that.config.URL + "/register" ,
				data: {
					username: _login ,
					email: _login ,
					password: _password ,
					first_name: _first_name ,
					last_name: _last_name ,
					photo: img
				}
				// ,headers: {
				// "Content-Type": "multipart/form-data"
				// }

			} , function (data) {
				Ti.API.debug(JSON.stringify(data));
				if (data.success) {
					Ti.API.debug("acs.sessionId = " + data.responseJSON.sessionId);
					Ti.App.Properties.setString("acs.sessionId" , data.responseJSON.sessionId);
					Ti.App.Properties.setString("username" , _login);
					if (_opts.success) {
						Ti.API.debug("createAccount user modell success with callback ...");
						_opts.success(data);
					}
				}
				else {
					if (_opts.error) {
						Ti.API.debug("createAccount user model error with callback ...");
						Alloy.Globals.GoogleAnalytics.trackEvent({
							category: "error" ,
							action: "models.user.register" ,
							label: data.responseText
						});
						_opts.error(data.responseText);
					}
				}

			});
		}

		function saveFeedback (_login , _content , _rating , _opts) {
			Ti.API.debug(_login);
			var xhr = require("xhr");

			xhr.do({

				type: "POST" ,
				url: that.config.URL + "/saveFeedback" ,
				data: {
					username: _login ,
					content: _content ,
					rating: _rating
				}

			} , function (data) {
				Ti.API.debug(JSON.stringify(data));
				if (data.success) {
					Ti.API.debug("acs.sessionId = " + data.responseJSON.sessionId);
					Ti.App.Properties.setString("acs.sessionId" , data.responseJSON.sessionId);
					Ti.App.Properties.setString("username" , _login);
				}
				else {

				}
				if (_opts.success) {
					Ti.API.debug("saveFeedback user modell success with callback ...");
					_opts.success(data);
				}
			});
		}


		_.extend(Model.prototype , {
			login: login ,
			logout: logout ,
			register: register ,
			saveFeedback: saveFeedback
		});
		// end extend

		return Model;
	} ,
	extendCollection: function (Collection) {
		_.extend(Collection.prototype , {

		});
		// end extend

		return Collection;
	}

};
