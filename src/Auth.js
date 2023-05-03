import React from "react";
import title from './img/tree_app_title.svg';
import styled from "styled-components";


const SubmitButton = styled.button`padding: 16px; width: 100%; text-align: center; background-color: #734266; border: none; color: #FFD9BC; font-size: 24px; border-radius: 8px; cursor: pointer;
&:hover {filter: brightness(1.2);};`


const Auth = ({ handleSubmit, setPassword, error }) => {

    return (
        <div style={{ width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div style={{ width: "600px", backgroundColor: "white", borderRadius: "8px", padding: "40px" }}>
                <img
                    style={{ width: "100%" }}
                    src={title}
                />
                <div>
                    <input
                        style={{ padding: "8px", width: "100%", borderRadius: "8px" }}
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
    )
}

export default Auth;