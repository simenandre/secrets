import * as pulumi from '@pulumi/pulumi';
import { localNpmToken } from './secrets/npm.js';
import { localGithubToken } from './secrets/github.js';
import './secrets/slack-webhook.js';
import './secrets/pulumi.js';

export const githubToken = pulumi.secret(localGithubToken);
export const npmToken = pulumi.secret(localNpmToken);
