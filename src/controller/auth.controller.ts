import { Request, Response } from 'express';
import { CreateSessionInput } from '../schema/auth.schema';
import { findUserByEmail } from '../service/user.service';
import { signAccesToken, signRefreshToken } from '../service/auth.service';

export const createSessionHandler = async (
  req: Request<{}, {}, CreateSessionInput>,
  res: Response
) => {
  const message = 'Invalid email or password';
  const { email, password } = req.body;
  const user = await findUserByEmail(email);
  if (!user) {
    return res.send(message);
  }
  if (!user.verified) {
    return res.send('Please verify your email');
  }

  const isValid = await user.validatePassword(password);

  if (!isValid) {
    return res.send(message);
  }

  // sing a acces token
  const accessToken = signAccesToken(user);
  // sing a refresh token
  // @ts-ignore
  const refreshToken = await signRefreshToken({ userId: user._id });
  // send the tokens
  res.send({
    accessToken,
    refreshToken,
  });
};
