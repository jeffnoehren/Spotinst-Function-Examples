<a name="getAllASG"></a>

## getAllASG(event, context, callback)
This function searches the given availabilty zone and finds all the ASG's in that region and if they
have a tag with a key elastigroupId then we collect that information and send the elastigroup to 
getSingleASG function to extract more information

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>Object</code> | Event data from Spotinst Functions |
| context | <code>Object</code> | Context of the Spotinst Function |
| callback | <code>function</code> | function to finalize the request |

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| process.env['getSingleASG' | <code>String</code> | String for the URL for the getSingleASG function in service |


* * *

<a name="setOptions"></a>

## setOptions(body)
This is used to set the query for getting more info for a single ASG

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> | The starting of the information object we are building for each ASG |


* * *

