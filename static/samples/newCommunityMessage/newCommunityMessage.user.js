
if(typeof(dojo) != "undefined") {
    
    var waitFor = function(callback, elXpath, maxInter, waitTime) {
        if(!maxInter) var maxInter = 20;  // number of intervals before expiring
        if(!waitTime) var waitTime = 100;  // 1000=1 second
        if(!elXpath) return;
        
        var waitInter = 0;  // current interval
        var intId = setInterval(function(){
            if (++waitInter<maxInter && !dojo.query(elXpath).length) return;
            clearInterval(intId);
            callback();
        }, waitTime);
    };
    
    waitFor(
        function(){
            
			dojo.place(
        "<link rel=\"stylesheet\" type=\"text/css\" href=\"/files/muse-static/samples/newCommunityMessage/messages.css\"></link>",
        dojo.doc.head,
        "last"
    );
			
            dojo.connect(createPlaceButton, "onclick", function(evt) {
         try {
       	    console.log(dojo.query("#placeButton")[0]);
			var dlg = new dijit.Dialog({
				id: 'testDialog',
				"title": "Info Message",
				"style": "width: 300px;"
			}).placeAt(dojo.body());

			var actionBar = dojo.create("div", {
				"class": "dijitDialogPaneContentArea",
				"innerHTML": "Do you need to create this community? Please see this link for more information <a href='https://apps.na.collabserv.com/wikis/home?lang=en-us#!/wiki/W21e2927dce5d_4815_9061_c3c3787cb960/page/Information%20on%20creating%20communities'>More information</a>"
			}, dlg.containerNode);
			var actionBar = dojo.create("div", {
				"class": "dijitDialogPaneActionBar"
			}, dlg.containerNode);

			var okButton = new dijit.form.Button({
				"label": "Ok",
				"class":"lotusFormButton",
				"onClick": function(){
				 menuUtility.openMenu(null, "dijit_Menu_0", "createPlaceButton");
				 dlg.destroy();
            }
			}).placeAt(actionBar);
			
			var cancelButton = new dijit.form.Button({
				"label": "Cancel",
				"class":"lotusFormButton",
				"onClick": function(){
				dlg.destroy();
            }
			}).placeAt(actionBar);
			
			//okButton.onclick(function(){console.log('ok')});
			//cancelButton.onclick(function(){console.log('ok')});

			dlg.startup();
			dlg.show();			

		    //alert("where should I create this community? Please see link.");
            //evt.preventDefault(), evt.stopPropagation();
         } catch (e) {
            console.log(e);
         }
      });
            
        }, "td a[dojoattachpoint='placeTitleLink']");
}
