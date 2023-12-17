<!--
@since 2023.11.12, 00:38
@changed 2023.12.17, 01:10
-->

# sankey-graph-app

Sankey graph viewer and editor application.

- Version: 0.0.22
- Last changes timestamp: 2023.12.18, 01:56 GMT+7

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

You can start the application from the command line with your own data using python script (since v.0.0.20).

To do it, download recent build (eg, for v.0.0.20) [from build page](https://github.com/lilliputten/sankey-graph-app/releases/tag/publish.0.0.20).

Or via [direct zip archive link](https://github.com/lilliputten/sankey-graph-app/archive/refs/tags/publish.0.0.20.zip).

Then unpack it, go to the build folder and start the script with command:

```
python start-app.py --data-set-folder sweet-corn
```

It will load sample data from the folder `data/sweet-corn/` (but shared `nodes.json` will be loaded from `data/` folder).

You can use any other prepared folder inside the `data` folder or use your own files.

Also you can modify the script and pass your own data into the `writeTempAppData(appData, targetFileNames)` call.

Here `appData` and `targetFileNames` have `AppData` and `TargetFileNames` types respectively (both contain keys: 'edges', 'flows', 'graphs', 'nodes').

In dev mode (when python file is locatied in the project root) -- use `--dev` key:

```
python start-app.py --dev --data-set-folder sweet-corn
```

In this case data will be taken and written from/to respective subfolders in `public/` folder.

Available script command line options could be obtained with `--help` parameter:

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
                        Omit date tag postfix for auto-generated target folder name (datetime
                        module required)
  --web-port {webPort}  Web server port (default: "8080")
  --dev, --no-dev       Use "public" folder prefix for demo data files and "build" for local web
                        server (for non-built dev environment)
```
