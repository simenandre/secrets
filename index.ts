import * as pulumi from '@pulumi/pulumi';
import * as github from '@pulumi/github';
import { repositories } from './repositories';

const config = new pulumi.Config();
const providers = new Map();

repositories.map(repo => {
  const [org] = repo.split('/');
  if (!providers.has(org)) {
    providers.set(
      org,
      new github.Provider(org, {
        organization: org,
      }),
    );
  }
});

repositories.map(r => {
  const [org, repository] = r.split('/');
  return new github.ActionsSecret(repository, {
    secretName: 'NPM_TOKEN',
    plaintextValue: config.requireSecret('npm-token'),
    repository,
  }, { provider: providers.get(org) });
});
