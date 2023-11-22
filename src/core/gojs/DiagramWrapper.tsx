/*
 *  Copyright (C) 1998-2023 by Northwoods Software Corporation. All Rights Reserved.
 */

import * as React from 'react';

import * as go from 'gojs';

import { ReactDiagram } from 'src/core/gojs';

// import { GuidedDraggingTool } from './GuidedDraggingTool';
import { SankeyLayout } from './SankeyLayout';

import './Diagram.css';

interface DiagramProps {
  nodeDataArray: Array<go.ObjectData>;
  linkDataArray?: Array<go.ObjectData>;
  modelData?: go.ObjectData;
  skipsDiagramUpdate?: boolean;
  onDiagramEvent?: (e: go.DiagramEvent) => void;
  onModelChange?: (e: go.IncrementalData) => void;
}

export class DiagramWrapper extends React.Component<DiagramProps, {}> {
  /**
   * Ref to keep a reference to the Diagram component, which provides access to the GoJS diagram via getDiagram().
   */
  private diagramRef: React.RefObject<ReactDiagram>;

  private diagramStyle = { backgroundColor: '#eee' };

  /** @internal */
  constructor(props: DiagramProps) {
    super(props);
    this.diagramRef = React.createRef();
  }

  /**
   * Get the diagram reference and add any desired diagram listeners.
   * Typically the same function will be used for each listener, with the function using a switch statement to handle the events.
   */
  public componentDidMount() {
    if (!this.diagramRef.current) return;
    const diagram = this.diagramRef.current.getDiagram();
    if (diagram instanceof go.Diagram && this.props.onDiagramEvent) {
      diagram.addDiagramListener('ChangedSelection', this.props.onDiagramEvent);
    }
  }

  /**
   * Get the diagram reference and remove listeners that were added during mounting.
   */
  public componentWillUnmount() {
    if (!this.diagramRef.current) return;
    const diagram = this.diagramRef.current.getDiagram();
    if (diagram instanceof go.Diagram && this.props.onDiagramEvent) {
      diagram.removeDiagramListener('ChangedSelection', this.props.onDiagramEvent);
    }
  }

