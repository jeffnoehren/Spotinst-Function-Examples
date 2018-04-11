const rp = require('request-promise')

/**
* This is the starting point for the service. Here we have listed all the Availability Zones and we build a request
* to for each one to access their Auto Scaling Groups so then return the result to the user
* 
* @function
* @name getAllZones
* @param {Object} event - Event data from Spotinst Functions
* @param {Object} context - Context of the Spotinst Function
* @param {function} callback - function to finalize the request
*
* @property {String} process.env['getAllURL'] - String for the URL for the getAllASG function in service
*/
module.exports.main = function main (event, context, callback) {
	// all availabilty zones to query
	let az = [
		"us-east-1",
		"us-east-2",
		"us-west-1",
		"us-west-2",
		"ca-central-1",
		"eu-central-1",
		"eu-west-1",
		"eu-west-2",
		"eu-west-3",
		"ap-northeast-1",
		"ap-northeast-2",
		// "ap-northeast-3",
		"ap-southeast-1",
		"ap-southeast-2",
		"ap-south-1",
		"sa-east-1"
	]

	let requests = []

	/**
	* This is used to set the query for ASG's in the availabilty zones listed 
	* 
	* @function
	* @name setOptions
	* @param {String} singleAZ - String of single availability zone
	*/
	let setOptions = function(singleAZ){
		return rp({
			uri: process.env['getAllURL'],
			method: 'POST',
			body: {region:singleAZ},
			headers: {"Content-Type": "application/json",},
			json: true
		})
	}

	az.forEach((singleAZ)=>{
		requests.push(setOptions(singleAZ))
	})

	Promise.all(requests).then((res)=>{
		console.log(res)
		callback(null, {statusCode: 200, body: JSON.stringify(res)});
	}).catch((err)=>{
		console.log(err)
		callback(null, {statusCode: 400, body: err});
	})
    
};
