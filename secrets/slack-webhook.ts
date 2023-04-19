import * as pulumi from '@pulumi/pulumi';
import * as github from '@pulumi/github';
import { getGithubProvider } from './github-providers.js';
import { invariant } from 'ts-invariant';

const config = new pulumi.Config('slack');
const webhookUrl = config.requireSecret('webhook-url');

// Repositories with `SLACK_WEBHOOK_URL`
const repos = config.getObject<string[]>('repos') || [];
repos.map(r => {
  const [org, repository] = r.split('/');
  invariant(repository && org, 'repos must be owner/repo');
  return new github.ActionsSecret(
    `slack-webhook-${org}-${repository}`,
    {
      secretName: 'SLACK_WEBHOOK_URL',
      plaintextValue: webhookUrl,
      repository,
    },
    { provider: getGithubProvider(org) },
  );
});
