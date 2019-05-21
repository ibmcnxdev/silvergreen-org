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
// @name         agiliteCore
// @version      0.1
// @author       John Jardin (Agilit-e)

/*
 * NOTES:
 * - Check the agilite_core object below to provide the necessary params, if any
 * - Tone Analyer - Execute Request: Property Rules
 *    - flowType: [STRING] - Allowed Values: "1", "2"
 *       - "1" = Generate Unique No
 *       - "2" = Analyze Message Tone
 *    - Flow Type 1: API Response
 *       - String e.g. "00001"
 *    - Flow Type 2: API Response
 *       - String Array e.g. ["Value 1"] or ["Value 1", "Value 2"]
 */

//Agilit-e Core Service properties
var agilite_core = {
	url:"https://agilite-public-node-red.eu-gb.mybluemix.net/customizer",
	flowType:"1",
	method:"POST"
};

if(typeof(dojo) != "undefined") {
	console.log("Initiating Agilit-e Core");

	require(["dojo/request/xhr"], function(xhr){
		//Create Execute Request for Node-RED Service
		agilite_core.execute = function(callback, flowType, bodyData){
			if(!bodyData) var bodyData = {};
			if(!flowType) var flowType = agilite_core.flowType;

			var url = agilite_core.url;
			var args = {};
			var headers = {};

			//Add Header Params
			headers = {"flow-type":flowType};
			
			args = {
				method:agilite_core.method,
				data:bodyData,
				headers:headers
			};
		
			xhr(url, args)
			.then(function(data){callback(false, data)}
			, function(err){callback(true, err)});
		}
	});
}