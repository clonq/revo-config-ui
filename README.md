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
    title: SETTINGS
    components:
    -
      name: webbridge
      label: Web Bridge
      template:
		INCOMING:
          Path: 
          Method: GET POST
        OUTGOING:
          URL:
          Method: GET POST

```

Keys with empty values generate `<input>` tags. Keys with more than one value generate `<select>` tags.