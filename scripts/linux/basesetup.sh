#!/bin/bash

sudo apt-get install -y software-properties-common apt-transport-https lsb-release
sudo apt-get update && sudo apt-get upgrade -y && sudo apt-get install -y curl jq git
