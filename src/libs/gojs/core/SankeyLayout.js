import * as go from 'gojs';

// TODO: To use correct typings?

export class SankeyLayout extends go.LayeredDigraphLayout {
  constructor() {
    super();
    this.alignOption = go.LayeredDigraphLayout.AlignAll;
  }

  // determine the desired height of each node/vertex,
  // based on the thicknesses of the connected links;
  // actually modify the height of each node's SHAPE
  makeNetwork(coll) {
    const net = super.makeNetwork(coll);
    this.diagram.nodes.each((node) => {
      // figure out how tall the node's bar should be
      const height = this.getAutoHeightForNode(node);
      const shape = node.findObject('SHAPE');
      if (shape) shape.height = height;
      const text = node.findObject('TEXT');
      const ltext = node.findObject('LTEXT');
      const font = 'bold ' + Math.max(12, Math.round(height / 8)) + 'pt Segoe UI, sans-serif';
      if (text) text.font = font;
      if (ltext) ltext.font = font;
      // and update the vertex's dimensions accordingly
      const v = net.findVertex(node);
      if (v !== null) {
        node.ensureBounds();
        const r = node.actualBounds;
        v.width = r.width;
        v.height = r.height;
        v.focusY = v.height / 2;
      }
    });
    return net;
  }

  getAutoHeightForNode(node) {
    let heightIn = 0;
    let it = node.findLinksInto();
    while (it.next()) {
      const link = it.value;
      heightIn += link.computeThickness();
    }
    let heightOut = 0;
    it = node.findLinksOutOf();
    while (it.next()) {
      const link = it.value;
      heightOut += link.computeThickness();
    }
    let h = Math.max(heightIn, heightOut);
    if (h < 10) h = 10;
    return h;
  }

  // treat dummy vertexes as having the thickness of the link that they are in
  nodeMinColumnSpace(v, topleft) {
    if (v.node === null) {
      if (v.edgesCount >= 1) {
        let max = 1;
        const it = v.edges;
        while (it.next()) {
          const edge = it.value;
          if (edge.link != null) {
            const t = edge.link.computeThickness();
            if (t > max) max = t;
            break;
          }
        }
        return Math.max(2, Math.ceil(max / this.columnSpacing));
      }
      return 2;
    }
    return super.nodeMinColumnSpace(v, topleft);
  }

  // treat dummy vertexes as being thicker, so that the Bezier curves are gentler
  nodeMinLayerSpace(v, topleft) {
    if (v.node === null) return 100;
    return super.nodeMinLayerSpace(v, topleft);
  }

  assignLayers() {
    super.assignLayers();
    const maxlayer = this.maxLayer;
    // now make sure every vertex with no outputs is maxlayer
    for (let it = this.network.vertexes.iterator; it.next(); ) {
      const v = it.value;
      // const node = v.node;
      if (!v.destinationVertexes.count) {
        v.layer = 0;
      }
      if (!v.sourceVertexes.count) {
        v.layer = maxlayer;
      }
    }
    // from now on, the LayeredDigraphLayout will think that the Node is bigger than it really is
    // (other than the ones that are the widest or tallest in their respective layer).
  }

  commitLayout() {
    super.commitLayout();
    for (let it = this.network.edges.iterator; it.next(); ) {
      const link = it.value.link;
      if (link && link.curve === go.Link.Bezier) {
        // depend on Link.adjusting === go.Link.End to fix up the end points of the links
        // without losing the intermediate points of the route as determined by LayeredDigraphLayout
        link.invalidateRoute();
      }
    }
  }
}
