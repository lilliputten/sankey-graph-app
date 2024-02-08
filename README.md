<!--
@since 2024.02.05, 20:21
@changed 2024.02.05, 20:21
-->

# sankey-graph-app-server

Dedicated sankey graph app server.

- Version: 0.0.27
- Last changes timestamp: 2024.02.08 17:49 +0700

TODO: Add server description.

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

## Server script verions

Server script implemented (as on 2024.02.05) in two variants:

- Python script (`start-app.py`), used embedded `http.server`. No dependencies required to install (`DateTime` only?).
- NodeJS script (`start-server.mjs`), uses embedded `http`. Required to install dependencies using `npm install` before start.

## Command line options

Available script command line options could be obtained with `--help` parameter, the're the same for both python and node versions:

```
$python start-app.py --help
$node start-server.mjs --help

usage: start-app.py [-h] [--data-folder {dataFolder}] [--data-set-folder {dataSetFolder}]
                    [--target-folder {targetFolder}] [--omit-date-tag | --no-omit-date-tag]
                    [--web-port {webPort}] [--dev | --no-dev]

Launch app from python script demo.

Options

  --web-port, -p                   Web server port (default: "8080")
  --demo-post                      Make demo POST request
  --demo-files                     Open the app with links to demo files
  --demo-files-data-folder         Data folder name (default: "data")
  --demo-files-data-set-folder     Data set folder name (default: "hardwood-
                                   forestry")
  --demo-files-target-folder       Target folder name (default: "temp")
  --demo-files-omit-date-tag       Omit date tag postfix for auto-generated
                                   target folder name (datetime module
                                   required)
  --dev, -d                        Use "public" folder prefix for demo data
                                   files and "build" for local web server (for
                                   non-built dev environment)
```
