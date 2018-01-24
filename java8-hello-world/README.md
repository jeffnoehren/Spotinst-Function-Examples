# Java8 Hello World

[Check Out the Code](https://github.com/spotinst/spotinst-functions-examples/tree/master/java8-hello-world)

This is a simpel hello world on Java8 using Spotinst Functions

## Download

To download this project as a template for your own Spotinst Function please use this command

```bash
serverless create --template-url https://github.com/spotinst/spotinst-functions-examples/tree/master/java8-hello-world
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

The first time you run this command your new function will be created and linked to your Spotinst account under the environment that you specified. You can check this on the Spotinst Functions console. 

## Testing

To test if this is working use the command:

```bash
sls invoke -f hello
```

You can also do this from the console


