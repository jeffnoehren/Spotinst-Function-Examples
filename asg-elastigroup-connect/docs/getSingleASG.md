<a name="getSingleASG"></a>

## getSingleASG(event, context, callback)
This function gets a single ASG and gathers more information to compile into a json that is accepted into the
updateElastigroup funciton.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>Object</code> | Event data from Spotinst Functions |
| context | <code>Object</code> | Context of the Spotinst Function |
| callback | <code>function</code> | function to finalize the request |

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| process.env['getPolicyURL' | <code>String</code> | String for the URL for the setPolicy function in service |
| process.env['updateElastigroupURL' | <code>String</code> | String for the URL for the updateElastigroup function in service |


* * *

<a name="handleError"></a>

## handleError(err)
This is used catch and log any error then return a callback with the ASG and Elastigroup info

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| err | <code>Error</code> | Error that is thrown |


* * *

<a name="setElastigroupOptions"></a>

## setElastigroupOptions(body)
This is used to set the query for updating the elastigroup attached to a single ASG

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>Object</code> | JSON object that contains update inforation for the Elastigroup |


* * *

<a name="setPolicyRequest"></a>

## setPolicyRequest(body)
This is used to set the query for one of the ASG's scaling policies

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| body | <code>String</code> | JSON object that contains inforation on a single scaling policy |


* * *

<a name="getAllPolicies"></a>

## getAllPolicies() ⇒ <code>Array</code>
This function gets all the scaling polcies in the ASG and returns an array of single policy requests

**Kind**: global function  
**Returns**: <code>Array</code> - policyRequest - Array of all single polciy request  

* * *

<a name="getSinglePolicies"></a>

## getSinglePolicies(policyRequest)
This function send the requests for each policy to the getPolicy function and catagorizes the results
into the catagories up, down, and target

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| policyRequest | <code>Array</code> | Array of single policy request |


* * *

<a name="getSchedulesActions"></a>

## getSchedulesActions()
This fuction will get the scheduled actions for the ASG and adds them to the update JSON

**Kind**: global function  

* * *

<a name="getLaunchConfig"></a>

## getLaunchConfig()
This function gets all the information for the Launch Configuration for the ASG and adds the 
information to the update JSON

**Kind**: global function  

* * *

