import { jwtDecode } from 'jwt-decode';
import { getToken } from './storage';

type DecodedToken = {
  sub: string;
  username: string;
  role: 'admin' | 'viewer';
  exp: number;
};

export const getUserRole = async (): Promise<'admin' | 'viewer' | null> => {
  try {
    const token = await getToken('token');
    if (!token) return null;

    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.role;
  } catch (err) {
    console.error('Failed to decode token:', err);
    return null;
  }
};
