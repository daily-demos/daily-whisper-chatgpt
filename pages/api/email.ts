import nodemailer from 'nodemailer';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Load summary from req.body and the environment variables
    const { summary } = req.body;
    const email = process.env.EMAIL_SUMMARY;
    const smtpLogin = process.env.SMTP_LOGIN;
    const smtpPassword = process.env.SMTP_PASSWORD;
    const smtpPort = process.env.SMTP_PORT;
    const smtpServer = process.env.SMTP_SERVER;

    // check if any of the variables are undefined
    if (!email || !smtpLogin || !smtpPassword || !smtpPort || !smtpServer) {
      throw new Error(
        'One or more of the SMTP or email environment variables are not defined'
      );
    }

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: smtpServer,
      port: smtpPort,
      secure: false,
      auth: {
        user: smtpLogin,
        pass: smtpPassword,
      },
    } as nodemailer.TransportOptions);

    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"Daily Email Summary Bot" <${smtpLogin}>`, // sender address
      to: email, // list of receivers
      subject: 'Your email summary', // Subject line
      text: `Hello this is an automated meeting summary from your video call: ${summary}`, // plain text body
    });

    return res.status(200).json({ info });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error && error.message
        ? { errorMessage: error.message }
        : { errorMessage: 'An error occurred while generating the email' };

    return res.status(500).send(errorMessage);
  }
}
