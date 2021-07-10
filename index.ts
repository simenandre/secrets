import * as pulumi from '@pulumi/pulumi';
import { localNpmToken } from './secrets/npm';
import { localGithubToken } from './secrets/github';

export const githubToken = pulumi.secret(localGithubToken);
export const npmToken = pulumi.secret(localNpmToken);
