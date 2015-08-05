REVO-CONFIG-UI
===

Simple config UI for [revo](https://github.com/clonq/revo)

Example
===

Generate simple config screens by defining a template for your config items:

```
# revo recipe
config:
  clonq/revo-config-ui:
    template:
      Webhook:
        URL:
        METHOD: GET POST
        DESCRIPTION:

```

Keys with empty values generate `<input>` tags. Keys with more than one value generate `<select>` tags.