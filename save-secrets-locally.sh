#!/bin/sh

mkdir -p $HOME/.secrets

# Store Github Token
pulumi stack --show-secrets output githubToken > $HOME/.secrets/github-token

# Store NPM Token
pulumi stack --show-secrets output npmToken > $HOME/.secrets/npm-token