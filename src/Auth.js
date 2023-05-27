import React, { useState, useEffect, useRef } from "react";
import world from './img/plain_world.svg';
import humans from './img/human_objects.svg';
import shadows from './img/shadows.svg';
import title from './img/generations_title.svg';

import themeSong from './audio/agispolis.mp3';
import success from './audio/success.mp3';
import failure from './audio/failure.mp3';

import styled from "styled-components";


const SubmitButton = styled.button`padding: 16px; width: 100%; text-align: center; background-color: #1C242A; border: none; color: white; font-size: 24px; cursor: pointer;
&:hover {filter: brightness(1.2);};`


const Auth = ({ password, setPassword, setUnlocked, error, setError }) => {

    const imgArr = [
        'https://i.etsystatic.com/5871846/r/il/95bd38/3583271119/il_fullxfull.3583271119_7lgj.jpg',
        'https://images.ctfassets.net/kcmyw5u53voi/kkK9hSrzSa4nHQBZzPMGE/d9e35aa2f74b3218b3c721f37796288f/2612850-max.jpg?q=80&w=1800',
        'https://www.facinghistory.org/sites/default/files/styles/standard_hero_article_680_534_2x/public/2022-06/Holocaust_AuschwitzShoeMemorial_%20FH229698.webp?h=c9f93661&itok=OzaF-7fh',
        'https://www.nla.gov.au/sites/default/files/styles/wide/public/argyle_cut_nla.obj-152602341-ac_website_size.jpg?itok=MAPbVCjY',
        'https://www.exberliner.com/wp-content/uploads/2023/03/image.png',
        'https://upload.wikimedia.org/wikipedia/commons/4/4a/1940_-_German_paratroopers_above_the_neighborhood_of_Bezuidenhout_in_The_Hague.jpg',
        'https://upload.wikimedia.org/wikipedia/commons/b/b5/Methodist_Church%2C_Amiens%2C_circa_1920.jpg'
    ]

    const [init, setInit] = useState(0)

    const [leftVal, setLeftVal] = useState(0)
    const [leftImage, setLeftimage] = useState('')

    const [rightVal, setRightVal] = useState(3)
    const [rightImage, setRightimage] = useState('')

    const [inputVis, setInputVis] = useState(false)


    console.log("input vis: ", inputVis)

    const audioRef = useRef(null);
    const successRef = useRef(null)
    const failureRef = useRef(null)


    const handleStart = () => {

        if (password === "Gonzo23") {
            audioRef.current.pause();
            setTimeout(() => {
                setUnlocked(true)
            }, 1000)

        } else if (password === "") {
            failureRef.current.play();
            setError("errm... you didn't write anything")
        } else {
            failureRef.current.play();
            setError("wrong password")
        }
        setTimeout(() => { setError("") }, 3000)

    }

    /**
 * Submit Auth form on pressing enter
 */
    useEffect(() => {
        function handleKeyPress(event) { if (event.key === 'Enter') handleStart() }
        document.addEventListener('keydown', handleKeyPress);
        // Cleanup function to remove the event listener when the component unmounts
        return () => { document.removeEventListener('keydown', handleKeyPress); };
    })

    useEffect(() => {
        const intervalL = setInterval(() => {
            setLeftVal((prev) => {

                if (prev < imgArr.length - 1) {
                    return prev + 1
                } else {
                    return 0
                }
            })
        }, 20000);

        return () => {
            clearInterval(intervalL);
        };
    }, []);


    useEffect(() => {

        setTimeout(() => {
            const intervalR = setInterval(() => {
                setRightVal((prev) => {

                    if (prev < imgArr.length - 1) {
                        return prev + 1
                    } else {
                        return 0
                    }
                })
            }, 20000);

            return () => {
                clearInterval(intervalR);
            };
        }, 15000)

    }, []);


    useEffect(() => {
        imgArr.map((img, i) => {
            if (i === leftVal) {
                setLeftimage(img)
            }
        })
    })

    useEffect(() => {
        imgArr.map((img, i) => {
            if (i === rightVal) {
                setRightimage(img)
            }
        })
    })


    useEffect(() => {
        setTimeout(() => {
            setInputVis(true)
        }, 3000)
    })


    useEffect(() => {
        if (!init) return
        audioRef.current.play();
    }, []);

    if (init === 0) {
        return (
            <>
                <div style={{ position: "absolute", zIndex: "0", width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <img style={{ zoom: "0.7" }} src={title} />
                </div >

                <div style={{ position: "absolute", zIndex: "1", width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <div style={{ marginTop: "320px" }}>
                        <h4 style={{ color: "white", fontStyle: "italic", textAlign: "center", fontWeight: "200" }}>{'An interactive family tree'}</h4>
                        <button
                            style={{ width: "240px", padding: "16px" }}
                            onClick={() => { setInit(1) }}
                        >
                            START
                        </button>
                    </div>
                </div >
            </>
        )

    }


    if (init === 1) {

        return (
            <>
                <audio ref={audioRef} autoPlay>
                    <source src={themeSong} type="audio/mpeg" />
                </audio>
                <audio ref={successRef}>
                    <source src={success} type="audio/mpeg" />
                </audio>
                <audio ref={failureRef}>
                    <source src={failure} type="audio/mpeg" />
                </audio>

                <div style={{ position: "absolute", zIndex: "0", width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden", perspective: "1000px", transformStyle: "preserve-3d", }}>
                    <div style={{ width: "50%", height: "100%", display: "flex", alignItems: "center", justifyContent: "right", transform: "rotateY(100deg)" }}>
                        <img className="slide_left" style={{ height: "240px" }} src={leftImage} />
                    </div>
                    <div style={{ width: "50%", height: "100%", display: "flex", alignItems: "center", justifyContent: "left", transform: "rotateY(260deg)" }}>
                        <img className="slide_right" style={{ height: "240px" }} src={rightImage} />
                    </div>
                </div >

                <div style={{ position: "absolute", zIndex: "1", width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
                    <div id="halo" style={{ width: "10000px", height: "10000px", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center" }} >
                        <div style={{ width: inputVis ? "400px" : "0px", height: inputVis ? "400px" : "0px", transitionDelay: "6s", backgroundColor: "white", borderRadius: "50%", filter: "blur(80px)" }} />
                        <div style={{ position: "absolute", zIndex: "1", width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
                            <div style={{ width: "10000px", height: "10000px", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center" }} >
                                <div style={{ width: inputVis ? "460px" : "0px", height: inputVis ? "460px" : "0px", transitionDelay: "6s", backgroundColor: "white", borderRadius: "50%", filter: "blur(20px)" }} />
                            </div>
                        </div >

                    </div>
                </div >


                <div id="world_illustration" style={{ position: "absolute", zIndex: "2", width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", opacity: "0.9", filter: inputVis ? "brightness(1)" : "brightness(0.5)" }}>
                    <img style={{ zoom: "0.6" }} src={world} />
                    <div style={{ position: "absolute", zIndex: "3", width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <img style={{ zoom: "0.6", opacity: inputVis ? "1" : "0", transform: inputVis ? "scale(1)" : "scale(1.5)", transitionDuration: "3s" }} src={humans} />
                    </div >
                    <div style={{ position: "absolute", zIndex: "4", width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <img style={{ zoom: "0.6", opacity: inputVis ? "0.3" : "0", transitionDelay: "6s" }} src={shadows} />
                    </div >
                </div >



                <div style={{ position: "absolute", zIndex: "5", width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <div style={{ width: "8000px", height: "8000px", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center" }} >
                        <div style={{ width: inputVis ? "420px" : "0px", height: inputVis ? "420px" : "0px", backgroundColor: "black", borderRadius: "50%", filter: "blur(40px)", opacity: "0.7", transitionDelay: "6s" }} />
                    </div>
                </div >

                <div style={{ position: "absolute", zIndex: "6", width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>

                    <div style={{ width: "280px", padding: "16px", opacity: inputVis ? "0.8" : "0", transitionDuration: "3s" }}>
                        <div>
                            <input
                                style={{ padding: "8px", width: "100%" }}
                                placeholder="you need a password..."
                                type="password"
                                onChange={(e) => { setPassword(e.target.value) }}
                            />
                            <div style={{ height: "4px" }} />
                            <SubmitButton onClick={() => handleStart()}>Submit</SubmitButton>
                        </div>

                        <div style={{ color: "#DE869F" }}>{error}</div>

                    </div>
                </div >
            </>
        )
    }



}

export default Auth;