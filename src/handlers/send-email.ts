import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { SES } from 'aws-sdk';
import { z } from 'zod';

const ses = new SES();

const dto = z.object({
  email: z
    .string()
    .min(1, "Email field shouldn't be empty")
    .email('Invalid email format'),
  name: z.string().min(1, "Name field shouldn't be empty"),
  subject: z.string().min(1, "Subject field shouldn't be empty"),
  message: z.string().min(1, "Message field shouldn't be empty"),
});

export const handler = async (event: APIGatewayProxyEvent) => {
  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: '',
    headers: { 'Access-Control-Allow-Origin': '*' },
  };

  const body = event.body ? JSON.parse(event.body) : null;
  const validate = dto.safeParse(body);

  if (!validate.success) {
    response.statusCode = 422;
    response.body = JSON.stringify({
      message: validate.error.issues[0].message,
    });

    return response;
  }

  const { email, name, subject, message } = validate.data;

  const params = {
    Destination: {
      ToAddresses: [process.env.EMAIL_SOURCE!],
    },
    Message: {
      Body: {
        Html: {
          Data: `
                  <h2>Message from ${name} - ${email}</h2>
                  <br />
                  <p>${message.split('\n').join('<br />')}</p>
                `,
        },
      },
      Subject: { Data: subject },
    },
    Source: process.env.EMAIL_SOURCE!,
  };

  try {
    await ses.sendEmail(params).promise();
  } catch (err) {
    response.statusCode = 500;
    response.body = JSON.stringify({ message: (err as Error).message });

    return response;
  }

  response.body = JSON.stringify({ message: 'Email has sent successfully!' });

  return response;
};
