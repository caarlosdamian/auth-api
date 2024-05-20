import { DocumentType } from '@typegoose/typegoose';
import { User, privateFields } from '../model/user.model';
import { signJwt } from '../utils/jwt';
import SessionModel from '../model/session.model';
import { omit } from 'lodash';

const createSession = async ({ userId }: { userId: string }) => {
  return SessionModel.create({ user: userId });
};

export const signRefreshToken = async ({ userId }: { userId: string }) => {
  const session = await createSession({ userId });
  const refreshToken = signJwt(
    { session: session._id },
    'refreshTokenPrivateKey',
    {
      expiresIn: '1y',
    }
  );

  return refreshToken;
};

export const signAccesToken = (user: DocumentType<User>) => {
  const payload = omit(user.toJSON(), privateFields);
  const accessToken = signJwt(payload, 'accessTokenPrivateKey', {
    expiresIn: '15m',
  });

  return accessToken;
};

export const findSessionById = (id: string) => {
  return SessionModel.findById(id);
};
