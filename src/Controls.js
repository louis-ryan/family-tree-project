import React, { useState } from "react";

import geneIcon from './img/GENE_view.svg';
import locaIcon from './img/LOCA_view.svg';

const Controls = ({ d3Data, setTimelineShowing, highlightedFamily, setHighlightedFamily, hoveredNode, view, setView }) => {

  // const [showingLegend, setShowingLegend] = useState(false);
  const [showingsurnames, setShowingsurnames] = useState(false);

  // const toggleLegend = () => {
  //   setShowingLegend(prevState => !prevState);
  //   setShowingsurnames(false);
  // }

  const toggleSurnames = () => {
    setShowingsurnames(prevState => !prevState);
    // setShowingLegend(false);
  }

  // const handleClick = () => {
  //   setTimelineShowing(prevState => !prevState)
  // }

  function compareSurname(a, b) {
    if (a.surname < b.surname) {
      return -1;
    }
    if (a.surname > b.surname) {
      return 1;
    }
    return 0;
  }

  function compareCount(a, b) {
    if (a.count < b.count) {
      return 1;
    }
    if (a.count > b.count) {
      return -1;
    }
    return 0;
  }

  const surnameList = d3Data.surnameList.filter(name => name.surname !== "").sort(compareSurname).sort(compareCount).map((family, index) =>
    <p
      key={index}
      style={{ color: !highlightedFamily ? family.color : highlightedFamily === family.surname ? family.color : '#333', cursor: 'pointer' }}
      onClick={e => highlightedFamily === family.surname ? setHighlightedFamily() : setHighlightedFamily(family.surname)}>
      {family.surname} ({family.count})
    </p>
  );

  const nodeInfoInsert = (node) => {


    return (
      <div
        id="node-info--content"
        style={{ overflow: "hidden" }}
      >
        {/* {node.title ? <h4 class="node-title"><span style={{ color: node.color }}>{node.name} ({node.title})</span> {labelGender}</h4> :
          <h4><span style={{ color: node.color }}>{node.name}</span> {labelGender}</h4>} */}
        {view === 'GENE' && <p><b>{node.yob} - {node.yod}</b></p>}
        {node.pob != '' && <p><b>From:</b> {node.pob}</p>}
        {node.pod != '' && <p><b>Died:</b> {node.pod}</p>}
        {node.bio && <p>{node.bio}</p>}
        {node.pointer === '@australia@' && <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29615470.986951124!2d115.19241061074887!3d-25.02831107941051!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2b2bfd076787c5df%3A0x538267a1955b1352!2sAustralia!5e0!3m2!1sen!2sde!4v1680088669509!5m2!1sen!2sde" width="340" height="340" loading="lazy"></iframe>}
        {node.pointer === '@europe@' && <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d61894805.822864376!2d-51.13252782064452!3d18.764292469686296!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46ed8886cfadda85%3A0x72ef99e6b3fcf079!2sEurope!5e0!3m2!1sen!2sde!4v1680103984013!5m2!1sen!2sde" width="340" height="340" loading="lazy"></iframe>}
        {node.pointer === '@den-haag@' && <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d156957.61578377735!2d4.02279544010545!3d52.07130556270584!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c5b72f4298bd71%3A0x400de5a8d1e6c10!2sThe%20Hague%2C%20Netherlands!5e0!3m2!1sen!2sde!4v1680086818596!5m2!1sen!2sde" width="340" height="340" loading="lazy"></iframe>}
        {node.pointer === '@sydney@' && <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d424143.27127035987!2d150.65178804835227!3d-33.84792703526946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b129838f39a743f%3A0x3017d681632a850!2sSydney%20NSW%2C%20Australia!5e0!3m2!1sen!2sde!4v1680088392704!5m2!1sen!2sde" width="340" height="340" loading="lazy"></iframe>}
        {node.pointer === '@melbourne@' && <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d805184.6315168749!2d144.49269988592664!3d-37.97123704654995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad646b5d2ba4df7%3A0x4045675218ccd90!2sMelbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2sde!4v1680103808201!5m2!1sen!2sde" width="340" height="340" loading="lazy"></iframe>}
        {node.pointer === '@berlin@' && <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d310846.4201157345!2d13.144555537630955!3d52.506513275044156!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a84e373f035901%3A0x42120465b5e3b70!2sBerlin!5e0!3m2!1sen!2sde!4v1680109964905!5m2!1sen!2sde" width="340" height="340" loading="lazy"></iframe>}
      </div>
    );
  }


  return (
    <div id='controls' style={{ textAlign: "center" }}>

      <div style={{ position: "fixed", zIndex: "5" }}>
        <div
          style={{ width: "48px", height: "48px", margin: "40px 24px 8px 24px", borderRadius: "50%", cursor: "pointer", opacity: view === "LOCA" ? "0.5" : "1" }}
          onClick={() => { setView('GENE') }}
        >
          <img src={geneIcon} style={{ width: "100%" }} />
        </div>


        <div
          style={{ width: "48px", height: "48px", margin: "24px 24px 8px 24px", borderRadius: "50%", cursor: "pointer", opacity: view === "GENE" ? "0.5" : "1" }}
          onClick={() => { setView('LOCA') }}
        >
          <img src={locaIcon} style={{ width: "100%" }} />
        </div>

      </div>


      {/* <div id="back-button" onClick={closeRoots}>
        <i className="fa fa-times" aria-hidden="true"></i>
      </div> */}

      {/* <div id="legend">
        {showingLegend &&
          <div id="legend-content">
            <h2 onClick={handleClick}>legend</h2>
            <div className="legend-line">
              <img src={greyLine} />
              <p>- Blood line</p>
            </div>
            <div className="legend-line">
              <img src={goldLine} />
              <p>- Love line</p>
            </div>

            <h2>controls</h2>
            <p><b>Hover over name</b> - Person info</p>
            <p><b>Hover over line</b> - Relationship info</p>
            <p><b>Left-click name</b> - Highlight</p>
            <p><b>Right-click name</b> - Re-center</p>
            <p><b>Scroll</b> - Zoom</p>
            <p><b>Left drag</b> - Spin</p>
            <p><b>Right drag</b> - Pan</p>

          </div>
        }
        <p id="legend-button" className={showingLegend && 'active'} onClick={toggleLegend}>{'info'}</p>
      </div> */}

      <div id="node-info">
        {!!hoveredNode && nodeInfoInsert(hoveredNode)}
      </div>

      <div id="surnames">
        {showingsurnames &&
          <div 
          className="surnames-content"
          style={{width: "240px"}}
          >
            <h2>{view === "GENE" ? 'names' : 'birthplaces'}</h2>
            {surnameList}
          </div>
        }
        <p
          id="surnames-button"
          className={showingsurnames ? 'active' : ''}
          onClick={toggleSurnames}
          style={{ width: showingsurnames ? "72px" : "240px" }}
        >
          {showingsurnames ? "close" : view === "GENE" ? 'names' : 'birthplaces'}
        </p>
      </div>
    </div >
  )
}

export default Controls;
