import React, {useState} from "react";

import {FaPlay, FaPause} from "react-icons/fa"


// scss style
import "../styles/Playlist.scss"

export default function Playlist(){
    return(
        <div className = "PL_mainContainer">

            {/* TOp DESCRIPTION */}
            <div className="PL_topMainContainer">
                {/* playlist Image */}
                <div className = "PL_topImageContainer">
                    <img src ="" alt="Playlist_cover"/>
                </div>

                {/* Playlist description */}
                <div className="PL_descriptionContainer">
                    <p className="PL_desTitle">title</p>
                    <h2 className="PL_desPlaylistName">MyPlaylist 1</h2>
                    <p className="PL_desProfileName">Orzoon Kunwar</p>
                    <p className="PL_desSongNo">2 songs</p>
                    <p className="PL_desSongsLength">3 min 22 sec</p>
                </div>
            </div>

             {/* Main PLayButton */}
             <div className="PL_mainPlayButtonCont">
                    <button 
                        className="PL_mainPlayButton"  

                    >
                        <FaPlay/>
                    </button>
            </div>


            <div className = "PL_PlaylistsDIV">
                {/* search option */}
                
                {/* list of albums */}
            </div>
        </div>
    )
} 