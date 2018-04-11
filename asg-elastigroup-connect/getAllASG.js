const rp = require('request-promise')
const AWS = require('aws-sdk')

/**
* This function searches the given availabilty zone and finds all the ASG's in that region and if they
* have a tag with a key elastigroupId then we collect that information and send the elastigroup to 
* getSingleASG function to extract more information
* 
* @function
* @name getAllASG
* @param {Object} event - Event data from Spotinst Functions
* @param {Object} context - Context of the Spotinst Function
* @param {function} callback - function to finalize the request
*
* @property {String} process.env['getSingleASG'] - String for the URL for the getSingleASG function in service
*/
module.exports.main = function main (event, context, callback) {
	// getting information from the previous function
	let payload = JSON.parse(event.body)
	console.log(payload)

	// setting our config with the region from the payload
	let config = new AWS.Config({
		accessKeyId: process.env['awsKey'],   
		secretAccessKey: process.env['awsSecret'],
		region: payload.region
	})

	// creating AWS autoscaling object to query ASG info in AWS account
	let autoscaling = new AWS.AutoScaling(config)

	/**
	* This is used to set the query for getting more info for a single ASG
	* 
	* @function
	* @name setOptions
	* @param {Object} body - The starting of the information object we are building for each ASG
	*/
	let setOptions = function(body){
		return rp({
			uri: process.env['getSingleURL'],
			method: 'POST',
			body: body,
			json: true
		})
	}

	// querying the AWS account for all ASG in this region. If we find a group with tag key that matches
	// elastigroupId we gather information about the group and send it off to getSingleASG function
	autoscaling.describeAutoScalingGroups({}, (err, data)=>{
		if(err) callback(null, {statusCode: 400, body: console.log(err)})

		let groups = data.AutoScalingGroups
		let requests = []

		groups.forEach((singleGroup)=>{
			let tempBody = {}
			let tags = singleGroup.Tags
			console.log(singleGroup)

			tempBody.defaultCooldown = singleGroup.DefaultCooldown
			
			tags.forEach((singleTag)=>{
				if(singleTag.Key=="elastigroupId"){
					tempBody.asgName = singleGroup.AutoScalingGroupName
					tempBody.groupId = singleTag.Value
					tempBody.launchName = singleGroup.LaunchConfigurationName
					tempBody.region = payload.region

					tempBody.body = {
						group:{
							name: singleGroup.AutoScalingGroupName,
							capacity: {
								minimum: singleGroup.MinSize,
								maximum: singleGroup.MaxSize
							},
							compute:{
								launchSpecification:{
									healthCheckType: singleGroup.HealthCheckType,
									healthCheckGracePeriod: singleGroup.HealthCheckGracePeriod,
									tags: singleGroup.Tags,
								}
							}
						},
			    	}
			    	console.log(tempBody)
		    		requests.push(setOptions(tempBody))
				}
			})
		})

		Promise.all(requests).then((res)=>{
			console.log(res)
			callback(null, {statusCode: 200, body: `{"${payload.region}":${JSON.stringify(res)}}`})
		}).catch((err)=>{
			console.log(err)
			callback(null, {statusCode: 400, body: JSON.stringify(err)})			
		})
	})
};
