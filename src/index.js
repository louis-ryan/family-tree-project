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
import geneFile from './gedcoms/editedTree.ged';
import storyFile from './gedcoms/storyTree.ged';

const App = () => {

  const [showingRoots, setShowingRoots] = useState(false);
  const [d3Data, setD3Data] = useState([]);
  const [timelineShowing, setTimelineShowing] = useState(false);
  const [highlightedFamily, setHighlightedFamily] = useState();
  const [hoveredNode, setHoveredNode] = useState(null);
  const [view, setView] = useState('GENE')



  const readFile = (file) => {
    const newData = d3ize(parse(file))
    setD3Data(newData);  // Parse data
    setShowingRoots(true);
  }


  useEffect(() => {

    switch (view) {
      case 'GENE':
        readFile(geneFile)
        setHoveredNode(null)
        setHighlightedFamily(null)
        break
      case 'LOCA':
        readFile(storyFile)
        setHoveredNode(null)
        setHighlightedFamily(null)
        break
      default:
        readFile(geneFile)
        setHoveredNode(null)
        setHighlightedFamily(null)
    }

  }, [view])


  return (
    <>
      {!showingRoots ?
        <></> :
        <>
          <Controls
            d3Data={d3Data}
            setTimelineShowing={setTimelineShowing}
            highlightedFamily={highlightedFamily}
            setHighlightedFamily={setHighlightedFamily}
            hoveredNode={hoveredNode}
            view={view}
            setView={setView}
          />
          <Graph
            d3Data={d3Data}
            highlightedFamily={highlightedFamily}
            setHighlightedFamily={setHighlightedFamily}
            setHoveredNode={setHoveredNode}
            view={view}
          />
        </>
      }
    </>
  )
}

ReactDOM.render(<App />, document.getElementById('root'));
