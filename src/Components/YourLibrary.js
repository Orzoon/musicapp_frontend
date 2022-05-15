import React, { useState, useContext, useEffect} from "react";
import {useNavigate} from "react-router-dom"
import "../styles/library.scss";
import { AppContext } from "../context";
import {useWindowWidthResize} from "../hooks"
// icons
import {FaPlay,FaHeart} from "react-icons/fa";
import {BsMusicNoteBeamed} from 'react-icons/bs';

function ListItem(props){
const {item, showPlayBtn, navigate} = props;
useEffect(() => {
}, [item, showPlayBtn])
    return(
        <li 
        className = "YL_catCardli"
        onClick={(e) => {
            navigate(`/app/playlist/${item.id}`)
        }}
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
        setNavOpen,
        playlists,
        likedSongs,
        dispatch
    } = useContext(AppContext);
    const navigate = useNavigate()
    const {windowWidth} = useWindowWidthResize();
    const [playlistsData, setPlaylistsData]=useState(null);
    const [songsNo, setSongsNo] = useState(null)
    const [showPlayBtn, setShowPlayBtn] = useState(null)


    useEffect(() => {
        setNavOpen(false)
        if(playlists){
            setPlaylistsData(playlists);
            if(likedSongs){
                const _noOfSongs = likedSongs.total
                setSongsNo(_noOfSongs)
            }
        }
        if(windowWidth >= 768){
            setShowPlayBtn(true)
        }else {
            setShowPlayBtn(false)
        }
    }, [windowWidth, playlists,likedSongs])
    return(
        <div className = "YL_libraryMainContainer">
        <h2 className = "YL_libTitle">
            Playlists
        </h2>
        <ul className = "YL_UL"> 

            {/* LIKED SONGS LIST */}
            <li 
                key ={"likedSongs"}
                onClick = {(e) => {
                    navigate(`/app/playlist/likedsongs`)
                }}
                className = "YL_liLikedSongs"
                >
                
                <div className = "YL_CardliImageCon">
                    <FaHeart/>
                </div>
                {/* Playlist Name */}
                <h3 className = "YL_CatCardliTitle">Liked Songs</h3>
                {/* Playlist BY */}
                <p className = "YL_CatCardliDescription">{songsNo ? songsNo : "0"} liked songs</p>
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

            </li>


            { playlistsData && playlistsData.length > 0 &&
                playlistsData.map((item, index) => {
                    return <ListItem 
                            key = {index}
                            item = {item}
                            showPlayBtn = {showPlayBtn}
                            navigate = {navigate}
                    />
                })
            }
        </ul>
    </div>)
}