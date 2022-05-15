import React from "react"

import "../styles/loader.scss"


function MainAppLoader(){
    return(<div className = "MA_laoderContainer">
                <div className = "SpinnerContainer">
                    <div id="nest1"></div>
                </div>
            </div>) 

}

function PlaylistLoader(){
    return (
                <div className = "PL_SpinnerContainer">
                    <div id="nest1"></div>
                </div>
    )
}
export {
    MainAppLoader,
    PlaylistLoader
}