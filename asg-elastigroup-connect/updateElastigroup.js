const rp = require('request-promise')

/**
* This function gets an update JSON and send the request to the Spotinst API
* 
* @function
* @name updateElastigroup
* @param {Object} event - Event data from Spotinst Functions
* @param {Object} context - Context of the Spotinst Function
* @param {function} callback - function to finalize the request
*/
module.exports.main = function main (event, context, callback) {
	let token = process.env['token']
	let account = process.env['account']

	let payload = JSON.parse(event.body)

	console.log(JSON.stringify(payload))

	let options = {
		uri: `https://api.spotinst.io/aws/ec2/group/${payload.groupId}?accountId=${account}`,
		method: 'PUT',
		body: payload.body,
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${token}`
		},
		json: true
	}

	rp(options).then((res)=>{
		console.log(res.response.items)
		callback(null, {statusCode: 200, body: "Success"});
	}).catch((err)=>{
		console.log(err)
		callback(null, {statusCode: 400, body: err});
	})
};
