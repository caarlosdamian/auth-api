import { Request, Response } from 'express';
import { CreateUserInput, VerifyUserInput } from '../schema/user.schema';
import { createUser, findUserById } from '../service/user.service';
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

export async function verifyUserHandler(
  req: Request<VerifyUserInput>,
  res: Response
) {
  const id = req.params.id;
  console.log(id)
  const verificationCode = req.params.verificationCode;
  // find the user by id ;
  const user = await findUserById(id);
  if (!user) {
    return res.send('Could not verify user');
  }
  // check to see if they are already verified
  if (user.verified) {
    return res.send('user is already verified');
  }

  // check to see if the verificationcode matches
  if (user.verificationCode === verificationCode) {
    user.verified = true;

    await user.save();

    return res.send('User succesfully verifed');
  }

  return res.send('Could not verify user');
}
