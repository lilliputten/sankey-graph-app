<!--
@since 2023.11.12, 00:38
@changed 2023.11.12, 01:50
-->

# sankey-graph-app

Sankey graph viewer and editor application.

- Version: 0.0.6
- Last changes timestamp: 2023.11.24, 21:47 GMT+7

TODO: Add project description.

## See also

- [CHANGELOG](CHANGELOG.md)
- [TODO](TODO.md)

## Resources

Repository: https://github.com/lilliputten/sankey-graph-app

Deploy server (with recent build): http://sankey-graph-app.lilliputten.ru/

## Project workflow

Install all required node dependencies:

```
npm i
```

Start dev server (locate in browser with `http://localhost:3000`):

```
npm run start
```

Make build:

```
npm run build
```

Build and publish:

For successful publishing the build application the environment should be
propeply set up (see npm script command `postinstall-publish-submodule`).

```
npm run build-and-publish
```

To just publish previously created build:

```
npm run publish
```

Builds published into the `publish` branch. See utilities configuration in
`utils/config.sh`.
