import React from 'react';
import { observer } from 'mobx-react-lite';
import { Box } from '@mui/material';
import classNames from 'classnames';
import * as go from 'gojs';

import { isDevBrowser } from 'src/config/build';
import { TAnyChartData } from 'src/core/types/anychart';
import { useSankeyAppDataStore } from 'src/components/SankeyApp/SankeyAppDataStore';
// @ts-ignore
// import AnyChart from 'anychart-react';

import styles from './SankeyGoJSDemo.module.scss';
import * as toasts from 'src/ui/Basic/Toasts';
import {
  constructEdgesData,
  constructGraphsHashGraphsData,
  constructNodesHashFromData,
} from 'src/helpers/anychart';
import { TChartDataSet, TFullChartDataSet } from 'src/core/types';
import { getErrorText } from 'src/helpers';
import { DiagramWrapper } from 'src/core/gojs';

/** DEBUG: Don't wait for user action */
const __debugUseDemoData = true && isDevBrowser;

const anychartDemoData: TAnyChartData = [
  { from: 'First Class', to: 'Child', value: 6 },
  { from: 'Second Class', to: 'Child', value: 24 },
  { from: 'Third Class', to: 'Child', value: 79 },
  { from: 'Crew', to: 'Child', value: 0 },
  { from: 'First Class', to: 'Adult', value: 319 },
  { from: 'Second Class', to: 'Adult', value: 261 },
  { from: 'Third Class', to: 'Adult', value: 627 },
  { from: 'Crew', to: 'Adult', value: 885 },
  { from: 'Child', to: 'Female', value: 45 },
  { from: 'Child', to: 'Male', value: 64 },
  { from: 'Adult', to: 'Female', value: 425 },
  { from: 'Adult', to: 'Male', value: 1667 },
  { from: 'Female', to: 'Survived', value: 344 },
  { from: 'Female', to: 'Perished', value: 126 },
  { from: 'Male', to: 'Survived', value: 367 },
  { from: 'Male', to: 'Perished', value: 1364 },
];

interface TGojsDemoData {
  nodeDataArray: Array<go.ObjectData>;
  linkDataArray?: Array<go.ObjectData>;
}
const gojsDemoData: TGojsDemoData = {
  nodeDataArray: [
    { key: 0, text: 'Alpha', color: 'lightblue', loc: '0 0' },
    { key: 1, text: 'Beta', color: 'orange', loc: '150 0' },
    { key: 2, text: 'Gamma', color: 'lightgreen', loc: '0 150' },
    { key: 3, text: 'Delta', color: 'pink', loc: '150 150' },
  ],
  linkDataArray: [
    { key: -1, from: 0, to: 1 },
    { key: -2, from: 0, to: 2 },
    { key: -3, from: 1, to: 1 },
    { key: -4, from: 2, to: 3 },
    { key: -5, from: 3, to: 0 },
  ],
};

