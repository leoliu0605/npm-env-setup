#!/bin/bash

# Reset Launchpad
# //////////////////////////////////////////////////
defaults write com.apple.dock ResetLaunchPad -bool true
killall Dock

# Display full path in Finder title bar
# //////////////////////////////////////////////////
defaults write com.apple.finder _FXShowPosixPathInTitle -bool true

# Show path bar in Finder
# //////////////////////////////////////////////////
defaults write com.apple.finder ShowPathbar -bool true
