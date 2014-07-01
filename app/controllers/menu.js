var args = arguments[0] || {};

function list_OnItemClick(e) {
    var section = $.list.sections [e.sectionIndex];

    var item = section.getItemAt(e.itemIndex);
    
    if (item.properties.target === "manual") {
        Alloy.createController("manual").getView().open({modal:true});
    } else if (item.properties.target === "feedback") {
        Alloy.createController("feedback").getView().open({modal:true});
    } else if (item.properties.target === "tc") {
        Alloy.createController("tc").getView().open({modal:true});
    }
}
