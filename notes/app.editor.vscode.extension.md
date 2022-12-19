---
id: 6tvs7cw5o2c8bvhc5so4219
title: Extension
desc: ''
updated: 1670739364154
created: 1670383522879
---


- [overview](https://code.visualstudio.com/api)
  - [how to build extensions](https://code.visualstudio.com/api#how-to-build-extensions)
    - Explains the sections of the overview's sidebar.
    - [get started](https://code.visualstudio.com/api/get-started/your-first-extension)
      - Explains how to create (using a Yeoman generator), run, develop, and debug the "hello world" extension
    - [extension guides](https://code.visualstudio.com/api/extension-guides/overview)
      - Guided walkthroughs and code samples of various aspects of the API
    - [ux guidelines](https://code.visualstudio.com/api/ux-guidelines/overview)
      - Guided walkthroughs and code samples for integrating your extension with the UI
    - references
      - [API](https://code.visualstudio.com/api/references/vscode-api)
        - The right sidebar lists all of the namespaces (from "authentication" to "workspace"), followed by "API Patterns." Not listed here is the vast majority of the API that consists of classes(?). 
          - As you scroll, the current section is highlighted. For these classes this will be (incorrectly) "workspace."
      - contribution points
      - activation events
      - extension manifest (`package.json`)
      - built-in commands
        - Used with `vscode.commands.executeCommand`
      - when clause contexts
        - Used to create conditional keybindings but (guessing here) might be available for use in extension
  - [updates](https://code.visualstudio.com/updates/v1_74)
    - The left sidebar lists monthly updates. The right sidebar organizes each month into sections.
    - The "Extension authoring" section describes changes to the API.
- [code samples](https://github.com/microsoft/vscode-extension-samples)

Dendron's workspace sync feature is encountering issues because I have vscode installed on Windows but git installed on WSL, and possibly my SSH configuration is off because I'm not using git for Windows with the GCM. It works fine on MacOS. But either way I think the most reliable method will be to create a vscode extension to sync my dendron notes with git. Additionally, I would like it to be able to make REST requests to Obsidian to use Obsidian as the note previewer instead of Dendron's note previewer.



[Develop your first extension with this guide.](https://code.visualstudio.com/api/get-started/your-first-extension). 

- MacOS requires `sudo` to install global packages. 
- After running `yo code`, you may encounter an issue: `

![](/assets/images/2022-12-07-15-39-53.png)

The `@types/vscode` package version listed within the extension folder's package.json is unknown to npm. Sure enough, package.json lists 1.74.0 but `npm view @types/vscode` shows the latest known version is 1.73.1. Edit packages.json and manually run `cd ~/dendian; npm install`.  

Execute a command:
https://code.visualstudio.com/api/extension-guides/command#programmatically-executing-a-command

vscode APIs:
https://code.visualstudio.com/api/references/vscode-apij

In particular see createFileSystemWatcher

Not all APIs are documented. E.g., there is a [git api](https://github.com/microsoft/vscode/tree/main/extensions/git). A usere in this [post](https://stackoverflow.com/questions/59442180/vs-code-git-extension-api) notes that the git api is not well documented and that he instead used a simple-git node module when creating a vscode extension. [This](https://stackoverflow.com/questions/46511595/how-to-access-the-api-for-git-in-visual-studio-code) offered additional examples of the git api.