function getGojsSampleData() {
  const nodeDataArray: Array<go.ObjectData> = [
    { key: 'Coal reserves', text: 'Coal reserves', color: '#9d75c2' },
    { key: 'Coal imports', text: 'Coal imports', color: '#9d75c2' },
    { key: 'Oil reserves', text: 'Oil\nreserves', color: '#9d75c2' },
    { key: 'Oil imports', text: 'Oil imports', color: '#9d75c2' },
    { key: 'Gas reserves', text: 'Gas reserves', color: '#a1e194' },
    { key: 'Gas imports', text: 'Gas imports', color: '#a1e194' },
    { key: 'UK land based bioenergy', text: 'UK land based bioenergy', color: '#f6bcd5' },
    { key: 'Marine algae', text: 'Marine algae', color: '#681313' },
    { key: "Agricultural 'waste'", text: "Agricultural 'waste'", color: '#3483ba' },
    { key: 'Other waste', text: 'Other waste', color: '#c9b7d8' },
    { key: 'Biomass imports', text: 'Biomass imports', color: '#fea19f' },
    { key: 'Biofuel imports', text: 'Biofuel imports', color: '#d93c3c' },
    { key: 'Coal', text: 'Coal', color: '#9d75c2' },
    { key: 'Oil', text: 'Oil', color: '#9d75c2' },
    { key: 'Natural gas', text: 'Natural\ngas', color: '#a6dce6' },
    { key: 'Solar', text: 'Solar', color: '#c9a59d' },
    { key: 'Solar PV', text: 'Solar PV', color: '#c9a59d' },
    { key: 'Bio-conversion', text: 'Bio-conversion', color: '#b5cbe9' },
    { key: 'Solid', text: 'Solid', color: '#40a840' },
    { key: 'Liquid', text: 'Liquid', color: '#fe8b25' },
    { key: 'Gas', text: 'Gas', color: '#a1e194' },
    { key: 'Nuclear', text: 'Nuclear', color: '#fea19f' },
    { key: 'Thermal generation', text: 'Thermal\ngeneration', color: '#3483ba' },
    { key: 'CHP', text: 'CHP', color: 'yellow' },
    { key: 'Electricity imports', text: 'Electricity imports', color: 'yellow' },
    { key: 'Wind', text: 'Wind', color: '#cbcbcb' },
    { key: 'Tidal', text: 'Tidal', color: '#6f3a5f' },
    { key: 'Wave', text: 'Wave', color: '#8b8b8b' },
    { key: 'Geothermal', text: 'Geothermal', color: '#556171' },
    { key: 'Hydro', text: 'Hydro', color: '#7c3e06' },
    { key: 'Electricity grid', text: 'Electricity grid', color: '#e483c7' },
    { key: 'H2 conversion', text: 'H2 conversion', color: '#868686' },
    { key: 'Solar Thermal', text: 'Solar Thermal', color: '#c9a59d' },
    { key: 'H2', text: 'H2', color: '#868686' },
    { key: 'Pumped heat', text: 'Pumped heat', color: '#96665c' },
    { key: 'District heating', text: 'District heating', color: '#c9b7d8' },
    { key: 'Losses', ltext: 'Losses', color: '#fec184' },
    { key: 'Over generation / exports', ltext: 'Over generation / exports', color: '#f6bcd5' },
    { key: 'Heating and cooling - homes', ltext: 'Heating and cooling - homes', color: '#c7a39b' },
    { key: 'Road transport', ltext: 'Road transport', color: '#cbcbcb' },
    {
      key: 'Heating and cooling - commercial',
      ltext: 'Heating and cooling - commercial',
      color: '#c9a59d',
    },
    { key: 'Industry', ltext: 'Industry', color: '#96665c' },
    {
      key: 'Lighting &amp; appliances - homes',
      ltext: 'Lighting &amp; appliances - homes',
      color: '#2dc3d2',
    },
    {
      key: 'Lighting &amp; appliances - commercial',
      ltext: 'Lighting &amp; appliances - commercial',
      color: '#2dc3d2',
    },
    { key: 'Agriculture', ltext: 'Agriculture', color: '#5c5c10' },
    { key: 'Rail transport', ltext: 'Rail transport', color: '#6b6b45' },
    { key: 'Domestic aviation', ltext: 'Domestic aviation', color: '#40a840' },
    { key: 'National navigation', ltext: 'National navigation', color: '#a1e194' },
    { key: 'International aviation', ltext: 'International aviation', color: '#fec184' },
    { key: 'International shipping', ltext: 'International shipping', color: '#fec184' },
    { key: 'Geosequestration', ltext: 'Geosequestration', color: '#fec184' },
  ];
  const linkDataArray: Array<go.ObjectData> = [
    { from: 'Coal reserves', to: 'Coal', width: 31 },
    { from: 'Coal imports', to: 'Coal', width: 86 },
    { from: 'Oil reserves', to: 'Oil', width: 244 },
    { from: 'Oil imports', to: 'Oil', width: 1 },
    { from: 'Gas reserves', to: 'Natural gas', width: 182 },
    { from: 'Gas imports', to: 'Natural gas', width: 61 },
    { from: 'UK land based bioenergy', to: 'Bio-conversion', width: 1 },
    { from: 'Marine algae', to: 'Bio-conversion', width: 1 },
    { from: "Agricultural 'waste'", to: 'Bio-conversion', width: 1 },
    { from: 'Other waste', to: 'Bio-conversion', width: 8 },
    { from: 'Other waste', to: 'Solid', width: 1 },
    { from: 'Biomass imports', to: 'Solid', width: 1 },
    { from: 'Biofuel imports', to: 'Liquid', width: 1 },
    { from: 'Coal', to: 'Solid', width: 117 },
    { from: 'Oil', to: 'Liquid', width: 244 },
    { from: 'Natural gas', to: 'Gas', width: 244 },
    { from: 'Solar', to: 'Solar PV', width: 1 },
    { from: 'Solar PV', to: 'Electricity grid', width: 1 },
    { from: 'Solar', to: 'Solar Thermal', width: 1 },
    { from: 'Bio-conversion', to: 'Solid', width: 3 },
    { from: 'Bio-conversion', to: 'Liquid', width: 1 },
    { from: 'Bio-conversion', to: 'Gas', width: 5 },
    { from: 'Bio-conversion', to: 'Losses', width: 1 },
    { from: 'Solid', to: 'Over generation / exports', width: 1 },
    { from: 'Liquid', to: 'Over generation / exports', width: 18 },
    { from: 'Gas', to: 'Over generation / exports', width: 1 },
    { from: 'Solid', to: 'Thermal generation', width: 106 },
    { from: 'Liquid', to: 'Thermal generation', width: 2 },
    { from: 'Gas', to: 'Thermal generation', width: 87 },
    { from: 'Nuclear', to: 'Thermal generation', width: 41 },
    { from: 'Thermal generation', to: 'District heating', width: 2 },
    { from: 'Thermal generation', to: 'Electricity grid', width: 92 },
    { from: 'Thermal generation', to: 'Losses', width: 142 },
    { from: 'Solid', to: 'CHP', width: 1 },
    { from: 'Liquid', to: 'CHP', width: 1 },
    { from: 'Gas', to: 'CHP', width: 1 },
    { from: 'CHP', to: 'Electricity grid', width: 1 },
    { from: 'CHP', to: 'Losses', width: 1 },
    { from: 'Electricity imports', to: 'Electricity grid', width: 1 },
    { from: 'Wind', to: 'Electricity grid', width: 1 },
    { from: 'Tidal', to: 'Electricity grid', width: 1 },
    { from: 'Wave', to: 'Electricity grid', width: 1 },
    { from: 'Geothermal', to: 'Electricity grid', width: 1 },
    { from: 'Hydro', to: 'Electricity grid', width: 1 },
    { from: 'Electricity grid', to: 'H2 conversion', width: 1 },
    { from: 'Electricity grid', to: 'Over generation / exports', width: 1 },
    { from: 'Electricity grid', to: 'Losses', width: 6 },
    { from: 'Gas', to: 'H2 conversion', width: 1 },
    { from: 'H2 conversion', to: 'H2', width: 1 },
    { from: 'H2 conversion', to: 'Losses', width: 1 },
    { from: 'Solar Thermal', to: 'Heating and cooling - homes', width: 1 },
    { from: 'H2', to: 'Road transport', width: 1 },
    { from: 'Pumped heat', to: 'Heating and cooling - homes', width: 1 },
    { from: 'Pumped heat', to: 'Heating and cooling - commercial', width: 1 },
    { from: 'CHP', to: 'Heating and cooling - homes', width: 1 },
    { from: 'CHP', to: 'Heating and cooling - commercial', width: 1 },
    { from: 'District heating', to: 'Heating and cooling - homes', width: 1 },
    { from: 'District heating', to: 'Heating and cooling - commercial', width: 1 },
    { from: 'District heating', to: 'Industry', width: 2 },
    { from: 'Electricity grid', to: 'Heating and cooling - homes', width: 7 },
    { from: 'Solid', to: 'Heating and cooling - homes', width: 3 },
    { from: 'Liquid', to: 'Heating and cooling - homes', width: 3 },
    { from: 'Gas', to: 'Heating and cooling - homes', width: 81 },
    { from: 'Electricity grid', to: 'Heating and cooling - commercial', width: 7 },
    { from: 'Solid', to: 'Heating and cooling - commercial', width: 1 },
    { from: 'Liquid', to: 'Heating and cooling - commercial', width: 2 },
    { from: 'Gas', to: 'Heating and cooling - commercial', width: 19 },
    { from: 'Electricity grid', to: 'Lighting &amp; appliances - homes', width: 21 },
    { from: 'Gas', to: 'Lighting &amp; appliances - homes', width: 2 },
    { from: 'Electricity grid', to: 'Lighting &amp; appliances - commercial', width: 18 },
    { from: 'Gas', to: 'Lighting &amp; appliances - commercial', width: 2 },
    { from: 'Electricity grid', to: 'Industry', width: 30 },
    { from: 'Solid', to: 'Industry', width: 13 },
    { from: 'Liquid', to: 'Industry', width: 34 },
    { from: 'Gas', to: 'Industry', width: 54 },
    { from: 'Electricity grid', to: 'Agriculture', width: 1 },
    { from: 'Solid', to: 'Agriculture', width: 1 },
    { from: 'Liquid', to: 'Agriculture', width: 1 },
    { from: 'Gas', to: 'Agriculture', width: 1 },
    { from: 'Electricity grid', to: 'Road transport', width: 1 },
    { from: 'Liquid', to: 'Road transport', width: 122 },
    { from: 'Electricity grid', to: 'Rail transport', width: 2 },
    { from: 'Liquid', to: 'Rail transport', width: 1 },
    { from: 'Liquid', to: 'Domestic aviation', width: 2 },
    { from: 'Liquid', to: 'National navigation', width: 4 },
    { from: 'Liquid', to: 'International aviation', width: 38 },
    { from: 'Liquid', to: 'International shipping', width: 13 },
    { from: 'Electricity grid', to: 'Geosequestration', width: 1 },
    { from: 'Gas', to: 'Losses', width: 2 },
  ];
  const sampleData = {
    // class: 'go.GraphLinksModel',
    nodeDataArray,
    linkDataArray,
  };
  // const modelData = go.Model.fromJson(sampleData);
  console.log('XXX', {
    sampleData,
    // modelData,
  });
  return sampleData;
}

