import React, { useState, useContext, useEffect } from "react";
import "../styles/library.scss";
import { AppContext } from "../context";
import {useWindowWidthResize} from "../hooks"
// icons
import {FaPlay} from "react-icons/fa";
import {BsMusicNoteBeamed} from 'react-icons/bs';

function ListItem(props){
const {item} = props;
const [showPlayBtn, setShowPlayBtn] = useState(null);
const {windowWidth} = useWindowWidthResize();
useEffect(() => {
    if(windowWidth >= 768){
        setShowPlayBtn(true)
    }
    else {
        setShowPlayBtn(false)
    }
}, [item, windowWidth])
    return(
        <li 
        className = "YL_catCardli"
        onClick={(e) => {}}
        >
        <div className = "YL_CardliImageCon"
            
        >
            {
                item.images.length > 0 ? 
                <img src = {item.images[0].url} alt ="album"/>
                :
                <BsMusicNoteBeamed/>
            }
            {/* play Button for small device */}
                {showPlayBtn ?
                    <button 
                        className = "YL_CardliImagePlayBTN"
                        onClick = {(e) => {}}
                        >
                        <FaPlay/>
                    </button>
                : null
            }
        </div>
        {/* Playlist Name */}
        <h3 className = "YL_CatCardliTitle">{item.name}</h3>
        {/* Playlist BY */}
        <p className = "YL_CatCardliDescription">By {item.owner.display_name}</p>
    </li>
    )

}
export default function YourLibrary(){
    const {
        playlists,
        dispatch
    } = useContext(AppContext)
    const [playlistsData, setPlaylistsData]=useState(null);


    useEffect(() => {
        if(playlists){
            setPlaylistsData(playlists)
        }
    }, []);
    if(playlists){
        console.log("Playlists", playlists)
        console.log("playlistsData", playlistsData)
    }
    return(
        <div className = "YL_libraryMainContainer">
        <h2 className = "YL_libTitle">
            Playlists
        </h2>
        <ul className = "YL_UL"> 

            {/* LIKED SONGS LIST */}
            <li 
                key ={"likedSongs"}
                className = "YL_liLikedSongs"
                >
                    

            </li>


            { playlistsData && playlistsData.length > 0 &&
                playlistsData.map((item, index) => {
                    return <ListItem 
                            key = {index}
                            item = {item}
                    />
                })
            }
        </ul>
    </div>)
}