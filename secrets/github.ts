import * as pulumi from '@pulumi/pulumi';
import * as github from '@pulumi/github';
import { getGithubProvider } from './github-providers.js';
import { invariant } from 'ts-invariant';
import { checkExpiry } from '../utils/token.js';

const config = new pulumi.Config('github');
const token = config.requireSecret('token');
const tapToken = config.requireSecret('tap-token');

const tokenExpiresAt = config.require('token-expires-at');
const tapTokenExpiresAt = config.require('tap-token-expires-at');

checkExpiry(tokenExpiresAt, 'token');
checkExpiry(tapTokenExpiresAt, 'tap-token');

export const localGithubToken = token;

// Repositories that want `TAP_GITHUB_TOKEN`
const tapRepos = config.getObject<string[]>('tap-repos') || [];
tapRepos.map(r => {
  const [org, repository] = r.split('/');
  invariant(repository && org, 'repos must be owner/repo');
  return new github.ActionsSecret(
    `tap-${org}-${repository}`,
    {
      secretName: 'TAP_GITHUB_TOKEN',
      plaintextValue: tapToken,
      repository,
    },
    { provider: getGithubProvider(org) },
  );
});

// Repositories that want `PERSONAL_GITHUB_TOKEN`
const patRepos = config.getObject<string[]>('repos') || [];
patRepos.map(r => {
  const [org, repository] = r.split('/');
  invariant(repository && org, 'repos must be owner/repo');
  return new github.ActionsSecret(
    `pat-${org}-${repository}`,
    {
      secretName: 'PERSONAL_GITHUB_TOKEN',
      plaintextValue: token,
      repository,
    },
    { provider: getGithubProvider(org) },
  );
});
