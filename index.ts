import * as pulumi from '@pulumi/pulumi';
import { localNpmToken } from './secrets/npm.js';
import { token } from './secrets/github-providers.js';
import './secrets/slack-webhook.js';
import './secrets/pulumi.js';

export const githubToken = pulumi.secret(token);
export const npmToken = pulumi.secret(localNpmToken);
