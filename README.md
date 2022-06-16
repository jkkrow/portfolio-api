# Portfolio API

This project is a serverless api which is used by my portfolio website. This is created with AWS Serverless Application Model (SAM) template which contains AWS resources including a Lambda function and an API Gateway API.

## Functions

This API contains following function:

- `SendEmailFunction`: Receives a request body with email, name, subject and message. Then sends a email directly to me using AWS SES service.

## Parameters

The template requires a parameter for a target email which you need to specify when deploying. This is used to setup `SESCrudPolicy` and environment variable in the template. 

```yaml
Parameters:
  SESIdentity:
    Type: String
    Description: Target email for SES send email
```

## Clone the application

### Prerequisites

To run a SAM CLI command in your machine, you need install a SAM CLI and setup AWS credentials. [See details here](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-getting-started.html).

### Deploy the application

To build and deploy the application, run the following commands in your shell:

```bash
sam build
sam deploy --guided
```

### Test the application locally using CLI

To test a function locally, first install dependencies.

```bash
cd src
npm install
```

You can test a single function by invoking it directly with a test event. Test events are included in the `events` folder in this project.

```bash
sam build
sam local invoke SendEmailFunction --event events/send-email.json
```

The SAM CLI can also emulate your application's API.

```bash
sam local start-api
```