import * as pulumi from '@pulumi/pulumi';
import * as github from '@pulumi/github';
import { getGithubProvider } from './github-providers';

const config = new pulumi.Config('npm');
const token = config.requireSecret('token');
const repositories = config.requireObject<string[]>('repos');

export const localNpmToken = token;

repositories.map(r => {
  const [org, repository] = r.split('/');
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
