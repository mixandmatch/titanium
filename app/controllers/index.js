
//$.winSplash.open();

//TODO check if we already have user credentials. then we assume that the login is valid. try to fetch some data.
//if ()

setTimeout(function() {
	Alloy.Globals.Windows.getLogin().open(Alloy.Globals.SLIDE_IN);
	// setTimeout(function() {
		// $.winSplash.close();
	// }, 1000);
	
},500);
