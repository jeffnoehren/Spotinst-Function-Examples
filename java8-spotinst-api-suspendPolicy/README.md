# Java8 Suspend Scaling Policy

This is a simple Java8 project that allows you to connect to the Spotinst API and suspend scaling policies on your Elastigroup.

## Download

To download this project as a template for your own Spotinst Function please use this command

```bash
serverless create --template-url https://github.com/spotinst/spotinst-functions-examples/tree/master/java8-spotinst-api-suspendPolicy
```


### Prerequisites

You will need to have the serverless framework installed, your Spotinst credentials set up, environment ID and account ID in order to run this project. 

First you will want to install the serverless framework onto your local machine using the terminal command

```bash
npm install -g serverless
```

Once this has finished downloading you will have to set up your credentials to link your local machine projects to your Spotinst console. To do this please follow the directions listed [here](https://serverless.com/framework/docs/providers/spotinst/guide/credentials/).

You will also need your environment ID for your function. This can be found on the Spotinst console under the Serverless Functions tab. Select the application you wish to deploy this funciton to and locate the environment that you wish to use. Copy the environment ID and save this for later use

The last thing you will need is your account ID which can be found in the Spotinst console under user setting. Save this for later use. 

### Installing

First you will need to fork this repository and set it up on your local machine. Then you will need to install the serverless-spotinst-functions plugin by running this command:

```bash
npm install
```

## Packaging

Before you can deploy a Java8 file you will need to first package it locally. To do this you will need `mvn` install locally on your computer. After this is done go to the pom.xml file and make sure that the finalName tag has the same value as the Service tag in the serverless.yml file. Then you simply use the command:

```bash
mvn package
```

## Deployment

Before you can deploy you must enter into the serverless.yml file youre environment ID under the provider tag. Next you will want to deploy this function using this command:

```bash
sls deploy
```

## Environment Variables

After the project has been deployed you will need to enter you Spotinst Account ID, Spotinst API token, Elastigroup ID and adjustment value as environment variables. To do this go to your function on the Spotinst Console and find the variable key `spotGroup`, `spotAccount`, `spotToken`, and `policyName` then enter the value for each of these followed by press Update Function.

**Warning:** If you edit your code then re-deploy the function your environment variables will get over written. To stop this from happening delete the list of environment variables from the `serverless.yml` file after the first deploy

## Testing

To test if this is working use the command:

```bash
sls invoke -f SuspendPolicy
```

Or you can use the test feature on the Spoinst console. Either way you should see "Succes" if it executed properly or "400 Error: Check Logs"

## Set Timer

If you want you can set this function up to run on a schedule using the cron function in the serverless.yml file. Use the [cron function reference](https://crontab.guru/) for help on setting up your cron function. 


