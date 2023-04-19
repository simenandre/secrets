import { updateToken } from './utils.js';

await updateToken({
  configName: 'github:token',
  tokenName: 'token',
  type: 'github-classic',
});
