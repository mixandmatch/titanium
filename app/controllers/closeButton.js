var args = arguments[0] || {};

$.close.addEventListener('click', function() {
    Ti.API.debug("closeButton pressed.");
    //Alloy.Globals.pageFlow.back();
    Alloy.Globals.pageFlow.gotoPage(0);
});