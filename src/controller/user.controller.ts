import { Request, Response } from 'express';
import {
  CreateUserInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  VerifyUserInput,
} from '../schema/user.schema';
import {
  createUser,
  findUserByEmail,
  findUserById,
} from '../service/user.service';
import sendEmail from '../utils/mailer';
import log from '../utils/logger';
import crypto from 'crypto';

export const createUserHandler = async (
  req: Request<{}, {}, CreateUserInput>,
  res: Response
) => {
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
};

export const verifyUserHandler = async (
  req: Request<VerifyUserInput>,
  res: Response
) => {
  const id = req.params.id;
  console.log(id);
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
};

export const forgotPasswordHandler = async (
  req: Request<{}, {}, ForgotPasswordInput>,
  res: Response
) => {
  const message =
    'If a user with that email is registered you will receive a password reset email';
  const { email } = req.body;
  const user = await findUserByEmail(email);
  if (!user) {
    log.debug(`User with email ${email} does not exists`);
    return res.send(message);
  }
  if (!user.verified) return res.send('User is not verifed');
  const passwordResetCode = crypto.randomUUID();
  user.passwordResetCode = passwordResetCode;

  await user.save();
  await sendEmail({
    to: user.email,
    from: 'test@example.com',
    subject: 'Reset your password',
    text: `Password reset code: ${passwordResetCode}. Id:${user._id}`,
  });
  log.debug(`Password reset email sent to ${email}`);
  return res.send(message);
};

export const resetPasswordHandler = async (
  req: Request<ResetPasswordInput['params'], {}, ResetPasswordInput['body']>,
  res: Response
) => {
  const { id, passwordResetCode } = req.params;
  const { password } = req.body;

  const user = await findUserById(id);

  if (
    !user ||
    !user.passwordResetCode ||
    user.passwordResetCode !== passwordResetCode
  ) {
    return res.status(400).send('Could not reset user password');
  }

  user.passwordResetCode = null;
  user.password = password;

  await user.save();

  return res.send('Successfully updated password');
};
