var dojoAddInviteGuest = new __cBill_waitForDojo('myActivities');
//
//  Since this script is applied to GLOBAL, there are some pages (mycontacts, mynetwork) which load Dojo very lazily.
//  So we need to wait until Dojo is fully loaded before testing and using it
//
dojoAddInviteGuest.do(function () {
    try {
        __cBill_logger('myActivities : Dojo is defined !');

        let waitForByQuery = new __cBill_waitByQuery('myActivities');
        waitForByQuery.do(function (newDivWidget) {
            //alert('Button created...');
            console.log(newDivWidget);


            var buttonLists = dojo.query("ul.lotusInlinelist[role='toolbar']");
            if (buttonLists) {
                for (let k=0; k < buttonLists.length; k++) {
                    //
                    //  Retrieve parent information to understand which is the name of the ENTRY and of teh SECTION
                    //  
                    //  First get the container node of the entry, where we find the "title" of the entry and its UUID
                    //
                    let entryContainer = buttonLists[k].closest(".Node"); 
                    let entryTitle = dojo.query("h4.entryTitleBar span", entryContainer)[0].innerHTML;
                    let entryUUID = dojo.attr(entryContainer, 'uuid');
                    //
                    //  Let's get the SECTION
                    //
                    let sectionContainer = buttonLists[k].closest(".Section");
                    let sectionTitle = dojo.query('.dijitTitlePaneTextNode', sectionContainer)[0].innerHTML;
                    //
                    //  Create a new Button and bind it to the script you want
                    //
                    let newLI = dojo.create('li', {class :'feedCapVisible'}, buttonLists[k], "last");
                    //let newA = dojo.create('a', {role : "button", href : "javascript:function() {alert('ciao')}"}, newLI); //"watsonworkspace://space/5b168deee4b0f5ccbccfa349"}, newLI);
                    let newA = dojo.create('a', {role : "button", onclick : '__myFunct("' + entryUUID + '", "' + entryTitle + '")'}, newLI); //"watsonworkspace://space/5b168deee4b0f5ccbccfa349"}, newLI);
                    //let newText = document.createTextNode(entryTitle +  ' (' + sectionTitle + ')');
                    //let newA = dojo.create('a', {role : "button", href : "watsonworkspace://space/5b168deee4b0f5ccbccfa349"}, newLI); //"watsonworkspace://space/5b168deee4b0f5ccbccfa349"}, newLI);
                    //let newA = dojo.create('a', {role : "button", href : "https://coccobill.mybluemix.net/toto?wow=ciao"}, newLI); //"watsonworkspace://space/5b168deee4b0f5ccbccfa349"}, newLI);
                    let newText = document.createTextNode('Go to Workspace');
                    newA.appendChild(newText);
                    //newA.addEventListener('click', __myFunct());
                    console.log(entryTitle +  ' (' + sectionTitle + ')' + '....done .... ');
                }
            } else {
                alert(' I am here');
            }
            
        }, "ul.lotusInlinelist[role='toolbar']");

    } catch (ex) {
        alert("myActivities error: MAIN: " + ex);
    }
});
function __myFunct(uuid, title)  {   
    var args= {
        url          : "https://coccobill.mybluemix.net/toto", 
        handleAs     : "json",
        method       : "GET",
        //preventCache : false,
        //sync         : false,
        //user:      NO Need since same Domain,
        //password:  NO Need since same Domain,
        content      :  {uuid: uuid, title: title},
    }
    var deferred = dojo.xhrGet(args);
    deferred.then(
        function (data) {
            console.log(JSON.stringify(data, ' ', 2));
            console.log('redirecting to ' + data.Location);
            window.location = data.Location;
        },
        function (err) {
            alert('Unpredictable error ' + JSON.stringify(err, ' ', 2));
            console.log(JSON.stringify(err, ' ', 2));
        }
    );
}

/*

linea1=dojo.query("ul.lotusInlinelist[role='toolbar']")[0]

aa = dojo.create('li', {class :'feedCapVisible'})

bb = dojo.create('a', {role : "button", href : "javascript()"}, aa

*/

/*
var xmlHttpReq = false;
if (window.XMLHttpRequest) {
    // Mozilla/Safari
    xmlHttpReq = new XMLHttpRequest();
} else if (window.ActiveXObject) {
    // IE
    xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
}
xmlHttpReq.open('GET', 'https://coccobill.mybluemix.net/toto?wow=ciao');
xmlHttpReq.setRequestHeader('Content-Type', 'application/json');
//xmlHttpReq.setRequestHeader('accept', 'application/json');
//xmlHttpReq.setRequestHeader('x-ibm-client-id', '954ca1f5-b101-402e-877b-82e3a6ab264f');
xmlHttpReq.onreadystatechange = function () {
    console.log(JSON.stringify(xmlHttpReq, ' ', 2));
    if (xmlHttpReq.readyState == 4) {
        if ((xmlHttpReq.status == 200)) {
            console.log(JSON.stringify(xmlHttpReq, ' ', 2));
        } else {
            alert('Unfortunately there was an ERRROR ' + xmlHttpReq.status + ' / ' + xmlHttpReq.statusText);
        }
    }
};
xmlHttpReq.send();
*/
