#!/bin/bash

echo "# Load version control information" >>~/.zshrc
echo "autoload -Uz vcs_info" >>~/.zshrc
echo "precmd() { vcs_info }" >>~/.zshrc
echo "" >>~/.zshrc
echo "# Format the vcs_info_msg_0_ variable" >>~/.zshrc
echo "zstyle ':vcs_info:git:*' formats ' %F{87}(%b)%f'" >>~/.zshrc
echo "" >>~/.zshrc
echo "# Set up the prompt (with git branch name)" >>~/.zshrc
echo "setopt PROMPT_SUBST" >>~/.zshrc
echo "PROMPT='[%F{82}%~%f]\${vcs_info_msg_0_} $ '" >>~/.zshrc
echo "" >>~/.zshrc
source ~/.zshrc
