const rp = require('request-promise')
const AWS = require('aws-sdk')

module.exports.main = function main (event, context, callback) {
	// getting information from the previous function
	let payload = JSON.parse(event.body)
	console.log(payload)

	let account = payload.account
	let token = payload.token
	let environment = payload.environment

	let config = new AWS.Config({
		accessKeyId: process.env['awsKey'],   
		secretAccessKey: process.env['awsSecret'],
	})

	let kms = new AWS.KMS(cofig);

	let postOptions = {
		uri:'https://api.spotinst.io/functions/environment/'+environment+'/userDocument/encryptedToken',
		method: "PUT",
		qs: {accountId: account},
		headers: {
			"Content-Type": "application/json",
			"Authorization": "Bearer " + token},
		body: {},
		json:true
	}

	kms.encrypt({KeyId:process.env['KMSKeyID'], Plaintext: payload.key}, (err, data) =>{
		if(err) callback(null, {statusCode:400, body:console.log(err)})

		console.log(data.CiphertextBlob)

		let postOptions.body = {
			"userDocument": {
				"value": data.CiphertextBlob
			}
		}

		rp(postOptions).then((res)=>{
			console.log(res)
			callback(null, {statusCode:200, body:"Success"})
		}).catch((err)=>{
			console.log(err)
			callback(null, {statusCode:400, body:"Error"})
		})
	})

}