// src/context/SpinningContext.js
import { createContext, useState } from "react";

export const SpinningContext = createContext();

export const SpinningProvider = ({ children }) => {
    const [spinning, setSpinning] = useState(false);

    return (
        <SpinningContext.Provider value={{ spinning, setSpinning }}>
            {children}

            {spinning && (
                <div
                    className="spinner"
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        background: "rgba(0, 0, 0, 0.45)",
                        zIndex: 9999
                    }}
                >
                    <spin className="loader" />
                </div>
            )}        </SpinningContext.Provider>
    );
};
