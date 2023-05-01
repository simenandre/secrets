import * as github from '@pulumi/github';
import { getToken } from 'get-pulumi-secret';
export const providers = new Map();

export const token = getToken({
  name: 'token',
  namespace: 'github',
});

export const tapToken = getToken({
  name: 'tap-token',
  namespace: 'github',
});

export function getGithubProvider(org: string) {
  if (!providers.has(org)) {
    providers.set(
      org,
      new github.Provider(org, {
        owner: org,
        token,
      }),
    );
  }

  return providers.get(org);
}
