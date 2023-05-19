import React from "react";
import title from './img/tree_app_title.svg';
import world from './img/family_tree_world.svg';
import styled from "styled-components";


const SubmitButton = styled.button`padding: 16px; width: 100%; text-align: center; background-color: #1C242A; border: none; color: white; font-size: 24px; cursor: pointer;
&:hover {filter: brightness(1.2);};`


const Auth = ({ handleSubmit, setPassword, error }) => {

    return (
        <>

            <div style={{ position: "absolute", zIndex: "0", width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden" }}>


                <div style={{ width: "1000px", height: "1000px", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center" }} >
                    <div style={{ width: "520px", height: "520px", backgroundColor: "white", borderRadius: "50%", filter: "blur(80px)" }} />
                </div>

            </div >


            <div style={{ position: "absolute", zIndex: "1", width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>



                <img id="world_illustration" style={{ zoom: "0.7" }} src={world} />


            </div >

            <div style={{ position: "absolute", zIndex: "2", width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>


                <div style={{ width: "800px", height: "800px", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center" }} >
                    <div style={{ width: "480px", height: "480px", backgroundColor: "black", borderRadius: "50%", filter: "blur(40px)", opacity: "50%" }} />
                </div>

            </div >

            <div style={{ position: "absolute", zIndex: "3", width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>

                <div style={{ width: "280px", backgroundColor: "white", padding: "16px", opacity: "0.9" }}>
                    <h2>Family Tree App</h2>
                    <div>
                        <input
                            style={{ padding: "8px", width: "100%" }}
                            placeholder="you need a password..."
                            type="password"
                            onChange={(e) => { setPassword(e.target.value) }}
                        />
                        <div style={{ height: "4px" }} />
                        <SubmitButton onClick={() => handleSubmit()}>Submit</SubmitButton>
                    </div>

                    <div style={{ color: "#DE869F" }}>{error}</div>

                </div>
            </div >
        </>
    )
}

export default Auth;