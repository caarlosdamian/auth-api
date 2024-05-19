import { Request, Response } from 'express';
import { CreateUserInput } from '../schema/user.schema';
import { createUser } from '../service/user.service';
import sendEmail from '../utils/mailer';

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput>,
  res: Response
) {
  const body = req.body;
  try {
    const user = await createUser(body);
    await sendEmail({
      from: 'text@example.com',
      to: user.email,
      subject: 'Please verify your account',
      text: `Verification code ${user.verificationCode}. Id: ${user.id}`,
    });
    return res.send('User succesfully created');
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(409).send('Account already exits');
    }
    return res.status(500).send(error);
  }
}
