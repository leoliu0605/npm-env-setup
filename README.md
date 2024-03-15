# One Line Command to Setup Your New Computer

This project offers a streamlined solution for setting up a brand new computer using just a command line interface (CLI). With an interactive CLI approach, it automates the installation and configuration of your computer, allowing you to customize the software and settings you need swiftly and efficiently. This tool is designed to get you up and running on your new machine without the hassle, covering everything from essential software installations to environment setups.

## Usage

Here’s how you can use this tool to set up your computer quickly and easily. Simply follow the instructions for your computer's operating system. No need to worry about the technical terms like "x86" or "arm64"; we've got you covered with straightforward instructions for every type of computer.

### Windows

Open `powershell` and run the following command. This will start setting up your computer with all the essential software and configurations:

<!-- WINDOWS_LINK_X64_START -->
```shell
powershell.exe -Command "Invoke-WebRequest -Uri https://github.com/DinosauriaLab/npm-env-setup/releases/download/latest/env-setup-win-x64.exe -OutFile "env-setup-win-x64.exe"; Start-Process "env-setup-win-x64.exe" -Wait; Remove-Item "env-setup-win-x64.exe" -Force"
```
<!-- WINDOWS_LINK_X64_END -->

### MacOS

For Mac users, the process is just as simple. Depending on the type of chip your Mac has, follow the instructions below:

- If you have an older Mac model (typically before 2020):

<!-- MACOS_LINK_X64_START -->
```shell
curl -LO "https://github.com/DinosauriaLab/npm-env-setup/releases/download/latest/env-setup-macos-x64" && chmod +x env-setup-macos-x64 && ./env-setup-macos-x64 && rm -f env-setup-macos-x64
```
<!-- MACOS_LINK_X64_END -->

- If you have a newer Mac model with Apple's own chip (like the M1 or M2, found in Macs from late 2020 onwards):

<!-- MACOS_LINK_ARM64_START -->
```shell
curl -LO "https://github.com/DinosauriaLab/npm-env-setup/releases/download/latest/env-setup-macos-arm64" && chmod +x env-setup-macos-arm64 && ./env-setup-macos-arm64 && rm -f env-setup-macos-arm64
```
<!-- MACOS_LINK_ARM64_END -->

### Linux (Ubuntu 18.04 LTS and later)

For Linux users running Ubuntu 18.04 LTS or newer versions, execute the following command in your terminal. This will prepare your system with the necessary software for a smooth start:

<!-- LINUX_LINK_X64_START -->
```shell
curl -LO "https://github.com/DinosauriaLab/npm-env-setup/releases/download/latest/env-setup-linux-x64" && chmod +x env-setup-linux-x64 && ./env-setup-linux-x64 && rm -f env-setup-linux-x64
```
<!-- LINUX_LINK_X64_END -->

## Features

This setup tool uses friendly software installers like [Chocolatey](https://community.chocolatey.org/) for Windows, [Homebrew](https://brew.sh/) for MacOS, and `apt` for Linux systems to get your software up and running. For MacOS and Linux users, an added benefit is the integration of [asdf](https://asdf-vm.com/) as a version manager for programming languages like [Node.js](https://nodejs.org/) and [Python](https://www.python.org/). This means you can easily manage and switch between different versions of these languages, ensuring compatibility and flexibility across various projects.

Additionally, it sets up some useful programming tools and utilities, ensuring that you’re ready to tackle any project right from the start.

### Windows Software List

<!-- WINDOWS_LISTS_START -->

<!-- WINDOWS_LISTS_END -->

### MacOS Software List

<!-- MACOS_LISTS_START -->

<!-- MACOS_LISTS_END -->

### Linux Software List

<!-- LINUX_LISTS_START -->

<!-- LINUX_LISTS_END -->

This approach demystifies the setup process, making it more accessible to general users. It ensures that anyone, regardless of their technical skill level, can easily set up their new computer with everything they need to get started. The emphasis on a user-friendly, interactive CLI experience ensures that users can personalize their setup process to match their specific needs, all through a single command line.
