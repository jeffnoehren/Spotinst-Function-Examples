const rp = require('request-promise')
const AWS = require('aws-sdk')
const camelCase = require('camelcase')

/**
* This function gets one ASG policy and looks up the alarms that are associated with that
* policy and sets all the corresponding variables for Elastigroup
* 
* @function
* @name getPolicy
* @param {Object} event - Event data from Spotinst Functions
* @param {Object} context - Context of the Spotinst Function
* @param {function} callback - function to finalize the request
*/
module.exports.main = function main (event, context, callback) {
	// getting info from previous function, single ASG scaling policy
	let payload = JSON.parse(event.body)
	console.log(payload)
	console.log("\n\n")

	// setting region for searching cloudwatch for alarms
	let config = new AWS.Config({
		accessKeyId: process.env['awsKey'],   
		secretAccessKey: process.env['awsSecret'],
		region: payload.region
	})

	let cloudwatch = new AWS.CloudWatch(config);

	let output = {}
	let alarms, alarmNames = []

	alarms = payload.Alarms

	// setting default cooldown
	if(payload.EstimatedInstanceWarmup) output.cooldown = payload.EstimatedInstanceWarmup - (payload.EstimatedInstanceWarmup%60)
	else output.cooldown = payload.defaultCooldown || 300

	output.policyName = payload.PolicyName

	// separating into Elastigroup categories and adding vars to output
	if(payload.PolicyType == "SimpleScaling"){
		if(payload.ScalingAdjustment>0){
			output.type = "up"
			output.source = "cloudWatch"
		}else{
			output.type = "down"
			output.source = "cloudWatch"
			payload.ScalingAdjustment = payload.ScalingAdjustment * -1
		}

		output.action = {
			type: "adjustment",
			adjustment: payload.ScalingAdjustment
		}

	}else if(payload.PolicyType == "TargetTrackingScaling"){
		output.type = "target"
		output.target = payload.TargetTrackingConfiguration.TargetValue
	}else{
		callback(null, {statusCode:200, body: JSON.stringify(output)})
	}

	// grouping together alarm names to look up
	alarms.forEach((singleAlarm)=>{
		alarmNames.push(singleAlarm.AlarmName)
	})

	// searching all alarms associated with single policy
	cloudwatch.describeAlarms({AlarmNames: alarmNames}, (err, data)=>{
		if(err) callback(null, {statusCode:400, body: console.log(err)})

		let tempAlarms = data.MetricAlarms
		// setting output for updating Elastigroup with ASG scaling policy
		tempAlarms.forEach((singleAlarm)=>{
			console.log(singleAlarm)
			console.log("\n\n")

			output.metricName = singleAlarm.MetricName
			output.statistic = camelCase(singleAlarm.Statistic)
			output.namespace = singleAlarm.Namespace

			if(singleAlarm.MetricName=="CPUUtilization") output.unit = "percent"
			else output.unit = "bytes"

			if(output.type != "target"){
				output.period = singleAlarm.Period
				output.evaluationPeriods = singleAlarm.EvaluationPeriods
				output.threshold = singleAlarm.Threshold

			}
		})
		console.log(output)
		callback(null, {statusCode:200, body:JSON.stringify(output)})
	})
}