interface TSankeyGoJSDemoProps {
  className?: string;
}

function getFullDataSet(dataSet: Partial<TChartDataSet>) {
  const {
    // prettier-ignore
    edgesData,
    flowsData,
    graphsData,
    nodesData,
  } = dataSet;
  try {
    if (!edgesData || !flowsData || !graphsData || !nodesData) {
      const errMsg = 'Some of required data is undefined';
      const error = new Error(errMsg);
      throw error;
    }
    const graphsHash = constructGraphsHashGraphsData(graphsData);
    const nodesHash = constructNodesHashFromData(nodesData);
    const fullDataSet: TFullChartDataSet = {
      edgesData,
      flowsData,
      graphsData,
      nodesData,
      graphsHash,
      nodesHash,
    };
    return fullDataSet;
  } catch (error) {
    const errMsg = [
      // prettier-ignore
      'Cannot costruct full data set',
      getErrorText(error),
    ]
      .filter(Boolean)
      .join(': ');
    const resultError = new Error(errMsg);
    // eslint-disable-next-line no-console
    console.error('[SankeyGoJSDemo:getFullDataSet] error', {
      // error,
      resultError,
      edgesData,
      flowsData,
      graphsData,
      nodesData,
    });
    debugger; // eslint-disable-line no-debugger
    throw resultError;
    // setErrorText(getErrorText(resultError));
  }
}

