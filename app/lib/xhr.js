function apiCall(_options, _callback) {
    //adding localOnly
    if (Ti.Network.online && !_options.localOnly) {
        //we are online - talk with Rest API

        var xhr = Ti.Network.createHTTPClient({
            timeout: _options.timeout || 10000
        });

        //Prepare the request
        xhr.open(_options.type, _options.url);

        xhr.onload = function() {
            var responseJSON, success = true,
                error;

            // parse JSON
            try {
                responseJSON = JSON.parse(xhr.responseText);
            } catch (e) {
                Ti.API.error('[XHR API] apiCall PARSE ERROR: ' + e.message);
                Ti.API.error('[XHR API] apiCall PARSE ERROR: ' + xhr.responseText);
                success = false;
                error = e.message;
            }
            _callback({
                success: success,
                status: success ? (xhr.status < 300 ? "ok" : xhr.status) : 'error',
                code: xhr.status,
                data: error,
                responseText: xhr.responseText || null,
                responseJSON: responseJSON || null
            });

            cleanup();
        };

        //Handle error
        xhr.onerror = function(err) {
            var responseJSON, error;
            
            try {
                responseJSON = JSON.parse(xhr.responseText);
            } catch (e) {
                error = e.message;
            }
            Ti.App.fireEvent("timeout", err);

            _callback({
                success: false,
                status: "error",
                code: xhr.status,
                error: err.error,
                data: error,
                responseText: xhr.responseText,
                responseJSON: responseJSON || null
            });


            Ti.API.error('[XHR API] apiCall ERROR: ' + xhr.responseText);
            Ti.API.error('[XHR API] apiCall ERROR CODE: ' + xhr.status);
            Ti.API.error('[XHR API] apiCall ERROR MSG: ' + err.error);
            Ti.API.error('[XHR API] apiCall ERROR URL: ' + _options.url);

            cleanup();
        };
        
        
        // headers
        for (var header in _options.headers) {
            Ti.API.debug("xhr api set header:" + header + "=" + _options.headers[header]);
            xhr.setRequestHeader(header, _options.headers[header]);
        }

        if (_options.beforeSend) {
            _options.beforeSend(xhr);
        }
        Ti.API.debug("[XHR API] apiCall send data = " + JSON.stringify(_options.data));
        
        xhr.send(_options.data || null);
    } else {
        //we are offline
        _callback({
            success: false,
            responseText: null,
            offline: true
        });
    }

    /**
     * Clean up the request
     */
    function cleanup() {
        xhr = null;
        _options = null;
        _callback = null;
        error = null;
        responseJSON = null;
    }

}

exports.do = apiCall;