  /**
   * Diagram initialization method, which is passed to the ReactDiagram component.
   * This method is responsible for making the diagram and initializing the model, any templates,
   * and maybe doing other initialization tasks like customizing tools.
   * The model's data should not be set here, as the ReactDiagram component handles that.
   */
  private initDiagram(): go.Diagram {
    const $ = go.GraphObject.make;
    // set your license key here before creating the diagram: go.Diagram.licenseKey = "...";
    const diagram = $(go.Diagram, {
      'undoManager.isEnabled': true, // must be set to allow for model change listening
      // 'undoManager.maxHistoryLength': 0,  // uncomment disable undo/redo functionality
      // 'clickCreatingTool.archetypeNodeData': { text: 'new node', color: 'lightblue' },
      // draggingTool: new GuidedDraggingTool(),  // defined in GuidedDraggingTool.ts
      // 'draggingTool.horizontalGuidelineColor': 'blue',
      // 'draggingTool.verticalGuidelineColor': 'blue',
      // 'draggingTool.centerGuidelineColor': 'green',
      // 'draggingTool.guidelineWidth': 1,
      // layout: $(go.ForceDirectedLayout),
      // layout: $(go.LayeredDigraphLayout),
      layout: $(SankeyLayout, {
        setsPortSpots: false, // to allow the "Side" spots on the nodes to take effect
        direction: 0, // rightwards
        layeringOption: go.LayeredDigraphLayout.LayerOptimalLinkLength,
        packOption: go.LayeredDigraphLayout.PackStraighten || go.LayeredDigraphLayout.PackMedian,
        layerSpacing: 100, // lots of space between layers, for nicer thick links
        columnSpacing: 1,
      }),
      initialAutoScale: go.Diagram.UniformToFill,
      'animationManager.isEnabled': false,
      model: $(go.GraphLinksModel, {
        linkKeyProperty: 'key', // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
        // positive keys for nodes
        makeUniqueKeyFunction: (m: go.Model, data: any) => {
          let k = data.key || 1;
          while (m.findNodeDataForKey(k)) k++;
          data.key = k;
          return k;
        },
        // negative keys for links
        makeUniqueLinkKeyFunction: (m: go.GraphLinksModel, data: any) => {
          let k = data.key || -1;
          while (m.findLinkDataForKey(k)) k--;
          data.key = k;
          return k;
        },
      }),
    });

    /* // define a simple Node template
     * diagram.nodeTemplate = $(
     *   go.Node,
     *   'Auto', // the Shape will go around the TextBlock
     *   new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
     *   $(
     *     go.Shape,
     *     'RoundedRectangle',
     *     {
     *       name: 'SHAPE',
     *       fill: 'white',
     *       strokeWidth: 0,
     *       // set the port properties:
     *       portId: '',
     *       fromLinkable: true,
     *       toLinkable: true,
     *       cursor: 'pointer',
     *     },
     *     // Shape.fill is bound to Node.data.color
     *     new go.Binding('fill', 'color'),
     *   ),
     *   $(
     *     go.TextBlock,
     *     { margin: 8, editable: true, font: '400 .875rem Roboto, sans-serif' }, // some room around the text
     *     new go.Binding('text').makeTwoWay(),
     *   ),
     * );
     */

    // this function provides a common style for the TextBlocks
    function textStyle() {
      return { font: 'bold 12pt Segoe UI, sans-serif', stroke: 'black', margin: 5 };
    }

    // define the Node template
    diagram.nodeTemplate = $(
      go.Node,
      go.Panel.Horizontal,
      {
        locationObjectName: 'SHAPE',
        locationSpot: go.Spot.Left,
        portSpreading: go.Node.SpreadingPacked, // rather than the default go.Node.SpreadingEvenly
      },
      $(go.TextBlock, textStyle(), { name: 'LTEXT' }, new go.Binding('text', 'ltext')),
      $(
        go.Shape,
        {
          name: 'SHAPE',
          fill: '#2E8DEF', // default fill color
          strokeWidth: 0,
          portId: '',
          fromSpot: go.Spot.RightSide,
          toSpot: go.Spot.LeftSide,
          height: 10,
          width: 20,
        },
        new go.Binding('fill', 'color'),
      ),
      $(go.TextBlock, textStyle(), { name: 'TEXT' }, new go.Binding('text')),
    );

    // relinking depends on modelData
    diagram.linkTemplate = $(
      go.Link,
      new go.Binding('relinkableFrom', 'canRelink').ofModel(),
      new go.Binding('relinkableTo', 'canRelink').ofModel(),
      $(go.Shape),
      $(go.Shape, { toArrow: 'Standard' }),
    );

    function getAutoLinkColor(data: any) {
      const nodedata = diagram.model.findNodeDataForKey(data.from);
      const hex = nodedata?.color;
      if (hex.charAt(0) === '#') {
        const rgb = parseInt(hex.slice(1, 7), 16);
        const r = rgb >> 16;
        const g = (rgb >> 8) & 0xff;
        const b = rgb & 0xff;
        let alpha = 0.4;
        if (data.width <= 2) alpha = 1;
        const rgba = 'rgba(' + r + ',' + g + ',' + b + ', ' + alpha + ')';
        return rgba;
      }
      return 'rgba(173, 173, 173, 0.25)';
    }

    // define the Link template
    const linkSelectionAdornmentTemplate = $(
      go.Adornment,
      'Link',
      // $(go.Shape, {
      //   isPanelMain: true,
      //   fill: null,
      //   stroke: 'rgba(0, 0, 255, 0.3)',
      //   strokeWidth: 0,
      // }), // use selection object's strokeWidth
    );

    diagram.linkTemplate = $(
      go.Link,
      go.Link.Bezier,
      {
        selectionAdornmentTemplate: linkSelectionAdornmentTemplate,
        layerName: 'Background',
        fromEndSegmentLength: 150,
        toEndSegmentLength: 150,
        adjusting: go.Link.End,
      },
      $(
        go.Shape,
        { strokeWidth: 4, stroke: 'rgba(173, 173, 173, 0.25)' },
        new go.Binding('stroke', '', getAutoLinkColor),
        new go.Binding('strokeWidth', 'width'),
      ),
    );

    return diagram;
  }

  public render() {
    return (
      <ReactDiagram
        ref={this.diagramRef}
        divClassName="diagram-component"
        style={this.diagramStyle}
        initDiagram={this.initDiagram}
        nodeDataArray={this.props.nodeDataArray}
        linkDataArray={this.props.linkDataArray}
        modelData={this.props.modelData}
        onModelChange={this.props.onModelChange}
        skipsDiagramUpdate={this.props.skipsDiagramUpdate}
      />
    );
  }
}
