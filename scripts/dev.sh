#!/usr/bin/env bash

set -e # exit when error

# & wait added so that if any of the command fails
# you can still CTRL+C the whole thing (no phantom process)
npm run webpack-watch & npm run browser-sync & wait
