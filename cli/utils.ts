import { automation } from '@pulumi/pulumi';
import dedent from 'dedent';
import { addDays } from 'date-fns';
import { execa } from 'execa';
import { createInterface } from 'readline';

export interface UpdateTokenArgs {
  configName: string;
  tokenName: string;
  type: 'github-fine-grained' | 'github-classic' | 'npm';
}

export async function updateToken(args: UpdateTokenArgs) {
  const { configName, tokenName, type } = args;
  const readline = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log(
    dedent`


    Hello 👋

    Time to update your token!

    The browser will open to GitHub, where you can generate a new token.
    Remember to choose 90 days expiration time. We will assume that you
    do, so the system will not ask you again for a while.
    
  `,
  );

  const stack = await automation.LocalWorkspace.selectStack({
    stackName: 'prod',
    workDir: './',
  });

  if (type === 'npm') {
    await execa('open', [
      `https://www.npmjs.com/settings/simenandre/tokens/`,
    ]);
  } else {
    const tokenId = await stack.getConfig(`${configName}-id`);

    if (tokenId.value) {
      if (type === 'github-fine-grained') {
        await execa('open', [
          `https://github.com/settings/personal-access-tokens/${tokenId.value}`,
        ]);
      } else if (type === 'github-classic') {
        await execa('open', [
          `https://github.com/settings/tokens/${tokenId.value}`,
        ]);
      }
    } else {
      await execa('open', ['https://github.com/settings/tokens?type=beta']);
    }
  }

  readline.question('Enter your token: ', async token => {
    readline.close();

    await stack.setConfig(configName, {
      secret: true,
      value: token,
    });

    await stack.setConfig(`${configName}-expires-at`, {
      secret: false,
      // We use 89 days to give one day of grace period
      value: addDays(new Date(), 89).toISOString(),
    });

    console.log(`Token ${tokenName} updated!`);
  });
}
