<a name="getAllZones"></a>

## getAllZones(event, context, callback)
This is the starting point for the service. Here we have listed all the Availability Zones and we build a request
to for each one to access their Auto Scaling Groups so then return the result to the user

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>Object</code> | Event data from Spotinst Functions |
| context | <code>Object</code> | Context of the Spotinst Function |
| callback | <code>function</code> | function to finalize the request |

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| process.env['getAllURL' | <code>String</code> | String for the URL for the getAllASG function in service |


* * *

<a name="setOptions"></a>

## setOptions(singleAZ)
This is used to set the query for ASG's in the availabilty zones listed

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| singleAZ | <code>String</code> | String of single availability zone |


* * *

