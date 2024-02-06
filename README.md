<!--
@since 2023.11.12, 00:38
@changed 2023.12.17, 01:10
-->

# sankey-graph-app

Sankey graph viewer and editor application.

- Version: 0.0.25
- Last changes timestamp: 2024.02.05, 20:14 GMT+7

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
python start-app.py --demo-files-data-set-folder sweet-corn
```

It will load sample data from the folder `data/sweet-corn/` (but shared `nodes.json` will be loaded from `data/` folder).

You can use any other prepared folder inside the `data` folder or use your own files.

Also you can modify the script and pass your own data into the `writeTempAppData(appData, targetFileNames)` call.

Here `appData` and `targetFileNames` have `AppData` and `TargetFileNames` types respectively (both contain keys: 'edges', 'flows', 'graphs', 'nodes').

In dev mode (when python file is locatied in the project root) -- use `--dev` key:

```
python start-app.py --dev --demo-files-data-set-folder sweet-corn
```

In this case data will be taken and written from/to respective subfolders in `public/` folder.

Available script command line options could be obtained with `--help` parameter:

```
$python start-app.py --help

Launch app from python script demo.

Options

  --web-port, -p                   Web server port (default: "8080")
  --demo-post                      Make demo POST request
  --demo-files                     Open the app with links to demo files
  --demo-files-data-folder         Data folder name (default: "data")
  --demo-files-data-set-folder     Data set folder name (default: "hardwood-
                                   forestry")
  --files-target-folder       Target folder name (default: "temp")
  --files-omit-date-tag       Omit date tag postfix for auto-generated
                                   target folder name (datetime module
                                   required)
  --dev, -d                        Use "public" folder prefix for demo data
                                   files and "build" for local web server (for
                                   non-built dev environment)
```

## Run application with nodejs server

It's possible to run the app with nodejs server (it doesn't have freezes)

```
node start-app.py --demo-files-data-set-folder sweet-corn
```
