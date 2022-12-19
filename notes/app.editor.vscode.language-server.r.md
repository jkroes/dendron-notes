---
id: fszkibfnrst9rxx76zm46fk
title: R
desc: ''
updated: 1670366632185
created: 1670366197408
---


https://github.com/REditorSupport/languageserver

https://github.com/REditorSupport/vscode-R/wiki

# Styling (tidyverse)

https://schiff.co.nz/blog/more-vscode-tweaks/

https://github.com/r-lib/styler

The [tidyverse style guide](https://style.tidyverse.org/) has some surprising behavior that you can observe using the default settings for the R languageserver within vscode. For long lines, [function definitions](https://style.tidyverse.org/functions.html#long-lines-1) will align arguments with the first character after the opening paren, while [function calls](https://style.tidyverse.org/syntax.html#long-lines) will move all arguments to lines with a single indentation from the LHS.

