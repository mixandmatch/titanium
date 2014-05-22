exports.definition = {
    config: {
        URL: require("alloy").CFG.restapi + "user",
        adapter: {
            type: "restapi",
            idAttribute: "id",
            collection_name: "offices",
            debug: 1
        },
        headers: {
            _session_id: function() {
                return Ti.App.Properties.getString("acs.sessionId");
            }
        }
    },
    extendModel: function(Model) {
        function login(_login, _password, _opts) {
            var xhr = require("xhr");
            xhr.do({
                type: "POST",
                url: that.config.URL + "/login",
                data: {
                    username: _login,
                    password: _password
                }
            }, function(data) {
                Ti.API.debug(JSON.stringify(data));
                if (data.success) {
                    Ti.API.debug("acs.sessionId = " + data.responseJSON.sessionId);
                    Ti.App.Properties.setString("acs.sessionId", data.responseJSON.sessionId);
                    Ti.App.Properties.setString("username", _login);
                }
                if (_opts.success) {
                    Ti.API.debug("login user modell success with callback ...");
                    _opts.success(data);
                }
            });
        }
        var that = this;
        _.extend(Model.prototype, {
            login: login
        });
        return Model;
    },
    extendCollection: function(Collection) {
        _.extend(Collection.prototype, {});
        return Collection;
    }
};

var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

model = Alloy.M("user", exports.definition, []);

collection = Alloy.C("user", exports.definition, model);

exports.Model = model;

exports.Collection = collection;