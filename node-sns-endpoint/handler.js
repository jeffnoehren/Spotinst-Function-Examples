const rp = require("request-promise")
const MessageValidator = require('sns-validator');

const validator = new MessageValidator();

module.exports.main = function main (event, context, callback) {
    let message = JSON.parse(event.body);

    validator.validate(message, function (err, message) {
        if(err) {
            console.error(err);
            callback(null, {statusCode:400, body:"Error Check Logs"})
        }
        console.log(message);
        if(message['Type'] === 'Notification'){
            // Enter Here what you want the function to do when triggered by events
            console.log("Incoming Notification")

            
            callback(null, {statusCode:200, body:"Incoming Notification"});
        }else if (message['Type'] === 'SubscriptionConfirmation') {
            let options = {
                uri:message['SubscribeURL'],
                method:"GET",
                json:true
            }
            rp(options).then((res)=>{
                // You have confirmed your endpoint subscription
                console.log(res)
                callback(null, {statusCode: 200,body: "Success"})
            }).catch((err)=>{
                console.log(err)
                callback(null, {statusCode: 400,body: "Error Check Logs"})
            })
        }else{
            console.log("Not Recognized Input")
            callback(null, {statusCode: 400,body: "Not Recognized Input"})
        }
    });
};