export const SankeyGoJSDemo: React.FC<TSankeyGoJSDemoProps> = observer((props) => {
  const { className } = props;
  const sankeyAppDataStore = useSankeyAppDataStore();
  const [errorText, setErrorText] = React.useState<string | undefined>();
  React.useEffect(() => {
    if (errorText) {
      toasts.showError(errorText);
    }
  }, [errorText]);
  const {
    // prettier-ignore
    edgesData,
    flowsData,
    graphsData,
    nodesData,
  } = sankeyAppDataStore;
  /* // anychartData
   * const anychartData = React.useMemo<TAnyChartData | undefined>(() => {
   *   if (__debugUseDemoData) {
   *     return anychartDemoData;
   *   }
   *   const fullDataSet = getFullDataSet({
   *     // prettier-ignore
   *     edgesData,
   *     flowsData,
   *     graphsData,
   *     nodesData,
   *   });
   *   if (!fullDataSet) {
   *     // Error should already be processed in `getFullDataSet`
   *     return undefined;
   *   }
   *   try {
   *     const anychartData = constructEdgesData(fullDataSet);
   *     setErrorText(undefined);
   *     return anychartData;
   *   } catch (error) {
   *     const errMsg = [
   *       // prettier-ignore
   *       'Cannot costruct chart data',
   *       getErrorText(error),
   *     ]
   *       .filter(Boolean)
   *       .join(': ');
   *     const resultError = new Error(errMsg);
   *     // eslint-disable-next-line no-console
   *     console.error('[SankeyGoJSDemo:anychartData] error', {
   *       // error,
   *       resultError,
   *       fullDataSet,
   *       edgesData,
   *       flowsData,
   *       graphsData,
   *       nodesData,
   *     });
   *     debugger; // eslint-disable-line no-debugger
   *     setErrorText(getErrorText(resultError));
   *   }
   * }, [
   *   // prettier-ignore
   *   edgesData,
   *   flowsData,
   *   graphsData,
   *   nodesData,
   *   getFullDataSet,
   * ]);
   */

  const gojsData = React.useMemo(() => {
    const sampleGojsData = getGojsSampleData();
    return {
      // ...gojsDemoData,
      ...sampleGojsData,
      modelData: {
        canRelink: true,
      },
      selectedData: null,
      skipsDiagramUpdate: false,
    };
  }, []);

  return (
    <Box className={classNames(className, styles.root)}>
      {/* // Debug: show some small stats...
      <Box>
        <Typography>Edges: {getSankeyDataInfo(edgesData)}</Typography>
        <Typography>Flows: {getSankeyDataInfo(flowsData)}</Typography>
        <Typography>Graphs: {getSankeyDataInfo(graphsData)}</Typography>
        <Typography>Nodes: {getSankeyDataInfo(nodesData)}</Typography>
      </Box>
      */}
      {!!errorText && <Box className={styles.errorBox}>{errorText}</Box>}
      {!!gojsData && (
        <DiagramWrapper
          nodeDataArray={gojsData.nodeDataArray}
          linkDataArray={gojsData.linkDataArray}
          modelData={gojsData.modelData}
          skipsDiagramUpdate={gojsData.skipsDiagramUpdate}
          // onDiagramEvent={this.handleDiagramEvent}
          // onModelChange={this.handleModelChange}
        />
      )}
    </Box>
  );
});
