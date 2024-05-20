import { Request, Response } from 'express';
import { CreateSessionInput } from '../schema/auth.schema';
import { findUserByEmail, findUserById } from '../service/user.service';
import {
  findSessionById,
  signAccesToken,
  signRefreshToken,
} from '../service/auth.service';
import { get } from 'lodash';
import { verifyJwt } from '../utils/jwt';

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

export const refreshAccessTokenHandler = async (
  req: Request,
  res: Response
) => {
  const refreshToken = get(req, 'headers.x-refresh') as string;
  const decoded = verifyJwt<{ session: string }>(
    refreshToken,
    'refreshTokenPublicKey'
  );
  if (!decoded) {
    return res.status(401).send('Could not refresh acces token');
  }

  const session = await findSessionById(decoded.session);

  if (!session || !session.valid) {
    return res.status(401).send('Could not refresh acces token');
  }

  const user = await findUserById(String(session.user));

  if (!user) {
    return res.status(401).send('Could not refresh acces token');
  }

  const accessToken = signAccesToken(user);

  res.send({ accessToken });
};
