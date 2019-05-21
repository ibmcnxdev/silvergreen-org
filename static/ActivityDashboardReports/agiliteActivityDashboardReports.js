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
// @name         activityDashboardReports
// @version      0.1
// @author       John Jardin (Agilit-e)

//Extension Service properties
var agilite_actReports = {
  divId:"agilite_activity_dashboard_reports",
  urlAllActivities:"/activities/service/atom2/everything",
  urlActivity:"/activities/service/atom2/activity?activityUuid=",
  method:"GET",
  headers:{"Content-Type":"application/atom+xml"},
  qryInterval:2000,// 1000=1 second
  x2js: null,
  reportData:{
    todos:[],
    activities:[],
    divs:{
      active:"reportActive",
      completed:"reportCompleted"
    },
    titles:{
      active:"Open To Dos By Activity",
      completed:"Completed To Dos By Activity"
    },
    labels:{
      active:[],
      completed:[]
    },
    data:{
      active:[],
      completed:[]
    }
  },
  entryTemplate:{
    title:"",
    term:"",
    id:"",
    parentId:"",
    isComplete:false
  }
};

//<div id="agilite_activity_dashboard_reports">Loading Activity Dashboard Reports...</div>

if(typeof(dojo) != "undefined") {
  console.log("Initiating Extension - activityDashboardReports");

  //Setup Looper logic to check for Report Div tag in Rich Content Widget
	agilite_actReports.looper = function(callback, divId) {
    if(!divId) return;

		var intId = setInterval( function(){
			if(!dojo.byId(divId)) return;

			clearInterval(intId);
      callback();
		}, agilite_actReports.qryInterval);
	};
  
  require(["dojo/request/xhr","dojo/domReady!"], function(xhr){
    try {
        //Run looper to check for Activity Dashboard Report Div
        agilite_actReports.looper(function(){
          //Double check that Div exists
          var divId = dojo.byId(agilite_actReports.divId);
          if(!divId) return;

          //Next, get the Community ID from the URL
          var url = new URL(window.location.href);
          var commId = url.searchParams.get("communityUuid");

          if(!commId) return;

          //Now, we need to get All Activities for the community
          agilite_actReports.getActivitiesByCommunity(commId, divId);
        }, agilite_actReports.divId);
 
        agilite_actReports.getActivitiesByCommunity = function(commId, divId){
          var args = {method:agilite_actReports.method, headers:agilite_actReports.headers};
          var tmpJSON = {};
          var tmpArray = [];
          var entry = {};
          var newEntry = {};
          var colorCount = 0;
          var template = {};

          xhr(agilite_actReports.urlAllActivities, args)
          .then(function(data){
            agilite_actReports.x2js = new X2JS({attributePrefix : "$"});
            tmpJSON = agilite_actReports.x2js.xml_str2json(data);
            
            tmpJSON = tmpJSON ? tmpJSON.feed : null;
            tmpJSON = tmpJSON ? tmpJSON.entry : null;

            if(tmpJSON){
              if(tmpJSON.title){
                tmpArray.push(tmpJSON);
              }else{
                tmpArray = tmpJSON;
              }

              for(var x in tmpArray){
                entry = tmpArray[x];
                
                newEntry = JSON.parse(JSON.stringify(agilite_actReports.entryTemplate));

                //Set Title
                if(entry.title){
                  if(entry.title.__text){
                    newEntry.title = entry.title.__text;
                  }
                }
                
                for(var y in entry.category){
                  switch(entry.category[y]["$term"]){
                  case "todo":
                    newEntry.term = entry.category[y]["$term"];

                    //Set Entry Id
                    newEntry.id = entry.id;

                    //Set Parent Id
                    if(entry.activity){
                      if(entry.activity.__text){
                        newEntry.parentId = entry.activity.__text;
                      }
                    }
                    
                    break;
                  case "community_activity":
                    newEntry.term = entry.category[y]["$term"];

                    //Set Id
                    if(entry.activity){
                      if(entry.activity.__text){
                        newEntry.id = entry.activity.__text;
                      }
                    } 
                    
                    //Set Parent Id
                    if(entry.commUuid){
                      if(entry.commUuid.__text){
                        newEntry.parentId = entry.commUuid.__text;
                      }
                    }

                    break;
                  case "completed":
                    newEntry.isComplete = true;
                    break;                                         
                  }
                }

                switch(newEntry.term){
                case "todo":
                  agilite_actReports.reportData.todos.push(newEntry);
                  break;
                case "community_activity":
                  if(newEntry.parentId === commId){
                    agilite_actReports.reportData.activities.push(newEntry);
                  }
                  break; 
                }
              }
            }            

            agilite_actReports.finalizeReportData(divId);
          }, function(err){
            console.log(err);
          });
        };
      
        agilite_actReports.finalizeReportData = function(divId){
          var activity = {};
          var todo = {};
          var totalActive = 0;
          var totalCompleted = 0;
          var node = "";

          //Loop through Activities
          for(var x in agilite_actReports.reportData.activities){
            activity = agilite_actReports.reportData.activities[x];
            totalActive = 0;
            totalCompleted = 0;

            //Find To Dos for the current Activity
            for(var y in agilite_actReports.reportData.todos){
              todo = agilite_actReports.reportData.todos[y];

              if(todo.parentId === activity.id){
                
                if(todo.isComplete){
                  totalCompleted++;
                }else{
                  totalActive++;
                }
              }
            }

            //Populate Report Data
            agilite_actReports.reportData.labels.active.push(activity.title + " (" + totalActive + ")");
            agilite_actReports.reportData.data.active.push(totalActive);
            agilite_actReports.reportData.labels.completed.push(activity.title + " (" + totalCompleted + ")");
            agilite_actReports.reportData.data.completed.push(totalCompleted);
          }

          //Next, we need to fetch the Report Template and Color Codes from Agilit-e
          colorCount = agilite_actReports.reportData.labels.active.length;

          agilite_core.execute(function(err, result){
            if(!err){
              result = JSON.parse(result);

              //Setup Canvas tags for reports
              node = '<div style="width:50%;float:left;"><canvas id="' + agilite_actReports.reportData.divs.active + '" width="300" height="300"></canvas></div>';
              node += '<div style="width:50%;float:left;"><canvas id="' + agilite_actReports.reportData.divs.completed + '" width="300" height="300"></canvas></div>';
              dojo.place(node, divId, "replace");

              //Setup and populate Active Template        
              template = JSON.parse(result.template);
              template.options.title.text = agilite_actReports.reportData.titles.active;
              template.data.labels = agilite_actReports.reportData.labels.active;
              template.data.datasets[0].data = agilite_actReports.reportData.data.active;
              template.data.datasets[0].backgroundColor = result.colors.slice(0, agilite_actReports.reportData.labels.active.length);
              new Chart(agilite_actReports.reportData.divs.active, template);

              //Setup and populate Completed Template
              template = JSON.parse(result.template);
              template.options.title.text = agilite_actReports.reportData.titles.completed;
              template.data.labels = agilite_actReports.reportData.labels.completed;
              template.data.datasets[0].data = agilite_actReports.reportData.data.completed;
              template.data.datasets[0].backgroundColor = result.colors.slice(0, agilite_actReports.reportData.labels.completed.length);
              new Chart(agilite_actReports.reportData.divs.completed, template);              
            }
          }, "3", {count:colorCount});
        };      
    } catch(e) {
      alert("Exception occurred in activityDashboardReports: " + e);
    }
   });
}