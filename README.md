<!--
@since 2023.11.12, 00:38
@changed 2023.11.12, 01:45
-->


# sankey-graph-app

Sankey graph viewer and editor application.

- Version: 0.0.1
- Last changes timestamp: 2023.11.12, 01:41 GMT+7

TODO: Add project description.


## See also

- [CHANGELOG.md](CHANGELOG.md)
- [TODO.md](TODO.md)


## Client & server

Repository: https://github.com/lilliputten/sankey-graph-app

Deploy server (with recent build): http://sankey-graph-app.lilliputten.ru/


## Install

Install all required node dependencies:

```
npm i
```


## Start dev server

Start dev server (locate in browser with `http://localhost:3000`):

```
npm run start
```


## Make build

```
npm run build
```


## Build and publish

For success publishing the deploy environment should be propeply set up (see
npm script command `postinstall-publish-submodule`).

```
npm run build-and-publish
```

To just publish previously created build:

```
npm run publish
```

Builds published into the `release/publish` branch. See utilities configuration in `utils/config.sh`.
