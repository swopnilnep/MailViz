export class VisNetworkOptions {

  /**
   * 
   * The VisNetworkOptions class is declared 
   * as an object representing 
   * the 'options' for the Vis
   * Network Object
   * 
   */



    physics = {
        enabled: true,
        barnesHut: {
          gravitationalConstant: -3000,
          centralGravity: 0.5,
          springLength: 50,
          springConstant: 0.01,
          damping: 0.3,
          avoidOverlap: 0.1
        },
        // forceAtlas2Based: {
        //   gravitationalConstant: -50,
        //   centralGravity: 0.01,
        //   springConstant: 0.08,
        //   springLength: 100,
        //   damping: 0.4,
        //   avoidOverlap: 0
        // },
        // repulsion: {
        //   centralGravity: 0.2,
        //   springLength: 200,
        //   springConstant: 0.05,
        //   nodeDistance: 100,
        //   damping: 0.09
        // },
        // hierarchicalRepulsion: {
        //   centralGravity: 0.0,
        //   springLength: 100,
        //   springConstant: 0.01,
        //   nodeDistance: 120,
        //   damping: 0.09
        // },
        // maxVelocity: 50,
        // minVelocity: 0.1,
        // solver: 'barnesHut',
        // stabilization: {
        //   enabled: true,
        //   iterations: 1000,
        //   updateInterval: 100,
        //   onlyDynamicEdges: false,
        //   fit: true
        // },
        // timestep: 0.5,
        // adaptiveTimestep: true
    };

    interaction = {
    //     dragNodes:true,
    //     dragView: true,
    //     hideEdgesOnDrag: false,
    //     hideNodesOnDrag: false,
        hover: true,
        hoverConnectedEdges: false,
    //     keyboard: {
    //         enabled: false,
    //         speed: {x: 10, y: 10, zoom: 0.02},
    //         bindToWindow: true
    //     },
        multiselect: true,
        // navigationButtons: false,
        // selectable: true,
        // selectConnectedEdges: true,
    //     tooltipDelay: 300,
    //     zoomView: true
    };

    nodes = {
        // borderWidth: 1,
        // borderWidthSelected: 2,
        // brokenImage:undefined,
        // chosen: true,
        // color: {
        //   border: '#2B7CE9',
        //   background: '#97C2FC',
        //   highlight: {
            // border: '#2B7CE9',
            // background: '#D2E5FF'
        //   },
        //   hover: {
            // border: '#2B7CE9',
            // background: '#D2E5FF'
        //   }
        // },
        // fixed: {
        //   x:false,
        //   y:false
        // },
        font: {
          color: 'black',
        //   size: 14, // px
        //   face: 'arial',
          background: 'white',
        //   strokeWidth: 0, // px
        //   strokeColor: '#ffffff',
        //   align: 'center',
        //   multi: false,
        //   vadjust: 0,
        //   bold: {
        //     color: '#343434',
        //     size: 14, // px
        //     face: 'arial',
        //     vadjust: 0,
        //     mod: 'bold'
        //   },
        //   ital: {
        //     color: '#343434',
        //     size: 14, // px
        //     face: 'arial',
        //     vadjust: 0,
        //     mod: 'italic',
        //   },
        //   boldital: {
        //     color: '#343434',
        //     size: 14, // px
        //     face: 'arial',
        //     vadjust: 0,
        //     mod: 'bold italic'
        //   },
        //   mono: {
        //     color: '#343434',
        //     size: 15, // px
        //     face: 'courier new',
        //     vadjust: 2,
        //     mod: ''
        //   }
        },
        // group: undefined,
        // heightConstraint: false,
        // hidden: false,
        // icon: {
        //   face: 'FontAwesome',
        //   code: undefined,
        //   size: 50,  //50,
        //   color:'#2B7CE9'
        // },
        // image: undefined,
        // label: undefined,
        // labelHighlightBold: true,
        // level: undefined,
        // mass: 1,
        // physics: true,
        scaling: {
          min: 8,
          max: 20,
          label: {
            // enabled: true,
            min: 10,
            max: 15,
            // maxVisible: 30,
            // drawThreshold: 5
          },
        //   customScalingFunction: function (min,max,total,value) {
        //     if (max === min) {
        //       return 0.5;
        //     }
        //     else {
        //       let scale = 1 / (max - min);
        //       return Math.max(0,(value - min)*scale);
        //     }
        //   }
        },
        shape: 'dot',
        // shapeProperties: {
        //   borderDashes: false, // only for borders
        //   borderRadius: 6,     // only for box shape
        //   interpolation: false,  // only for image and circularImage shapes
        //   useImageSize: false,  // only for image and circularImage shapes
        //   useBorderWithImage: false  // only for image shape
        // }
        // size: 25, // Note: This is ignored when the scaling function is enabled
        // title: "Test",
        // value: 50,
        // widthConstraint: false,
        // x: undefined,
        // y: undefined
    };
      
    edges = {
        arrows: {
          to:     {enabled: true, scaleFactor:1, type:'arrow'},
          // middle: {enabled: true, scaleFactor:1, type:'arrow'},
          // from:   {enabled: true, scaleFactor:1, type:'arrow'}
        },
        arrowStrikethrough: true,
        // chosen: true,
        color: {
          color:'lightblue',
          highlight:'orange',
          hover: 'gold',
          inherit: 'from',
          opacity:0.8
        },
        // dashes: false,
        // font: {
          // color: 'black',
        //   size: 14, // px
        //   face: 'arial',
          // background: 'white',
        //   strokeWidth: 2, // px
        //   strokeColor: '#ffffff',
        //   align: 'horizontal',
        //   multi: false,
        //   vadjust: 0,
        //   bold: {
        //     color: '#343434',
        //     size: 14, // px
        //     face: 'arial',
        //     vadjust: 0,
        //     mod: 'bold'
        //   },
        //   ital: {
        //     color: '#343434',
        //     size: 14, // px
        //     face: 'arial',
        //     vadjust: 0,
        //     mod: 'italic',
        //   },
        //   boldital: {
        //     color: '#343434',
        //     size: 14, // px
        //     face: 'arial',
        //     vadjust: 0,
        //     mod: 'bold italic'
        //   },
        //   mono: {
        //     color: '#343434',
        //     size: 15, // px
        //     face: 'courier new',
        //     vadjust: 2,
        //     mod: ''
        //   }
        // },
        // hidden: false,
        hoverWidth: 1.5,
        // label: undefined,
        // labelHighlightBold: true,
        // length: undefined,
        // physics: true,
        scaling:{
          min: 1,
          max: 5,
          // label: {
            // enabled: true,
            // min: 14,
            // max: 30,
            // maxVisible: 30,
            // drawThreshold: 5
          // },
        //   customScalingFunction: function (min,max,total,value) {
        //     if (max === min) {
        //       return 0.5;
        //     }
        //     else {
        //       var scale = 1 / (max - min);
        //       return Math.max(0,(value - min)*scale);
        //     }
        //   }
        },
        // selectionWidth: 1,
        // selfReferenceSize:20,
        // shadow:{
        //   enabled: false,
        //   color: 'rgba(0,0,0,0.5)',
        //   size:10,
        //   x:5,
        //   y:5
        // },
        smooth: {
        //   enabled: true,
          type: "continuous",
        //   roundness: 0.5
        },
        // title:undefined,
        // value: undefined,
        // width: 1,
        // widthConstraint: false
    };

    layout = {
      improvedLayout: false
    };
};
