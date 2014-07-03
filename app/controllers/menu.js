var args = arguments[0] || {};

Alloy.Globals.GoogleAnalytics.trackPageview('menu');

function list_OnItemClick(e) {
    var section = $.list.sections [e.sectionIndex];

    var item = section.getItemAt(e.itemIndex);
    
    if (item.properties.target === "manual") {
        Alloy.createController("manual").getView().open({modal:true});
        Alloy.Globals.GoogleAnalytics.trackEvent("menu", "registration", "list_OnItemClick", "manual"); 
    } else if (item.properties.target === "feedback") {
        Alloy.createController("feedback").getView().open({modal:true});
        Alloy.Globals.GoogleAnalytics.trackEvent("menu", "registration", "list_OnItemClick", "feedback"); 
    } else if (item.properties.target === "tc") {
        Alloy.createController("tc").getView().open({modal:true});
        Alloy.Globals.GoogleAnalytics.trackEvent("menu", "registration", "list_OnItemClick", "tc"); 
    } else if (target === "logout") {
        //TODO: show confirm dialog; then logout user via user model
    }
}
