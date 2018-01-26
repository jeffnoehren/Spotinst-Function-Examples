# Node SNS Endpoint Function

This is a simple node project that you can use as an endpoint for SNS triggers from AWS

## Download

To download this project as a template for your own Spotinst Function please use this command

```bash
serverless create --template-url https://github.com/spotinst/spotinst-functions-examples/tree/master/node-sns-endpoint
```


### Prerequisites

You will need to have the serverless framework installed, your Spotinst credentials set up and you will need an API token, environment ID and account ID in order to run this project. 

First you will want to install the serverless framework onto your local machine using the terminal command

```bash
npm install -g serverless
```

Once this has finished downloading you will have to set up your credentials to link your local machine projects to your Spotinst console. To do this please follow the directions listed [here](https://serverless.com/framework/docs/providers/spotinst/guide/credentials/) This will generate a token which you will need in order to gain access to the Spotinst API so copy this somewhere for later use. 

You will also need your environment ID for your function. This can be found on the Spotinst console under the Serverless Functions tab. Select the application you wish to deploy this funciton to and locate the environment that you wish to use. Copy the environment ID and save this for later use

The last thing you will need is your account ID which can be found in the Spotinst console under user setting. Save this for later use. 

### Installing

First you will need to fork this repository and set it up on your local machine. Then you will need to install the serverless-spotinst-functions plugin as well as the request and the request-promise libraries by running this command inside the project repository:

```bash
npm install
```

Once this has been completed navigate to the handler.js file and input your token and account ID. Then you will need to navigate to the serverless.yml file and under environment add in the environment ID in the environment section.

## Deployment

Next you will want to deploy this function using this command:

```bash
sls deploy
```

The first time you run this command your new function will be created and linked to your Spotinst account under the environment that you specified. You can check this on the Spotinst Functions console. 

## Testing

To get this function to work you will need to set this as the SNS Subscription endpoint for the ARN that you want. It will return the proper value for authenification. Once this has completed it can be customized for any SNS notifcation sent.



