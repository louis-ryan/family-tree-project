// Modules
import React, { useState, useEffect, useRef, useCallback } from "react";
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';
import SpriteText from 'three-spritetext';
import { forceCollide } from 'd3-force-3d';

import louAlEu1 from './img/lou_al_eu/lou-al-eu-trip.png';
import louAlEu2 from './img/lou_al_eu/IMG_0249.png';
import louAlEu3 from './img/lou_al_eu/IMG_0306.png';
import louAlEu4 from './img/lou_al_eu/IMG_0308 2.png';

import { setCorrectImg } from "./headshots";

const Graph = ({ d3Data, highlightedFamily, setHighlightedFamily, setHoveredNode, view }) => {


  const [highlights, setHighlights] = useState({
    node: null,
    family: [],
    links: []
  });



  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  const fgRef = useRef();

  useEffect(() => {

    setHighlights({
      node: null,
      family: [],
      links: []
    })

  }, [view])

  // Manage force
  useEffect(() => {
    const force = view === 'GENE' ? 100 : 100
    fgRef.current.d3Force('collide', forceCollide(force));
  });

  // Resize window
  window.onresize = function (event) {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };

  // Camera position
  const positionCamera = useCallback(node => {
    // Aim at node from outside it
    const distance = 350;
    const distRatio = 2 + distance / Math.hypot(node.x, node.y, node.z);
    fgRef.current.cameraPosition(
      { x: node.x * distRatio, y: node.y, z: node.z * distRatio }, // new position
      node, // lookAt ({ x, y, z })
      1200  // ms transition duration
    );
  }, [fgRef]);

  // const cameraDistance = () => {
  //   const distanceRatio = (d3Data.nodes.length/2) * 15;
  //   if (distanceRatio < 450) {
  //     return 450;
  //   } else if (distanceRatio > 900) {
  //     return 2000;
  //   } else {
  //     return distanceRatio;
  //   }
  // }

  const setNodeThreeObject = node => {

    console.log("name: ", node.name)

    // Use a sphere as a drag handle
    const obj = new THREE.Mesh(
      new THREE.SphereGeometry(10),
      new THREE.MeshBasicMaterial({ depthWrite: false, transparent: true, opacity: 0 })
    );

    // Create image sprite
    const imageTexture = new THREE.TextureLoader().load(setCorrectImg(node.name),
      function (texture) {

        const radius = 50; // Set the radius of the circle

        // Create a circular geometry
        const geometry = new THREE.CircleGeometry(radius, 32);

        // Set the position of the geometry's vertices
        geometry.vertices.shift();

        const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 0.5 });
        const mesh = new THREE.Mesh(geometry, material);
        imageContainer.add(mesh);
      },
      function (xhr) {
        console.error('Error loading texture:', xhr);
      }
    );

    const imageMaterial = new THREE.SpriteMaterial({ map: imageTexture });
    const imageSprite = new THREE.Sprite(imageMaterial);
    imageSprite.scale.set(50, 50, 1); // Set size of image sprite
    imageSprite.position.y = 35;

    // Create text sprite
    let name;
    if (node.firstName == '?') {
      name = node.name;
    } else {
      name = `${node.firstName} ${node.surname}`;
    }
    const textSprite = new SpriteText(name);

    // Set text sprite defaults
    const locationSprite = () => {
      textSprite.color = 'white';
      textSprite.backgroundColor = 'none';
      textSprite.borderColor = 'none';
    }

    const coloredSprite = () => {
      textSprite.color = node.color;
      textSprite.backgroundColor = 'none';
      textSprite.borderColor = '#555';
    }

    const greyedSprite = () => {
      textSprite.color = '#3335';
      textSprite.background = 'unset';
      textSprite.borderColor = 'unset';
      imageSprite.visible = false
    }

    // Set text sprite style based on node and highlight state
    if (highlights.node === null) {
      if (highlightedFamily) {
        if (highlightedFamily === node.surname) {
          if (node.surname === "AUS" || node.surname === "EU") {
            locationSprite();
          } else {
            coloredSprite();
          }
        } else {
          greyedSprite();
        }
      } else {
        if (node.surname === "AUS" || node.surname === "EU") {
          locationSprite();
        } else {
          coloredSprite();
        }
      }
    } else {
      if (highlights.family.indexOf(node.id) !== -1) {
        if (node.surname === "AUS" || node.surname === "EU") {
          locationSprite();
        } else {
          coloredSprite();
        }
      } else {
        greyedSprite();
      }
    }

    textSprite.fontFace = "Helvetica";
    textSprite.fontWeight = 400;
    textSprite.textHeight = 8;
    textSprite.borderWidth = 0;
    textSprite.borderRadius = 0;
    textSprite.padding = 4;


    // Create container for image and text sprites
    const container = new THREE.Object3D();
    container.add(imageSprite);
    container.add(textSprite);

    // Position image and text sprites in container
    const imageContainer = new THREE.Object3D();
    imageContainer.position.set(0, 80, 0);
    container.add(imageContainer);
    textSprite.position.set(0, 0, 0);

    // Add container as child of drag handle
    obj.add(container);

    return obj;
  }



  // Light Source
  useEffect(() => {

    // create a point light
    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(0, 0, 10);

    // add the light to the scene
    fgRef.current.scene().add(pointLight);
  })


  // Node label
  const setNodeLabel = node => {

    // Label setup
    let label = `<div class="node-label">`;

    // Gender
    const labelGender = (node.gender === 'M') ? `♂` : `♀`;

    label += `<p><b>${node.yob} - ${node.yod} ${labelGender}</b></p>`;

    return label += '</div>';
  }

  // Node label
  const setNodeInfo = node => {
    setHoveredNode(node);
  }

  // Handle node click
  const showFamily = (d3Data, node, highlights) => {

    // Find family member of clicked node
    const findFamilies = (links, node, highlights) => {
      if (links.source.id == node.id || links.target.id == node.id) {
        let updatedHighlightFamily = highlights.family;
        let updatedHighlightLinks = highlights.links;

        updatedHighlightFamily.push(links.target.id, links.source.id);
        updatedHighlightLinks.push(links.index);

        setHighlights({ node: node, family: updatedHighlightFamily, links: updatedHighlightLinks })
      }
    }

    // None highlighted
    if (highlights.node === null) {
      d3Data.links.filter(links => findFamilies(links, node, highlights));

      // Different node highlighted
    } else if (highlights.node !== node) {
      let tempHighlights = { node: null, family: [], links: [] }
      d3Data.links.filter(links => findFamilies(links, node, tempHighlights));

      // Reset current node
    } else {
      setHighlights({ node: null, family: [], links: [] })
    }

    setNodeInfo(node);
  }

  // Right click
  const handleRightClick = (d3Data, node, highlights) => {
    showFamily(d3Data, node, highlights);
    positionCamera(node);
  }


  // Link label
  const setLinkLabel = link => {


    var sourceStoryEastEurope
    var targetStoryEastEurope

    link.source.tree.forEach((item) => {
      if (item.data === "@STORY-east-europe@") { sourceStoryEastEurope = true }
    })

    link.target.tree.forEach((item) => {
      if (item.data === "@STORY-east-europe@") { targetStoryEastEurope = true }
    })

    // No state change
    switch (link.type) {
      case 'DIV':
        return '<div class="link-label"><p>Divorced</p></div>'
        break;
      case 'MARR':
        if (sourceStoryEastEurope && targetStoryEastEurope) {
          return `
          <div class="link-label">
          <p>Travelled around Eastern Europe in 2013 together</p>
          <img width=80px src=${louAlEu1} />
          <img width=80px src=${louAlEu2} />
          <img width=80px src=${louAlEu3} />
          <img width=80px src=${louAlEu4} />
          </div>
          `;
        } else {
          return '<div class="link-label"><p>Married</p></div>';
        }
        break;
      case 'birth':
        return '<div class="link-label"><p>Birth</p></div>';
        break;
      case 'Natural':
        return '<div class="link-label"><p>Birth</p></div>';
        break;
      case 'Step':
        return '<div class="link-label"><p>Step</p></div>';
        break;
      case 'Adopted':
        return '<div class="link-label"><p>Adopted</p></div>';
        break;
    }
  }

  // Link color
  const setLinkColor = link => {

    return highlights.links.length < 1 ?
      highlightedFamily ?
        'rgba(255, 153, 153, 0.2)' : // Highlighed family exists, mute all links
        (link.sourceType != 'CHIL' && link.targetType != 'CHIL') ?
          'rgba(255, 215, 0, 0.4)' : // Romantic link
          'rgba(255, 153, 153, 0.2)' : // Normal link
      highlights.links.indexOf(link.index) !== -1 ?
        (link.sourceType != 'CHIL' && link.targetType != 'CHIL') ?
          'rgba(255, 215, 0, 0.4)' : // Romantic link
          'rgba(255, 153, 153, 0.2)' : // Normal link
        'rgba(255, 153, 153, 0.02)'; // Normal link
  }

  // Link particles
  const setLinkParticleWidth = link => {
    if (highlights.links.indexOf(link.index) !== -1) {
      return 2;
    } else {
      return 0.1;
    }
  }

  // Remove highlights
  const clearHighlights = () => {
    setHighlights({ node: null, family: [], links: [] });
    setHighlightedFamily();
    setNodeInfo();
  }

  // Add fog
  useEffect(() => {

    let fogNear = 1000;
    let fogFar = 8000;
    if (d3Data.nodes.length < 120) {
      fogNear = 600;
      fogFar = 4000;
    };

    const fogColor = new THREE.Color(0x111111);

    var myFog = new THREE.Fog(fogColor, fogNear, fogFar);
    // var myFogg = new THREE.FogExp2(fogColor, 0.0025);

    fgRef.current.scene().fog = myFog;
  }, []);


  // Add timeline
  useEffect(() => {

    // Get list of fixed Y
    let yRange = d3Data.nodes.map(node => Number(node.fy));

    // Filter our NaN
    yRange = yRange.filter(node => !isNaN(node) && node);

    // TIMELINE
    const highestY = Math.max.apply(Math, yRange);
    const lowestY = Math.min.apply(Math, yRange);

    //create a blue LineBasicMaterial
    var material = new THREE.LineBasicMaterial({
      color: 0x333333,
      linewidth: 2
    });

    var points = [];
    points.push(new THREE.Vector3(0, lowestY, 0));
    points.push(new THREE.Vector3(0, highestY, 0));

    var geometry = new THREE.BufferGeometry().setFromPoints(points);

    var line = new THREE.Line(geometry, material);

    if (view === 'LOCA') return

    fgRef.current.scene().add(line);

    return () => {
      // Remove the sprites when the component unmounts or when view is set to 'LOCA'
      if (view === 'GENE') {
        fgRef.current.scene().remove(line);
      }
    }
  });

  // Add timeline YEAR
  useEffect(() => {

    // All YOBs
    let years = d3Data.nodes.map(node => Number(node.yob));

    // Filter out NaN
    years = years.filter(year => !isNaN(year));

    // Get list of fixed Y
    let yRange = d3Data.nodes.map(node => Number(node.fy));

    // Filter out NaN
    yRange = yRange.filter(node => !isNaN(node) && node);

    // TIMELINE
    const highestY = Math.max.apply(Math, yRange);
    const lowestY = Math.min.apply(Math, yRange);
    const halfY = (highestY + lowestY) / 2;
    const quarterY = (halfY + lowestY) / 2;
    const threeQuarterY = (halfY + highestY) / 2;


    const earliestYOB = Math.min.apply(Math, years);
    const latestYOB = Math.max.apply(Math, years);
    const halfYOB = parseInt((earliestYOB + latestYOB) / 2);
    const quarterYOB = parseInt((latestYOB + halfYOB) / 2);
    const threeQuarterYOB = parseInt((earliestYOB + halfYOB) / 2);

    // EARLIEST
    let earliest = new THREE.Mesh(
      new THREE.SphereGeometry(100),
      new THREE.MeshBasicMaterial({ depthWrite: false, transparent: true, opacity: 0 }),
    );

    earliest.position.y = highestY + 15;

    let earliestTimeLabel = earliestYOB ? new SpriteText(earliestYOB) : new SpriteText("Earlier");
    earliestTimeLabel.color = '#000000';
    earliestTimeLabel.fontFace = "Helvetica";
    earliestTimeLabel.fontWeight = 800;
    earliestTimeLabel.textHeight = 40;
    earliest.add(earliestTimeLabel);

    // LATEST
    let latest = new THREE.Mesh(
      new THREE.SphereGeometry(100),
      new THREE.MeshBasicMaterial({ depthWrite: false, transparent: true, opacity: 0 }),
    );

    latest.position.y = lowestY - 15;

    let latestTimeLabel = latestYOB ? new SpriteText(latestYOB) : new SpriteText("Later");
    latestTimeLabel.color = '#000000';
    latestTimeLabel.fontFace = "Helvetica";
    latestTimeLabel.fontWeight = 800;
    latestTimeLabel.textHeight = 40;
    latest.add(latestTimeLabel);

    // HALF
    let half = new THREE.Mesh(
      new THREE.SphereGeometry(100),
      new THREE.MeshBasicMaterial({ depthWrite: false, transparent: true, opacity: 0 }),
    );

    half.position.y = halfY;

    let halfTimeLabel = new SpriteText(halfYOB);
    halfTimeLabel.color = '#000000';
    halfTimeLabel.fontFace = "Helvetica";
    halfTimeLabel.fontWeight = 800;
    halfTimeLabel.textHeight = 15;
    half.add(halfTimeLabel);

    // QUARTER
    let quarter = new THREE.Mesh(
      new THREE.SphereGeometry(100),
      new THREE.MeshBasicMaterial({ depthWrite: false, transparent: true, opacity: 0 }),
    );

    quarter.position.y = quarterY;

    let quarterTimeLabel = new SpriteText(quarterYOB);
    quarterTimeLabel.color = '#000000';
    quarterTimeLabel.fontFace = "Helvetica";
    quarterTimeLabel.fontWeight = 800;
    quarterTimeLabel.textHeight = 15;
    quarter.add(quarterTimeLabel);

    // QUARTER
    let threeQuarter = new THREE.Mesh(
      new THREE.SphereGeometry(100),
      new THREE.MeshBasicMaterial({ depthWrite: false, transparent: true, opacity: 0 }),
    );

    threeQuarter.position.y = threeQuarterY;

    let threeQuarterTimeLabel = new SpriteText(threeQuarterYOB);
    threeQuarterTimeLabel.color = '#000000';
    threeQuarterTimeLabel.fontFace = "Helvetica";
    threeQuarterTimeLabel.fontWeight = 800;
    threeQuarterTimeLabel.textHeight = 15;
    threeQuarter.add(threeQuarterTimeLabel);



    if (view === 'LOCA') return

    fgRef.current.scene().add(earliest);
    fgRef.current.scene().add(latest);




    // highestY - lowestY > 300 && fgRef.current.scene().add(half);
    // highestY - lowestY > 450 && fgRef.current.scene().add(quarter);
    // highestY - lowestY > 450 && fgRef.current.scene().add(threeQuarter);

    return () => {
      // Remove the sprites when the component unmounts or when view is set to 'LOCA'
      // if (!fgRef.current) return; // Check if fgRef is available
      if (view === 'GENE') {
        // fgRef.current.scene().add(earliest);
        // fgRef.current.scene().add(latest);
        fgRef.current.scene().remove(earliest);
        fgRef.current.scene().remove(latest);
        // fgRef.current.scene().remove(half);
        // fgRef.current.scene().remove(quarter);
        // fgRef.current.scene().remove(threeQuarter);
      }
    }
  });

  useEffect(() => {
    fgRef.current.controls().enableDamping = true;
    fgRef.current.controls().dampingFactor = 0.3;
    fgRef.current.controls().rotateSpeed = 0.8;
    fgRef.current.controls().screenSpacePanning = true;
  }, [])


  // Create graph
  return <ForceGraph3D
    ref={fgRef}
    graphData={d3Data}

    // Display
    width={width}
    height={height}
    backgroundColor={'#1C242A'}
    showNavInfo={false}

    // Controls
    controlType={'orbit'}
    enableNodeDrag={false}
    onBackgroundClick={clearHighlights}
    onBackgroundRightClick={clearHighlights}

    // Nodes
    nodeLabel={setNodeLabel}
    // onNodeHover={setNodeInfo}
    nodeThreeObject={setNodeThreeObject}
    onNodeClick={node => showFamily(d3Data, node, highlights)}
    onNodeRightClick={node => handleRightClick(d3Data, node, highlights)}

    // LINKS
    linkLabel={setLinkLabel}
    linkColor={setLinkColor}
    linkOpacity={1}
    linkWidth={4}
    linkDirectionalParticles={link => (link.sourceType != 'CHIL' && link.targetType == 'CHIL' && d3Data.nodes.length < 300) ? 8 : 0}
    linkDirectionalParticleWidth={setLinkParticleWidth}
    linkDirectionalParticleSpeed={.001}
  />
}

export default Graph;
