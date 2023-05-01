import * as pulumi from '@pulumi/pulumi';
import * as github from '@pulumi/github';
import { getGithubProvider } from './github-providers.js';
import { invariant } from 'ts-invariant';
import { getToken } from 'get-pulumi-secret';

const config = new pulumi.Config('npm');
const token = getToken({
  name: 'token',
  namespace: 'npm',
});
const repositories = config.requireObject<string[]>('repos');

export const localNpmToken = token;

repositories.map(r => {
  const [org, repository] = r.split('/');
  invariant(repository && org, 'repos must be owner/repo');
  return new github.ActionsSecret(
    `npm-${org}-${repository}`,
    {
      secretName: 'NPM_TOKEN',
      plaintextValue: token,
      repository,
    },
    { provider: getGithubProvider(org) },
  );
});
