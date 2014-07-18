exports.definition = {
	config : {
		"URL" : require("alloy").CFG.restapi,
		adapter : {
			type : "restapi",
			"idAttribute" : "id",
			collection_name : "offices",
			"debug" : 1,
		},
		headers : {
			"_session_id" : function() {
				return Ti.App.Properties.getString("acs.sessionId");
			}
		}
	},

	extendModel : function(Model) {

		var that = this;
		function login(_login, _password, _opts) {

			var client = Ti.Network.createHTTPClient({
				// function called when the response data is available
				onload : function(e) {
					console.log(JSON.stringify(e));
					Ti.API.info("Received text: " + this.responseText);
					//Ti.App.Properties.setString("acs.sessionId", e.responseJSON.sessionId);
					Ti.App.Properties.setString("username", _login);

					if (_opts.success) {
						Ti.API.debug("login user model success with callback ...");
						_opts.success(e);
					}
				},
				// function called when an error occurs, including a timeout
				onerror : function(e) {
					Ti.API.debug(e.error);
					if (_opts.error) {
						Ti.API.debug("login user model error with callback ...");
						_opts.error(e);
					}
				},
				timeout : 5000 // in milliseconds
			});

			client.open("POST", require("alloy").CFG.restapi + "mam-backend-0.0.1.BUILD-SNAPSHOT-dev/j_spring_security_check?j_username="+_login+"&j_password="+_password);
			client.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			client.send();

		}

		function logout(_callback) {
			Ti.App.Properties.removeProperty("acs.sessionId");
			Ti.App.Properties.removeProperty("username");
			Ti.App.Properties.removeProperty("password");
			if (_callback) {
				Ti.API.debug("login user model success with callback ...");
				_callback();
			}
		}

		function register(_login, _password, _first_name, _last_name, _img, _opts) {
			var xhr = require("xhr");
			var img = Ti.Utils.base64encode(_img).toString();

			xhr.do({

				type : "POST",
				url : that.config.URL + "/register",
				data : {
					username : _login,
					email : _login,
					password : _password,
					first_name : _first_name,
					last_name : _last_name,
					photo : img
				}
				// ,headers: {
				// "Content-Type": "multipart/form-data"
				// }

			}, function(data) {
				Ti.API.debug(JSON.stringify(data));
				if (data.success) {
					Ti.API.debug("acs.sessionId = " + data.responseJSON.sessionId);
					Ti.App.Properties.setString("acs.sessionId", data.responseJSON.sessionId);
					Ti.App.Properties.setString("username", _login);
				} else {

				}
				if (_opts.success) {
					Ti.API.debug("createAccount user modell success with callback ...");
					_opts.success(data);
				}
			});
		}

		function saveFeedback(_login, _content, _rating, _opts) {
			Ti.API.debug(_login);
			var xhr = require("xhr");

			xhr.do({

				type : "POST",
				url : that.config.URL + "/saveFeedback",
				data : {
					username : _login,
					content : _content,
					rating : _rating
				}

			}, function(data) {
				Ti.API.debug(JSON.stringify(data));
				if (data.success) {
					Ti.API.debug("acs.sessionId = " + data.responseJSON.sessionId);
					Ti.App.Properties.setString("acs.sessionId", data.responseJSON.sessionId);
					Ti.App.Properties.setString("username", _login);
				} else {

				}
				if (_opts.success) {
					Ti.API.debug("saveFeedback user modell success with callback ...");
					_opts.success(data);
				}
			});
		}


		_.extend(Model.prototype, {
			login : login,
			logout : logout,
			register : register,
			saveFeedback : saveFeedback
		});
		// end extend

		return Model;
	},
	extendCollection : function(Collection) {
		_.extend(Collection.prototype, {

		});
		// end extend

		return Collection;
	}
};
