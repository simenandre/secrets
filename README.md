# Secrets

This repository controls the Pulumi code related to distributing @simenandre
personal access tokens. As a security measure, we should mainly use fine-grained
tokens.

## The classic token

The classic token is used by a [few repositories][classic-repos] that still
require a personal GitHub token.

[classic-repos]: ./Pulumi.prod.yaml

The classic token expires every 90 days. To renew the token, run this command:

```bash
yarn update-classic-token
```

## The _tap_ token

The _tap_ token is only used to push Homebrew formulae to the _tap_ repository.
It is not used for any other purpose. To restrict the token, a fine-grained
token is used.

Setting the _tap_ token expires every 90 days. To renew the token, run this
command:

```bash
yarn update-tap-token
```
