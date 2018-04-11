const rp = require('request-promise')
const AWS = require('aws-sdk')

module.exports.main = function main (event, context, callback) {
	// getting information from the previous function
	let payload = JSON.parse(event.body)
	console.log(payload)

	let config = new AWS.Config({
		accessKeyId: process.env['awsKey'],   
		secretAccessKey: process.env['awsSecret'],
	})

	let kms = new AWS.KMS(cofig);

	context.getDoc("encryptedToken", function(err, res) {
		if(err) callback(err, {statusCode: 400, body: console.log(err)});

		console.log(res)

		kms.decrypt({CiphertextBlob: res}, (err, data) => {
			if(err) callback(err, {statusCode: 400, body: console.log(err)});

			console.log(data.Plaintext)
			callback(null, {statusCode:200, body: data.Plaintext})
		})
	});
}