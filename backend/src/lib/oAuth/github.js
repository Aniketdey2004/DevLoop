import {GitHub} from "arctic";
import {ENV} from '../env.js';

export const github=new GitHub(
    ENV.GITHUB_CLIENT_ID,
    ENV.GITHUB_CLIENT_SECRET,
    `${ENV.BACKEND_URL}/api/v1/auth/github/callback`
);