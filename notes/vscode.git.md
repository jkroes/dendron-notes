---
id: ux0rise0p1fe2qh7pxv9ee3
title: Git
desc: ''
updated: 1670539905847
created: 1670538108652
---


# Windows and WSL

1. Install a portable version of git for windows.
2. Search for "environment" on Windows 10 and select "Edit environment variables for your account."
3. Select Path.
4. Add D:\Programs\PortableGit\bin and D:\Programs\PortableGit\cmd, replacing D:\Programs with wherever your installation is. 
   1. Unclear whether one or both is required. Both works.
5. Restart PowerShell and test that `git` is now a recognized command.
6. Run `git config --global credential.helper manager-core`.
7. Try a `git clone` with an HTTPS repo and enter your credentials into the fancy popup window. 
   1. Not totally sure this is even necessary for vscode, but it seems to prevent reauthorization requests for git in PowerShell.
   2. See https://learn.microsoft.com/en-us/windows/wsl/tutorials/wsl-git for configuring WSL and git:

`git config --global credential.helper "/mnt/d/Programs/PortableGit/mingw64/bin/git-credential-manager-core.exe"`

# MacOS

Use gh cli instead of gcm. See https://docs.github.com/en/get-started/getting-started-with-git/caching-your-github-credentials-in-git
