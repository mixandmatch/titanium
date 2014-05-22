function apiCall(_options, _callback) {
    function cleanup() {
        xhr = null;
        _options = null;
        _callback = null;
        error = null;
        responseJSON = null;
    }
    if (Ti.Network.online && !_options.localOnly) {
        var xhr = Ti.Network.createHTTPClient({
            timeout: _options.timeout || 7e3
        });
        xhr.open(_options.type, _options.url);
        xhr.onload = function() {
            var responseJSON, error, success = true;
            try {
                responseJSON = JSON.parse(xhr.responseText);
            } catch (e) {
                Ti.API.error("[XHR API] apiCall PARSE ERROR: " + e.message);
                Ti.API.error("[XHR API] apiCall PARSE ERROR: " + xhr.responseText);
                success = false;
                error = e.message;
            }
            _callback({
                success: success,
                status: success ? 300 > xhr.status ? "ok" : xhr.status : "error",
                code: xhr.status,
                data: error,
                responseText: xhr.responseText || null,
                responseJSON: responseJSON || null
            });
            cleanup();
        };
        xhr.onerror = function(err) {
            var responseJSON, error;
            Ti.App.fireEvent("timeout", err);
            try {
                responseJSON = JSON.parse(xhr.responseText);
            } catch (e) {
                error = e.message;
            }
            _callback({
                success: false,
                status: "error",
                code: xhr.status,
                error: err.error,
                data: error,
                responseText: xhr.responseText,
                responseJSON: responseJSON || null
            });
            Ti.API.error("[XHR API] apiCall ERROR: " + xhr.responseText);
            Ti.API.error("[XHR API] apiCall ERROR CODE: " + xhr.status);
            Ti.API.error("[XHR API] apiCall ERROR MSG: " + err.error);
            Ti.API.error("[XHR API] apiCall ERROR URL: " + _options.url);
            cleanup();
        };
        for (var header in _options.headers) xhr.setRequestHeader(header, _options.headers[header]);
        _options.beforeSend && _options.beforeSend(xhr);
        Ti.API.debug("[XHR API] apiCall send data = " + JSON.stringify(_options.data));
        xhr.send(_options.data || null);
    } else _callback({
        success: false,
        responseText: null,
        offline: true
    });
}

exports.do = apiCall;