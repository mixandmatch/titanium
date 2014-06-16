exports.definition = {
	config: {
		"URL": require("alloy").CFG.restapi + "user" ,
		adapter: {
			type: "restapi" ,
			"idAttribute": "id" ,
			collection_name: "offices" ,
			"debug": 1,
		},
		headers: {
            "_session_id": function() {
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
					Ti.API.debug("login user modell success with callback ...");
					_opts.success(data);
				}
			});
		}
		
		function register (_login , _password, _first_name, _last_name, _img, _opts) {
            var xhr = require("xhr");
            var img = Ti.Utils.base64encode(_img).toString();

            xhr.do({

                type: "POST" ,
                url: that.config.URL + "/register" ,
                data: {
                    username: _login ,
                    email:_login,
                    password: _password,
                    first_name: _first_name,
                    last_name: _last_name,
                    photo: img
                },
                headers: {
                    "Content-Type": "multipart/form-data"
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
                    Ti.API.debug("createAccount user modell success with callback ...");
                    _opts.success(data);
                }
            });
        }


		_.extend(Model.prototype , {
			login: login,
			register: register
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
