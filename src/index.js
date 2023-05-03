import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { parse, d3ize } from 'gedcom-d3';
import styled from "styled-components";
import Controls from './Controls';
import Graph from './Graph';
import Auth from './Auth';
import geneFile from './gedcoms/editedTree.ged';
import storyFile from './gedcoms/storyTree.ged';

import './sass/style.scss';


const App = () => {

  const [showingRoots, setShowingRoots] = useState(false);
  const [d3Data, setD3Data] = useState([]);
  // const [timelineShowing, setTimelineShowing] = useState(false);
  const [highlightedFamily, setHighlightedFamily] = useState();
  const [hoveredNode, setHoveredNode] = useState(null);
  const [view, setView] = useState('GENE')

  const [password, setPassword] = useState("")
  const [unlocked, setUnlocked] = useState(false)
  const [error, setError] = useState("")


  const handleSubmit = () => {
    if (password === "Gonzo23") {
      setUnlocked(true)
    } else if (password === "") {
      setError("errm... you didn't write anything")
    } else {
      setError("wrong password")
    }
    setTimeout(() => { setError("") }, 3000)
  }


  const readFile = (file) => {
    const newData = d3ize(parse(file))
    setD3Data(newData);  // Parse data
    setShowingRoots(true);
  }


  /**
   * Change view on tapping view option
   */
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


  /**
   * Submit Auth form on pressing enter
   */
  useEffect(() => {
    function handleKeyPress(event) { if (event.key === 'Enter') handleSubmit() }
    document.addEventListener('keydown', handleKeyPress);
    // Cleanup function to remove the event listener when the component unmounts
    return () => { document.removeEventListener('keydown', handleKeyPress); };
  })


  if (!unlocked) {
    return <Auth
      handleSubmit={handleSubmit}
      setPassword={setPassword}
      error={error}
    />
  } else {
    return (
      <>
        {showingRoots &&
          <>
            <Controls
              d3Data={d3Data}
              // setTimelineShowing={setTimelineShowing}
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
}

ReactDOM.render(<App />, document.getElementById('root'));
