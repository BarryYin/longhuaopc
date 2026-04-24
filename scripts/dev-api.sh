#!/bin/bash
cd "$(dirname "$0")/../apps/api"
PORT=3009 npx nest start --watch
