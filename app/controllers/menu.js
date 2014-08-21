var args = arguments [0] || {};

//Alloy.Globals.GoogleAnalytics.screen('menu');

function list_OnItemClick (e) {
	var section = $.list.sections [e.sectionIndex];

	var item = section.getItemAt(e.itemIndex);

	if (item.properties.target === "manual") {
		Alloy.Globals.pageFlow.addChild({
			controller: 'manual' ,
			backButton: {
				left: 10,
				title: "Zurück"
			} ,
			navBar: {
				backgroundColor: '#F5F5F9',
				title:"Anleitung"
			} ,
			direction: {
				top: 0 ,
				left: 0
			}
		});
		
		//Alloy.Globals.GoogleAnalytics.event("menu" , "registration" , "list_OnItemClick" , "manual");
	}
	else
	if (item.properties.target === "feedback") {
		Alloy.Globals.pageFlow.addChild({
            controller: 'feedback' ,
            backButton: {
                left: 10,
                title: "Zurück"
            } ,
            navBar: {
                backgroundColor: '#F5F5F9',
                title:"Feedback"
            } ,
            direction: {
                top: 0 ,
                left: 0
            }
        });
        
		//Alloy.Globals.GoogleAnalytics.event("menu" , "registration" , "list_OnItemClick" , "feedback");
	}
	else
	if (item.properties.target === "tc") {
		Alloy.Globals.pageFlow.addChild({
            controller: 'tc' ,
            backButton: {
                left: 10,
                title: "Zurück"
            } ,
            navBar: {
                backgroundColor: '#F5F5F9',
                title:"Nutzungsbedingungen"
            } ,
            direction: {
                top: 0 ,
                left: 0
            }
        });
        
		//Alloy.Globals.GoogleAnalytics.event("menu" , "registration" , "list_OnItemClick" , "tc");
	}
	else
	if (item.properties.target === "imprint") {
		Alloy.Globals.pageFlow.addChild({
            controller: 'imprint' ,
            backButton: {
                left: 10,
                title: "Zurück"
            } ,
            navBar: {
                backgroundColor: '#F5F5F9',
                title:"Impressum"
            } ,
            direction: {
                top: 0 ,
                left: 0
            }
        });

		//Alloy.Globals.GoogleAnalytics.event("menu" , "registration" , "list_OnItemClick" , "imprint");
	}
	else
	if (item.properties.target === "logout") {
		var alert = Titanium.UI.createAlertDialog({
			title: 'Logout' ,
			message: 'Wirklich abmelden?' ,
			buttonNames: ['Ja' , 'Nein'] ,
			cancel: 1
		});
		alert.addEventListener('click' , function (e) {
			Titanium.API.info('e = ' + JSON.stringify(e));

			switch (e.index) {
				case 0:
					//Alloy.Globals.GoogleAnalytics.event("menu" , "registration" , "list_OnItemClick" , "logout");
					var aUser = Alloy.createModel('User');
					aUser.logout(function () {
					});
					
					//TODO refactor
					var winLogin = Alloy.Globals.Windows.getLogin();
					winLogin.open(Alloy.Globals.SLIDE_IN);
					if (Alloy.Globals.NavigationWindow) {
						Alloy.Globals.NavigationWindow.close();
					}

					Alloy.Globals.NavigationWindow = winLogin;

					break;
				case 1:
					//Alloy.Globals.GoogleAnalytics.event("menu" , "registration" , "list_OnItemClick" , "logout");
					break;
				default:
					break;

			}
		});
		alert.show();

	}
	if (OS_IOS) {
	   Alloy.Globals.tisidemenu.hideMenuViewController();
	}
}
