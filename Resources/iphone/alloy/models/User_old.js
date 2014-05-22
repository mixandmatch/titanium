exports.definition = {
    config: {
        columns: {
            active: "boolean"
        },
        adapter: {
            type: "acs",
            collection_name: "users"
        },
        settings: {
            object_name: "users",
            object_method: "Users"
        }
    },
    extendModel: function(Model) {
        function logout(_opts) {
            var self = this;
            this.config.Cloud.Users.logout(function(e) {
                if (e.success) {
                    _opts.success && _opts.success(null);
                    Ti.App.Properties.removeProperty("sessionId");
                } else _opts.error && _opts.error(self, e.error && e.message || e);
            });
        }
        function showMe(_opts) {
            var self = this;
            this.config.Cloud.Users.showMe(function(e) {
                if (e.success) {
                    var user = e.users[0];
                    Ti.API.info("Logged in! You are now logged in as " + user.id);
                    _opts.success && _opts.success(new model(user));
                } else {
                    Ti.API.error(e);
                    _opts.error && _opts.error(self, e.error && e.message || e);
                }
            });
        }
        function hasStoredSession() {
            return this.config.Cloud.hasStoredSession();
        }
        function retrieveStoredSession() {
            return this.config.Cloud.retrieveStoredSession();
        }
        function login(_login, _password, _opts) {
            var self = this;
            this.config.Cloud.Users.login({
                login: _login,
                password: _password
            }, function(e) {
                if (e.success) {
                    var user = e.users[0];
                    Ti.API.info("Logged in! You are now logged in as " + user.id);
                    Ti.App.Properties.setString("sessionId", e.meta.session_id);
                    _opts.success && _opts.success(new model(user));
                } else {
                    Ti.API.error(e);
                    _opts.error && _opts.error(self, e.error && e.message || e);
                }
            });
        }
        function authenticated() {
            if (Ti.App.Properties.hasProperty("sessionId")) {
                this.config.Cloud.sessionId = Ti.App.Properties.getString("sessionId");
                Ti.API.info("SESSION ID " + this.config.Cloud.sessionId);
                return true;
            }
            return false;
        }
        function create(_username, _email, _password, _opts) {
            var self = this;
            this.config.Cloud.Users.create({
                username: _username,
                password: _password,
                email: _email,
                password_confirmation: _password
            }, function(e) {
                var user;
                if (e.success) {
                    user = e.users[0];
                    Ti.App.Properties.setString("sessionId", e.meta.session_id);
                    _opts.success && _opts.success(new model(user));
                } else {
                    Ti.API.error(e);
                    _opts.error && _opts.error(self, e.error && e.message || e);
                }
            });
        }
        _.extend(Model.prototype, {
            create: create,
            login: login,
            showMe: showMe,
            logout: logout,
            retrieveStoredSession: retrieveStoredSession,
            hasStoredSession: hasStoredSession,
            authenticated: authenticated
        });
        return Model;
    },
    extendCollection: function(Collection) {
        _.extend(Collection.prototype, {});
        return Collection;
    }
};

var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

model = Alloy.M("user_old", exports.definition, []);

collection = Alloy.C("user_old", exports.definition, model);

exports.Model = model;

exports.Collection = collection;