const rp = require('request-promise')
const AWS = require('aws-sdk')

/**
* This function gets a single ASG and gathers more information to compile into a json that is accepted into the
* updateElastigroup funciton.
* 
* @function
* @name getSingleASG
* @param {Object} event - Event data from Spotinst Functions
* @param {Object} context - Context of the Spotinst Function
* @param {function} callback - function to finalize the request
*
* @property {String} process.env['getPolicyURL'] - String for the URL for the setPolicy function in service
* @property {String} process.env['updateElastigroupURL'] - String for the URL for the updateElastigroup function in service
*/
module.exports.main = function main (event, context, callback) {
	// getting the information from previous function that contains single ASG
	let payload = JSON.parse(event.body)
	console.log(payload)
	console.log("\n\n")
	console.log(payload.body.group.capacity)	
	console.log("\n\n")
	console.log(payload.body.group.compute)
	console.log("\n\n")

	// setting config region for ASG
	let config = new AWS.Config({
		accessKeyId: process.env['awsKey'],   
		secretAccessKey: process.env['awsSecret'],
		region: payload.region
	})
	let autoscaling = new AWS.AutoScaling(config)
	
	// Set ASG Tags to match Spotinst Tags
	let tempTags = []
	payload.body.group.compute.launchSpecification.tags.forEach((singleTag)=>{
		if(singleTag.Key.substring(0,4) != "aws:") tempTags.push({tagKey:singleTag.Key, tagValue:singleTag.Value})
	})
	payload.body.group.compute.launchSpecification.tags = tempTags


	/**
	* This is used catch and log any error then return a callback with the ASG and Elastigroup info 
	* 
	* @function
	* @name handleError
	* @param {Error} err - Error that is thrown
	*/
	let handleError = function(err){
		console.log(err)
		return callback(null, {statusCode:200, body: JSON.stringify({groupId:payload.groupId ,asgName:payload.asgName, failed:true})})
	}

	/**
	* This is used to set the query for updating the elastigroup attached to a single ASG
	* 
	* @function
	* @name setElastigroupOptions
	* @param {Object} body - JSON object that contains update inforation for the Elastigroup
	*/
	let setElastigroupOptions = function(body){
		return ({
			uri: process.env['updateElastigroupURL'],
			method: 'POST',
			body: body,
			json: true
		})
	}

	/**
	* This is used to set the query for one of the ASG's scaling policies
	* 
	* @function
	* @name setPolicyRequest
	* @param {String} body - JSON object that contains inforation on a single scaling policy
	*/
	let setPolicyRequest = function(body){
		return rp({
			uri: process.env['getPolicyURL'],
			method: 'POST',
			body: body,
			json: true
		})
	}

	/**
	* This function gets all the scaling polcies in the ASG and returns an array of single policy requests
	* 
	* @function
	* @name getAllPolicies
	* @returns {Array} policyRequest - Array of all single polciy request
	*/
	let getAllPolicies = function() {
		return new Promise((resolve, reject)=>{
			// getting all scaling policies
			autoscaling.describePolicies({AutoScalingGroupName: payload.asgName}, (err, data)=>{
				if(err) return reject(err)

				let scalingPolicies = data.ScalingPolicies
				let policyRequest = []

				// setting requests for single policy
				scalingPolicies.forEach((singlePolicy)=>{
					singlePolicy.region = payload.region
					singlePolicy.defaultCooldown = payload.defaultCooldown
					if(singlePolicy.Alarms.length>0) policyRequest.push(setPolicyRequest(singlePolicy))
				})
				return resolve(policyRequest)
			})			
		})
	}

	/**
	* This function send the requests for each policy to the getPolicy function and catagorizes the results
	* into the catagories up, down, and target
	* 
	* @function
	* @name getSinglePolicies
	* @param {Array} policyRequest - Array of single policy request
	*/
	let getSinglePolicies = function(policyRequest){
		return new Promise((resolve, reject)=>{
			// sending request for each polciy 
			Promise.all(policyRequest).then((policyRes)=>{
				let tempUp = []
				let tempDown = []
				let tempTarget = []

				// sending resonses to appropropriate categories
				policyRes.forEach((singleElastigroupPolicy)=>{
					if(singleElastigroupPolicy.type == "target"){
						delete singleElastigroupPolicy.type
						tempTarget.push(singleElastigroupPolicy)
					}else if(singleElastigroupPolicy.type == "up"){
						delete singleElastigroupPolicy.type
						tempUp.push(singleElastigroupPolicy)
					}else if(singleElastigroupPolicy.type == "down"){
						delete singleElastigroupPolicy.type
						tempDown.push(singleElastigroupPolicy)					
					}
				})

				// setting output json with scaling polcies
				if(tempUp.length==0 && tempDown.length==0 && tempTarget.length==0){
					payload.body.group.scaling = null
				}else{
					payload.body.group.scaling = {
						up: tempUp,
						down: tempDown,
						target: tempTarget
					}
				}

				console.log(payload.body.group.scaling)
				console.log("\n\n")	

				return resolve()
			}).catch((err)=>{return reject(err)})
		})
	}

	/**
	*  This fuction will get the scheduled actions for the ASG and adds them to the update JSON
	* 
	* @function
	* @name getSchedulesActions
	*/
	let getSchedulesActions = function(){
		return new Promise((resolve, reject)=>{
			// getting ASG scheduled actions
			autoscaling.describeScheduledActions({AutoScalingGroupName: payload.asgName}, (err, data)=>{
				if(err) return reject(err)

				let schedulesAction = data.ScheduledUpdateGroupActions
				let tempTasks = []
				// grouping all scheduled tasks 
				schedulesAction.forEach((singleAction)=>{
					console.log(singleAction)
					console.log("\n\n")

					if(singleAction.Recurrence){
						tempTasks.push({
		                    taskType: "scale",
		                    cronExpression: singleAction.Recurrence,
		                    scaleTargetCapacity: singleAction.MaxSize,
		                    scaleMinCapacity: singleAction.MinSize,
		                    scaleMaxCapacity: singleAction.DesiredCapacity
		                })
					}
				})

				// adding tasks to update json
				if(tempTasks.length > 0) payload.body.group.scheduling = {tasks: tempTasks}

				console.log(payload.body.group.scheduling)
				console.log("\n\n")

				return resolve()
			})
		})
	}

	/**
	* This function gets all the information for the Launch Configuration for the ASG and adds the 
	* information to the update JSON
	* 
	* @function
	* @name getLaunchConfig
	*/
	let getLaunchConfig = function(){
		return new Promise((resolve, reject)=>{
			//getting launch configurations from ASG
			autoscaling.describeLaunchConfigurations({LaunchConfigurationNames: [payload.launchName]}, (err, data)=>{
				if(err) return reject(err)

				let launchConfig = data.LaunchConfigurations[0]
				console.log(launchConfig)
				console.log("\n\n")

				let tempBlock = []
				let asgBlockMapping = launchConfig.BlockDeviceMappings

				// getting ASG block mapping and setting it to the right format for Elastigroup
				asgBlockMapping.forEach((singleBlock)=>{
					let ebs = {}
					if(singleBlock.Ebs){
						console.log(singleBlock.Ebs)
						ebs = {
							volumeSize: singleBlock.Ebs.VolumeSize,
							volumeType: singleBlock.Ebs.VolumeType,
							deleteOnTermination: singleBlock.Ebs.DeleteOnTermination,
							encrypted: singleBlock.Ebs.Encrypted
						}
						console.log(ebs)
					} 

					tempBlock.push({
						deviceName: singleBlock.DeviceName,
						ebs: ebs
					})

				})

				// all this is setting ASG info for update Elastigroup
				payload.body.group.compute.launchSpecification.securityGroupIds = launchConfig.SecurityGroups
				payload.body.group.compute.launchSpecification.ebsOptimized = launchConfig.EbsOptimized
				payload.body.group.compute.instanceTypes = {ondemand: launchConfig.InstanceType}					

				payload.body.group.compute.launchSpecification.imageId = launchConfig.ImageId
				payload.body.group.compute.launchSpecification.monitoring = launchConfig.InstanceMonitoring.Enabled

				if(launchConfig.IamInstanceProfile) payload.body.group.compute.launchSpecification.iamRole = {name: launchConfig.IamInstanceProfile}
				else payload.body.group.compute.launchSpecification.iamRole = null

				if(launchConfig.KeyName) payload.body.group.compute.launchSpecification.keyPair = launchConfig.KeyName
				else payload.body.group.compute.launchSpecification.keyPair = null

				if(launchConfig.UserData) payload.body.group.compute.launchSpecification.userData = launchConfig.UserData
				else payload.body.group.compute.launchSpecification.userData = null

				if(tempBlock.length>0) payload.body.group.compute.launchSpecification.blockDeviceMappings = tempBlock
				else payload.body.group.compute.launchSpecification.blockDeviceMappings = null



				console.log(payload.body.group.compute)
				console.log("\n\n")

				return resolve()
			})
		})
	}

	getAllPolicies().catch((err)=>{return handleError(err)})
	.then(getSinglePolicies).catch((err)=>{return handleError(err)})
	.then(getSchedulesActions).catch((err)=>{return handleError(err)})
	.then(getLaunchConfig).catch((err)=>{return handleError(err)})
	.then(()=>{
		rp(setElastigroupOptions(payload)).then((res)=>{
			console.log(res)
			callback(null, {statusCode:200, body: JSON.stringify({groupId:payload.groupId ,asgName:payload.asgName, failed:false})})
		}).catch((err)=>{return handleError(err)})
	})
};




