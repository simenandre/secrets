import { updateToken } from './utils.js';

await updateToken({
  configName: 'github:tap-token',
  tokenName: 'tap-token',
  type: 'github-fine-grained',
});
