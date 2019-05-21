/*
 * © Copyright IBM Corp. 2017
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); 
 * you may not use this file except in compliance with the License. 
 * You may obtain a copy of the License at:
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software 
 * distributed under the License is distributed on an "AS IS" BASIS, 
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or 
 * implied. See the License for the specific language governing 
 * permissions and limitations under the License.
 */
// @name         statusUpdateToneAnalyzer
// @version      0.1
// @author       John Jardin (Agilit-e)

//Extension Service properties
var agilite_suToneAnalyzer = {
  statusText:"",
  defaultToneMsg:"Waiting to analyze tone...",
  qryInterval:2000,// 1000=1 second
  qryValue:".cke_contents.cke_reset.lconnShareboxCke.lotusTextExpanded",
  qryValue2:".lotusInlinelist.lotusLeft",
  qryExceptionText:["What do you want to share?", "Share a message with the community"]
};

if(typeof(dojo) != "undefined") {
  console.log("Initiating Extension - statusUpdateToneAnalyzer");

  //Setup Function to query status field values
	agilite_suToneAnalyzer.queryField = function() {
    //Get content of iFrame values
    var tmpArray = dojo.query(".cke_wysiwyg_frame")[0].contentDocument.childNodes[1].childNodes[1].childNodes;
    var data = "";
    var index = 0;
    var canProcess = false;
    var resultText = "";

    tmpArray.forEach(function(entry){
      if(entry.childNodes.length > 0){
        var tmpValue = entry.childNodes[0].nodeValue;
        if(tmpValue){
          if(agilite_suToneAnalyzer.qryExceptionText.indexOf(tmpValue) === -1){
            if(index > 0){
              data += " ";
            }

            data += tmpValue;
            index++;
          }
        }
      }
    });

    //Process if text has changed and is not blank
    if(data !== ""){
      if(agilite_suToneAnalyzer.statusText !== data){
        canProcess = true;
        agilite_suToneAnalyzer.statusText = data;
      }
    }else{
      if(dojo.byId("agilite_tone_result").innerHTML !== agilite_suToneAnalyzer.defaultToneMsg){
        dojo.byId("agilite_tone_result").innerHTML = agilite_suToneAnalyzer.defaultToneMsg;
      }

      agilite_suToneAnalyzer.statusText = "";
    }

    if(canProcess){
      dojo.byId("agilite_tone_result").innerHTML = "Analyzing dominant tone...";
        agilite_core.execute(function(err, result){
          if(!err){
            result = JSON.parse(result);
            
            for(var x in result){
              if(parseInt(x) > 0){
                resultText += ", ";
              }
  
              resultText += "<span>" + result[x] + "</span>";
            }
  
            if(resultText !== ""){
              resultText = "Dominant Tone(s): " + resultText;
            }else{
              resultText = "Not enough context to analyze dominant tone of message."
            }
  
            dojo.byId("agilite_tone_result").innerHTML = resultText;
            setTimeout(function(){
              agilite_suToneAnalyzer.looper2(agilite_suToneAnalyzer.queryField, agilite_suToneAnalyzer.qryValue);
            }, agilite_suToneAnalyzer.qryInterval);
          }else{
            setTimeout(function(){
              agilite_suToneAnalyzer.looper2(agilite_suToneAnalyzer.queryField, agilite_suToneAnalyzer.qryValue);
            }, agilite_suToneAnalyzer.qryInterval);
          }
        }, "2", {data:data});
    }else{
      setTimeout(function(){
        agilite_suToneAnalyzer.looper2(agilite_suToneAnalyzer.queryField, agilite_suToneAnalyzer.qryValue);
      }, agilite_suToneAnalyzer.qryInterval);
    }
	};

  //Setup Looper logic to add Tone Analyzer Div underneath status field
	agilite_suToneAnalyzer.looper = function(callback, elXpath) {
    if(!elXpath) return;
		var waitTime = 500;

		var intId = setInterval( function(){
			if(!dojo.query(elXpath, dojo.body()).length) return;

			clearInterval(intId);
      callback();
		}, waitTime);
	};

  //Setup Looper logic to check if status update field is expanded
	agilite_suToneAnalyzer.looper2 = function(callback, elXpath) {
		if(!elXpath) return;

		var intId = setInterval( function(){
			if(!dojo.query(elXpath, dojo.body()).length) return;

			clearInterval(intId);
      callback();
		}, agilite_suToneAnalyzer.qryInterval);
	};

	require(["dojo/domReady!"], function(){
    try {
        //Setup div underneath Status Field for Tone Results
        agilite_suToneAnalyzer.looper(function(){
          var refNode = dojo.query(agilite_suToneAnalyzer.qryValue2)[0];

          if(dojo.attr(refNode.parentNode, "class") === "lotusActions lotusMeta"){
            var node = '<li><div id="agilite_tone_result" style="float:right;color:#134a9f;letter-spacing: 2px;">' + agilite_suToneAnalyzer.defaultToneMsg + '</div></li>';
            dojo.place(node, refNode, "last");
          }
        }, agilite_suToneAnalyzer.qryValue2);

				//Run Looper to check if status update box is expanded
				agilite_suToneAnalyzer.looper2(agilite_suToneAnalyzer.queryField, agilite_suToneAnalyzer.qryValue);
    } catch(e) {
      alert("Exception occurred in statusUpdateToneAnalyzer: " + e);
    }
   });
}