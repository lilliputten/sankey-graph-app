# Project patches

## Patching CRA modules:

- Disable console log cleanings (`react-dev-utils`, `react-scripts`).
- Remove extra deprecation warnings (`webpack-dev-server`).

## To apply all the patches:

Run npm script:

```
npm run patch-node-packages
```

or call it directly:

```
npx patch-package
```

## See:

- [patch-package](https://www.npmjs.com/package/patch-package)
