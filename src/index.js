// Modules
import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { parse, d3ize } from 'gedcom-d3';

// Components
import Load from './Load';
import Controls from './Controls';
import Graph from './Graph';

// Style
import './sass/style.scss';

// GEDOM files
import gedcomFile from './gedcoms/editedtree.ged';

const App = () => {

  const [actualData, setActualData] = useState({})

  const [showingRoots, setShowingRoots] = useState(false);
  const [d3Data, setD3Data] = useState([]);
  console.log("data: ", d3Data)
  const [showError, setShowError] = useState(false);
  const [timelineShowing, setTimelineShowing] = useState(false);
  const [highlightedFamily, setHighlightedFamily] = useState();
  const [hoveredNode, setHoveredNode] = useState(null);


  // useEffect(() => {
  //   var realTree = d3ize(parse(realGedcomFile))

  //   var newNodes = realTree.nodes.slice(0,40)

  //   // console.log("nodes: ", newNodes)

  //   realTree.nodes = newNodes

  //   console.log("new real: ", realTree)

  //   setActualData(realTree)


  // })



  const readFile = file => {
    const newData = d3ize(parse(file))
    console.log("new data: ", newData)
    setD3Data(newData);  // Parse data
    setShowingRoots(true);
    setShowError(false);
  }

  const closeRoots = () => {
    setShowingRoots(false);
    setHighlightedFamily();
    setD3Data([]);
  }

  const handleUpload = event => {
    const file = event.target.files[0];
    const parts = file.name.split('.');
    const reader = new FileReader(file);

    if (parts[parts.length - 1].toLowerCase() === 'ged') {
      reader.onloadend = () => {
        readFile(reader.result);
      }
      reader.readAsText(file);
    } else {
      reader.readAsText(file);
      setShowError(true);
    }
  }

  useEffect(() => {
    readFile(gedcomFile)
  }, [])


  return (
    <>
      {!showingRoots ?
        <></> :
        <>
          <Controls
            d3Data={d3Data}
            closeRoots={closeRoots}
            setTimelineShowing={setTimelineShowing}
            highlightedFamily={highlightedFamily}
            setHighlightedFamily={setHighlightedFamily}
            hoveredNode={hoveredNode}
          />
          <Graph
            d3Data={d3Data}
            highlightedFamily={highlightedFamily}
            setHighlightedFamily={setHighlightedFamily}
            setHoveredNode={setHoveredNode}
          />
        </>
      }
    </>
  )
}

ReactDOM.render(<App />, document.getElementById('root'));
