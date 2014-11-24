exports.GoogleAnalytics = ( function(){
    
    var GA = null;
    var tracker = null;
    
    Titanium.App.addEventListener('analytics_trackEvent', function(e){
       tracker.trackEvent(e);
    });
  
    Titanium.App.addEventListener('analytics_trackPageview', function(e){
        var pagename = (e.pageUrl);
        tracker.trackScreen(pagename);
    });
 
    return {
        trackPageview: function(pageUrl){
            Titanium.App.fireEvent('analytics_trackPageview', {pageUrl:pageUrl});
        },
        trackEvent: function(category, action, label, value){
            Titanium.App.fireEvent('analytics_trackEvent', {category:category, action:action, label:label, value:value});
        },
        init: function(trackerID){
            GA = require('com.proximate.google.analytics');
            tracker = GA.getTracker(trackerID);
        }
    };
    
})();