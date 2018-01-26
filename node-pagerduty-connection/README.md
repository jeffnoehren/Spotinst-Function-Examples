# Connect Spotinst Elastigroups to Notify PagerDuty

[Check Out the Code](https://github.com/spotinst/spotinst-functions-examples/tree/master/node-pagerduty-connection)

This project allows you to connect your Elastigroups to PagerDuty to send notification for any event of our Event Types. The idea is that the Elastigroup will send a request to this function which will in tern send a event notification to PagerDuty.

## Download

To download this project as a template for your own Spotinst Function please use this command.

```bash
serverless create --template-url https://github.com/spotinst/spotinst-functions-examples/tree/master/node-pagerduty-connection
```

### Prerequisites

You will need to have the serverless framework installed, your Spotinst credentials set up and you will need MySQL database credentials, environment ID and account ID in order to run this project. 

First you will want to install the serverless framework onto your local machine using the terminal command

```bash
npm install -g serverless
```

Once this has finished downloading you will have to set up your credentials to link your local machine projects to your Spotinst console. To do this please follow the directions listed [here](https://serverless.com/framework/docs/providers/spotinst/guide/credentials/).

You will also need your environment ID for your function. This can be found on the Spotinst console under the Serverless Functions tab. Select the application you wish to deploy this funciton to and locate the environment that you wish to use. Copy the environment ID and save this for later use.

Additionally you will need to have your MySQL `host`, `username`, `database`, and `password` to gain access to your data table.

The last thing you will need is your account ID which can be found in the Spotinst console under user setting. Save this for later use. 

### Installing

First you will need to fork this repository and set it up on your local machine. Then you will need to install the serverless-spotinst-functions plugin, reuqest and request-promise libraries by running this command inside the project repository:

```bash
npm install
```

Once this has been completed you will need to navigate to the serverless.yml file and under environment add in the environment ID in the environment section.

## Deployment

Next you will want to deploy this function using this command:

```bash
sls deploy
```

The first time you run this command your new function will be created and linked to your Spotinst account under the environment that you specified. You can check this on the Spotinst Functions console. 

## Environment Variables

After the project has been deployed you will need to enter you Spotinst Account ID, Spotinst API token, Elastigroup ID and adjustment value as environment variables. To do this go to your function on the Spotinst Console and find the variable key `pagerToken` and `pagerKey` then enter the value for each of these followed by press Update Function.

**Warning:** If you edit your code then re-deploy the function your environment variables will get over written. To stop this from happening delete the list of environment variables from the `serverless.yml` file after the first deploy


## Connecting to You Accounts

To set up your Elastigroup to send HTTPS notifications that link to this function you will first need to make sure that you have already deployed this function at least once. This is because you will need the unique URL that is create for each function. Once you have obtained the URL you will need to run the node file PostNotificationSpotinst.js that is provided. In that file you will need to enter your token, group ID, and the URL that was generated from this function. Then you select the event type to be one of the following:

```
AWS_EC2_INSTANCE_TERMINATE 
AWS_EC2_INSTANCE_TERMINATED 
AWS_EC2_INSTANCE_LAUNCH 
AWS_EC2_INSTANCE_UNHEALTHY_IN_ELB 
GROUP_ROLL_FAILED 
GROUP_ROLL_FINISHED 
CANT_SCALE_UP_GROUP_MAX_CAPACITY
```  

**Note:** The options you select here will have to match the options that you input for the checkEventType() function in the handler.js



