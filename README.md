<!--
@since 2023.11.12, 00:38
@changed 2023.11.12, 01:50
-->

# sankey-graph-app

Sankey graph viewer and editor application.

- Version: 0.0.20
- Last changes timestamp: 2023.12.16, 21:45 GMT+7

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

## Run application under python script

In dev mode (when python file is locatied in the project root) -- use `--dev` key:

```
python start-app.py --dev --data-set-folder sweet-corn
```

Data will be taken and written from/to source subfolders in `public/` folder.

For already built/published project use it without that option:

```
python start-app.py --data-set-folder sweet-corn
```

Available options' references could be obtained with `--help` parameter:

```
$python start-app.py --help

usage: start-app.py [-h] [--data-folder {dataFolder}] [--data-set-folder {dataSetFolder}]
                    [--target-folder {targetFolder}] [--omit-date-tag | --no-omit-date-tag]
                    [--web-port {webPort}] [--dev | --no-dev]

Launch app from python script demo.

options:
  -h, --help            show this help message and exit
  --data-folder {dataFolder}
                        Data folder name (default: "data")
  --data-set-folder {dataSetFolder}
                        Data set folder name (default: "hardwood-forestry")
  --target-folder {targetFolder}
                        Target folder name (default: "temp")
  --omit-date-tag, --no-omit-date-tag
                        Omit date tag postfix for auto-generated target folder name (datetime module required)
  --web-port {webPort}  Web server port (default: "8080")
  --dev, --no-dev       Use "public" folder prefix for demo data files and "build" for local web
                        server (for non-built dev environment)
```
