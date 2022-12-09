---
tags:
- programming/js/template
---

> [!note]- Syntax highlighting 
> Obsidian relies on primsjs for syntax highlighting. prismjs supports jinja2, a Python templating engine from which nunjucks was ported to JS.


# Variables

Variables can access properties via dot or square-bracket syntax.

```jinja2
{{ foo }}
{{ foo.bar }}
{{ foo["bar"] }}
```

# Filters

Apply functions to variables using filters, which are called with a pipe operator and may take arguments.

```jinja2
{{ foo | replace("foo", "bar") | capitalize }}
```

Filters can also be applied to blocks (see [[language.prog.js.template.nunjucks#^f31787]])
# Inerhitance

Parent template files  can define named blocks using the `block` tag:

```jinja2
{% block header %}
This is the default content
{% endblock %}

<section class="left">
  {% block left %}{% endblock %}
</section>

<section class="right">
  {% block right %}
  This is more content
  {% endblock %}
</section>
```

Child templates that extend the parent template can then populate or override the content of those blocks:

```jinja2
{% extends "parent.html" %}

{% block left %}
This is the left side!
{% endblock %}

{% block right %}
This is the right side!
{% endblock %}
```

This renders as:

```html
This is the default content

<section class="left">
  This is the left side!
</section>

<section class="right">
  This is the right side!
</section>
```

You can include parent content alongside child content, instead of overriding parent content, by calling `super`. This example modifies the final block from the previous example:

```jinja2
{% block right %}
{{ super() }}
Right side!
{% endblock %}
```

which renders as:

```text
This is more content
Right side!
```

# Tags

Tags are blocks that operate on sections of the template. Where variables are surrounded by dual curly brackets, tags are surrounded by `{%` and `%}`. 

## if

```jinja2
{% if hungry %}
  I am hungry
{% elif tired %}
  I am tired
{% else %}
  I am good!
{% endif %}
```

`and` and `or` allow you to specify multiple conditions.

## for

Here `for` iterates over a dictionary:
 
```js
var items = [{ title: "foo", id: 1 }, { title: "bar", id: 2}];
```

The `else` clause does not trigger here unless the dictionary is empty.

```jinja2
<h1>Posts</h1>
<ul>
{% for item in items %}
  <li>{{ item.title }}</li>
{% else %}
  <li>This would display if the 'items' collection were empty</li>
{% endfor %}
</ul>
```

Here `for` iterates over a JS object:

```js
var food = {
  'ketchup': '5 tbsp',
  'mustard': '1 tbsp',
  'pickle': '0 tbsp'
};
```

```jinja2
{% for ingredient, amount in food %}
  Use {{ amount }} of {{ ingredient }}
{% endfor %}
```

Here `for` iterates over arrays:

```js
var points = [[0, 1, 2], [5, 6, 7], [12, 13, 14]];
```

```jinja2
{% for x, y, z in points %}
  Point: {{ x }}, {{ y }}, {{ z }}
{% endfor %}
```

JS iterators like `Map` are also supported.

The following special variables are available inside loops. 

- `loop.index`: the current iteration of the loop (1-indexed)
- `loop.index0`
- `loop.revindex`: number of iterations until the end (1-indexed)
- `loop.revindex0` 
- `loop.first`: boolean indicating the first iteration
- `loop.last`
- `loop.length`: total number of items

## macro

If you define the following macro `field`:

```jinja2
{% macro field(name, value='', type='text') %}
<div class="field">
  <input type="{{ type }}" name="{{ name }}"
         value="{{ value | escape }}" />
</div>
{% endmacro %}
```

you can then call `field` like a function:

```jinja2
{{ field('user') }}
{{ field('pass', type='password') }}
```

See also [[language.prog.js.template.nunjucks#^f0a6bb]]
## set

Create and/or modify (multiple) variable(s).

```jinja2
{% set name, first_name = "joe" %}
```

If `set` is used at the top-level, it changes the value of the global template context. If used inside scoped blocks like an include or a macro, it only modifies the current scope.

It is also possible to capture the contents of a block into a variable using block assignments. The syntax is similar to the standard `set`, except that the `=` is omitted, and everything until the `{% endset %}` is captured. This serves as an alternative to a (zero-argument?) `macro`.

## filter

^f31787

A `filter` block allows you to call a filter with the contents of the block. Instead passing a value with the `|` syntax, the render contents from the block will be passed.

```jinja2
{% filter replace("force", "forth") %}
may the force be with you
{% endfilter %}
```

## call

^f0a6bb

A `call` block enables you to call a macro with all the text inside the tag. This is helpful if you want to pass a lot of content into a macro. The content is available inside the macro as `caller()`.

```jinja2
{% macro add(x, y) %}
{{ caller() }}: {{ x + y }}
{% endmacro%}

{% call add(1, 2) -%}
The result is
{%- endcall %}
```

This renders as "The result is: 3"

# Keyword arguments

Macro definitions and invocations use Python-style keyword arguments. This also means that for macro definitions, keyword arguments serve as default arguments, just like Python function definitions. 

# Comments

Use `{%` and `%}`.

# Whitespace

Whitespace is confusing. See[this explanation](https://ttl255.com/jinja2-tutorial-part-3-whitespace-control/#:~:text=Jinja2%20allows%20us%20to%20manually,or%20after%20the%20block%2C%20respectively.) Unfortunately it's recommended solution for setting `trim_blocks` and `lstrip_blocks` doesn't work unless you can modify and recompile the plugin's source code. In the meantime, you can add a `-` to the start or end block or a variable. The following template outputs "12345", as if you had put everything on a single line.

```jinja2
{% for i in [1,2,3,4,5] -%}
  {{ i }}
{%- endfor %}
```


# References

https://mozilla.github.io/nunjucks/templating.html

Nunjucks defers to [jinja docs](https://jinja.palletsprojects.com/en/3.1.x/templates/#) for any templating details it does not provide.
