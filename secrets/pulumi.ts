import * as pulumi from '@pulumi/pulumi';
import * as github from '@pulumi/github';
import { getGithubProvider } from './github-providers.js';
import { invariant } from 'ts-invariant';
import { getToken } from 'get-pulumi-secret';

const config = new pulumi.Config('pulumi');
const token = getToken({
  name: 'token',
  namespace: 'pulumi',
});

// Repositories with `PULUMI_ACCESS_TOKEN`
const repos = config.getObject<string[]>('repos') || [];
repos.map(r => {
  const [org, repository] = r.split('/');
  invariant(repository && org, 'repos must be owner/repo');
  return new github.ActionsSecret(
    `pulumi-${org}-${repository}`,
    {
      secretName: 'PULUMI_ACCESS_TOKEN',
      plaintextValue: token,
      repository,
    },
    { provider: getGithubProvider(org), deleteBeforeReplace: true },
  );
});
