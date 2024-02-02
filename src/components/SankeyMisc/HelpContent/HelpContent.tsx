import React from 'react';
import { observer } from 'mobx-react-lite';
import { Box } from '@mui/material';
import classNames from 'classnames';
import Markdown from 'react-markdown';
// import rehypeRaw from 'rehype-raw';

import { TPropsWithClassName } from 'src/core/types';
import { dataUrlPrefix, defaultDataFiles } from 'src/core/constants/Sankey';
import { useSankeyAppSessionStore } from 'src/components/SankeyApp/SankeyAppSessionStore';

import styles from './HelpContent.module.scss';

type THelpContentProps = TPropsWithClassName;

function useHelpContent() {
  const sankeyAppSessionStore = useSankeyAppSessionStore();
  const {
    // prettier-ignore
    autoLoadUrlEdges,
    autoLoadUrlFlows,
    autoLoadUrlGraphs,
    autoLoadUrlNodes,
  } = sankeyAppSessionStore;
  // TODO: To memoize help content?
  return `


## Main navigation menu

![Application navigation menu](/images/help/topAppMenu.png "Application navigation menu")

At the top of the application window (or inside the hamburger button controlled side bar menu) is the main application menu with the following buttons:

- **Load data**: go to data loading page.
- **Help**: show this help reference.


## Data loading step

The first thing the application needs are the data files. They can be uploaded manually from your local device or downloaded in a semi- or fully-automatically way from the server (even if it's hosted by an automation script, like \`start-app.py\` script does).

Current default data file names:

- Edges: **${defaultDataFiles.edges}** ('*${autoLoadUrlEdges}*')
- Flows: **${defaultDataFiles.flows}** ('*${autoLoadUrlFlows}*')
- Graphs: **${defaultDataFiles.graphs}** ('*${autoLoadUrlGraphs}*')
- Nodes: **${defaultDataFiles.nodes}** ('*${autoLoadUrlNodes}*')

**Load default datasets** button loads demo data files (as in default data files,
stored in project folder "public${dataUrlPrefix}", hosted as built app folder
"${dataUrlPrefix}") from the project for the empty data slots.

![Data load slots](/images/help/dataLoadSlots.png "Data load slots")

If you opened the app in the "automation" mode (eg, from the python script, see the "Launching the application with python script" section), the data will be loaded automatically (if the parameter \`doAutoLoad\` has passed).

When the data has already been loaded, the statistics for the uploaded datasets are displayed, and the "Visualize" button becomes available: now you can go to the visualization of the graph.

![Successfully loaded data](/images/help/dataLoadedSuccessfully.png "Successfully loaded data")

By clicking on the "Visualize" button the application will open the main chart visualizing screen.


## Basic chart screen and side panels

![Main apllication window](/images/help/mainWindowQuarter.png "Main apllication window")

The main application windows consists of three areas: the generic settings panel is at the left, the currently selected node properties panel is at the right, and the chart area is at the center. At the top of the window there's a main panel with a navigation menu for the application.

![Top center part of the chart visualization area](/images/help/topChartPanel.png "Top center part of the chart visualization area")

The chart control buttons are located in the upper central part of the chart area.

There are two controls:

- Photo camera icon: Save current chart as a png image.
- Home icon: reset the state of the chart (all the nodes will return in their default positions).

There are two buttons on the sides to show and hide sidebars.

- The left panel is for application settings (see section "Settings panel" below).
- The right panel is for currently selected node properties (see section "Properties panel" below).


## Settings panel

The settings panel situated at the left side of the application window.

It contains main application settings and actions.

![Settings: theme](/images/help/settingsTheme.png "Settings: theme")

The user can choose a theme for the application.

![Settings: layout](/images/help/settingsLayout.png "Settings: layout")

Sankey diagrams can be shown in horizontal and vertical modes.

![Settings: restore hidden nodes](/images/help/settingsRestoreHiddenNodes.png "Settings: restore hidden nodes")

If the user had hiddensome nodes nodes manually they can restore them back here.

![Settings: auto hide nodes](/images/help/settingsAutoHideNodes.png "Settings: auto hide nodes")

Automatic node hidding controls block.

![Settings: color mode](/images/help/settingsColorMode.png "Settings: color mode")

Color mode for the chart. Available options:

- **"Random"**: To select a node color from a predefined list by node ID.
- **"Single"**: Use only one color for all the nodes.
- **"Progressive"**: Color the nodes gradientually depending on the node position (depth) in the graph.


## Properties panel

The properties panel in the right side of the window contains current (selected) node properties. User can change node's name, coloor and to hide it from the chart (it's possible to restore it later by "Restore nodes" button in the settings panel).

![Properties panel](/images/help/propertiesPanel.png "Properties panel")

Node color selection:

![Node color selection](/images/help/colorSelectionInAction.png "Node color selection")


## Chart area

![Sankey graph](/images/help/chartArea.png "Sankey graph")

The main chart area displays the visualized data in the form of a Sankey graph, with edges and nodes.

By hovering the node or edge the user can see a popup with a detailed information.

![Edge hovering](/images/help/edgeHovering.png "Edge hovering")

![Node hovering](/images/help/nodeHovering.png "Node hovering")

By clicking on a node, the user can open the properties panel, where they can edit the node data or hide it from the chart (see the section "Properties panel").


## Url query parameters

The application accepts all the user-controlled settings from the url query.

- **showLeftPanel** (*boolean*) -- Show left panel by default.
- **themeMode** (*string*, valid values: 'dark', 'light') -- Application color theme.
- **verticalLayout** (*boolean*) -- Use vertical chart layout.
- **nodesColorMode** (*string*, valid values: 'random', 'single', 'progressive') -- Chart nodes visualization color mode.
- **baseNodesColor** (*string*) -- The first chart nodes color.
- **secondNodesColor** (*string*) -- The second chart nodes color.
- **autoHideNodes** (*boolean*) -- Auto hide nodes, using following parameteres.
- **autoHideNodesThreshold** (*number*, %) -- Auto hide nodes threshold value (percents, include children with values more than this treshold).
- **autoHideNodesMaxOutputs** (*number*) -- Show the number of descendants no more than this value.
- **doAutoLoad** (*boolean*) -- Start automatic loading of the default data set (see specific data file options below).
- **doAutoStart** (*boolean*) -- Don't wait for user action when data has already loaded (immediately go to the main app).
- **autoLoadUrlEdges** (*string*) -- Default file url for 'edges.json' data.
- **autoLoadUrlFlows** (*string*) -- Default file url for 'flows.json' data.
- **autoLoadUrlGraphs** (*string*) -- Default file url for 'graphs.json' ('nodes-supply-chain.json') data.
- **autoLoadUrlNodes** (*string*) -- Default file url for 'nodes.json' data.

For example, to start the application in a dark mode, it's possible to use:

\`\`\`
{appUrl}?themeMode=dark
\`\`\`

Or, to preload demo data from the 'lignite' data set:

\`\`\`
{appUrl}?doAutoLoad=yes
&autoLoadUrlEdges=/data/lignite/edges.json
&autoLoadUrlFlows=/data/lignite/flows.json
&autoLoadUrlGraphs=/data/lignite/nodes-supply-chain.json
&autoLoadUrlNodes=/data/nodes.json
\`\`\`


## Launching the application with python script

You can start the application from the command line with your own data using python script (since v.0.0.20).

To do it, download recent build (eg, for v.0.0.20) <a href="https://github.com/lilliputten/sankey-graph-app/releases/tag/publish.0.0.20" target="_blank">from build page</a>.

Or via <a href="https://github.com/lilliputten/sankey-graph-app/archive/refs/tags/publish.0.0.20.zip" target="_blank">direct zip archive link</a>.

Then unpack it, go to the unpacked build folder and start the script with command:

\`\`\`
python start-app.py --data-set-folder sweet-corn
\`\`\`

It will load sample data from the folder \`data/sweet-corn/\` (but shared \`nodes.json\` will be loaded from \`data/\` folder).

You can use any other prepared folder inside the \`data\` folder or use your own files.

Also you can modify the script and pass your own data into the \`writeTempAppData(appData, targetFileNames)\` call.

Here \`appData\` and \`targetFileNames\` have \`AppData\` and \`TargetFileNames\` types respectively (both contain keys: 'edges', 'flows', 'graphs', 'nodes').

In dev mode (when python file is locatied in the project root) -- use \`--dev\` key:

\`\`\`
python start-app.py --dev --data-set-folder sweet-corn
\`\`\`

In this case data will be taken and written from/to respective subfolders in \`public/\` folder.

Available script command line options could be obtained with \`--help\` parameter:

\`\`\`
$python start-app.py --help
\`\`\`

**usage:** start-app.py [-h] [--web-port {webPort}] [--demo-post | --no-demo-post]
                    [--demo-files | --no-demo-files]
                    [--demo-files-data-folder {demoFilesDataFolder}]
                    [--demo-files-data-set-folder {demoFilesDataSetFolder}]
                    [--demo-files-target-folder {demoFilesTargetFolder}]
                    [--demo-files-omit-date-tag | --no-demo-files-omit-date-tag]
                    [--dev | --no-dev]

Launch web server for the app.

**options:**

**-h, --help**
show this help message and exit

**--web-port {webPort}**
Web server port (default: "8080")

**--demo-post, --no-demo-post**
Make demo POST request

**--demo-files, --no-demo-files**
Open the app with links to demo files

**--demo-files-data-folder {demoFilesDataFolder}**
Data folder name (default: "data")

**--demo-files-data-set-folder {demoFilesDataSetFolder}**
Data set folder name (default: "hardwood-forestry")

**--demo-files-target-folder {demoFilesTargetFolder}**
Target folder name (default: "temp")

**--demo-files-omit-date-tag, --no-demo-files-omit-date-tag**
Omit date tag postfix for auto-generated target folder name (datetime
module required)

**--dev, --no-dev**
Use "public" folder prefix for demo data files and "build" for local web
server (for non-built dev environment)

`;
}

export const HelpContent: React.FC<THelpContentProps> = observer((props) => {
  const { className } = props;
  const content = useHelpContent();
  return (
    <Box
      className={classNames(className, styles.root)}
      maxWidth="md" // NOTE: This modifier has specified in wrapping `HelpModal`
    >
      <Markdown
        // prettier-ignore
        // rehypePlugins={[rehypeRaw]} // Use it to process html tags in the markdown. It can couse a lot of "source not found" errors, of source maps has enabled.
        className={classNames(styles.content)}
      >
        {content}
      </Markdown>
    </Box>
  );
});
