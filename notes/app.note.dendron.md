---
id: dswwkqtc1hdtrwyiffgslns
title: Dendron
desc: ''
updated: 1670624761168
created: 1670624761168
---
dendron is a VScode plugin that implements a PMK notetaking system. Like Obsidian it allows backlinks and tags, but "flexible" hierarchies are central to note organization in dendron.

Dendron omits folders in favor of a hierarchy expressed through period-separated filename components. The first component is referred to as the domain.

E.g. daily notes may be given their own domain and written in mmddyy format as daily.`mmddyy`.

Changing the name/path of a note automatically changes the names of its children as well as all links to these notes, so the hierarchies are easy to change on the fly. You can even [merge](https://wiki.dendron.so/notes/nxarb351z0kfbl5mkw3arw6/)two notes together without issue!

Child links at the bottom of the note (as displayed in the dendron previewer) link to child notes. E.g., language.python contains a child link with the description "class" which links to the child note language.python.class. 

[Schemas](https://wiki.dendron.so/notes/c5e5adde-5459-409b-b34d-a0d75cbb1052/) can be used as a type system for creating heirarchies. If a schema exists and matches the current note, it will be used to autosuggest the names of child notes. Templates can be attached to schemas, linking note type to content.

Dendron uses predefined schemas for tags, which have domain `tags`, are linked to by addings tags in the frontmatter, and can be reorganized using the same tools as for notes. It also predefines  users that can be linked to by prefixing a user name with `@`, tasks, scratch notes, meeting notes, etc.

Despite these attractive features, dendron has no same-pane/tab live preview like Obsidian (sometimes referred to as WYSIWYG), has deprecated some/many/most(?) extensions that were created for it and does not seem to have fleshed out [extension](https://wiki.dendron.so/notes/1myZIy650bq4h0NAOGchT/) documentation. Then again, maybe that section means something different. It does have a section for contributors: https://wiki.dendron.so/notes/81da87be-2d4e-47b5-a1d6-c0d647e1ab00/

[obsidian-structure](https://github.com/dobrovolsky/obsidain-structure attempts to port) attempts to port some of these features from dendron to obsidian.