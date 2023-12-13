'use strict';

module.exports = {
    nodeTextOffsetHorizontal: 4,
    nodeTextOffsetVertical: 3,
    nodePadAcross: 10,
    sankeyIterations: 50,
    forceIterations: 5,
    forceTicksPerFrame: 10,
    duration: 150,
    ease: 'linear',
    cn: {
        sankey: 'sankey',
        sankeyLinks: 'sankey-links',
        sankeyLink: 'sankey-link',
        sankeyNodeSet: 'sankey-node-set',
        sankeyNode: 'sankey-node',
        nodeRect: 'node-rect',
        nodeLabel: 'node-label',
        nodeLabelRect: 'node-label-rect', // Issue #16: Try to use clipping rect for node labels
        nodeLabelText: 'node-label-text', // Issue #16: Try to use clipping text for node labels
    }
};
