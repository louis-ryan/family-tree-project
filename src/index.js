// Modules
import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { parse, d3ize } from 'gedcom-d3';

// Components
import Controls from './Controls';
import Graph from './Graph';

// Style
import './sass/style.scss';

// GEDOM files
import gedcomFile from './gedcoms/editedTree.ged';

const App = () => {

  const [showingRoots, setShowingRoots] = useState(false);
  const [d3Data, setD3Data] = useState([]);
  const [timelineShowing, setTimelineShowing] = useState(false);
  const [highlightedFamily, setHighlightedFamily] = useState();
  const [hoveredNode, setHoveredNode] = useState(null);


  const readFile = file => {
    const newData = d3ize(parse(file))
    console.log("new data: ", newData)
    setD3Data(newData);  // Parse data
    setShowingRoots(true);
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
            closeRoots={() => {}}
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
