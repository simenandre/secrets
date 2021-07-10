import * as pulumi from '@pulumi/pulumi';
import * as github from '@pulumi/github';
export const providers = new Map();

const config = new pulumi.Config('github');
const token = config.requireSecret('token');

export function getGithubProvider(org: string) {
  if (!providers.has(org)) {
    providers.set(
      org,
      new github.Provider(org, {
        organization: org,
        token,
      }),
    );
  }

  return providers.get(org);
}
