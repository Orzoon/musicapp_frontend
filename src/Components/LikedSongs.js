import React, {useContext, useEffect, useState} from 'react';
import { AppContext } from "../context";

//icons
import {FaHeart} from "react-icons/fa";


import "../styles/likedsongs.scss"
export default function LikedSongs(){
    const { likedSongs,
            user, 
            dispatch} = useContext(AppContext);
    
    const [titleData, setTitleData] = useState(null);
    const [songsList, setSongsList] = useState(null);
    
    useEffect(() => {
        if(likedSongs && user){
            const _titleData = {
                title: "Liked Songs",
                imageArray: user.images, // --array--uri
                display_name: user.display_name,
                totalSongs: likedSongs.total
            }
            setTitleData(_titleData)
            setSongsList(likedSongs.items)
            // console.log("user", user)
            // console.log("likedSONgs", likedSongs)
        }
    }, [likedSongs, user])

    if(!titleData) return null;

    {/*RESEMBLES PLAYLIST TOP CONTAINER*/}
    return(
        <div className = "LK_mainContainer">
            {/* TOp DESCRIPTION */}
            <div className="LK_topMainContainer">
                {/* playlist Image */}
                <div className = "LK_topImageContainer">
                        <div className = "LK_topImageIconContainer">
                            <FaHeart/>
                        </div>
                </div>

                {/* Playlist description */}
                <div className="LK_descriptionContainer">
                    <p className="LK_desTitle">Playlist</p>
                     <h2 className="LK_desPlaylistName">Liked Songs</h2> 
                     <p className="LK_desProfileName">{titleData.display_name}</p> 
                    <p className="LK_desSongNo">{ 
                        titleData && titleData.totalSongs.length === 1 ? "1 liked song"  
                        :titleData.totalSongs.length > 1 ? `${titleData.totalSongs.length} liked Songs`
                        : titleData.totalSongs === null ? "0 liked songs"
                        : "0 liked songs"
                    } </p>
                </div>
            </div>
        </div>
    )
}