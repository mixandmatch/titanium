$.index.addEventListener('open', function(e){
    Alloy.Globals.GoogleAnalytics.trackPageview('name_page');
    Alloy.Globals.GoogleAnalytics.trackEvent("category", "action", "label", 1);    
});

$.index.open();
