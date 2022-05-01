import React, {useEffect, useState} from "react";
import {Link, useParams, useNavigate} from "react-router-dom";
import {FaPlay} from "react-icons/fa"


function ListItems({item, title, homeID, linkTitle}){
    const [artistsNames, setArtistsNames] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        if(title && title === "Fresh New Music"){
            const artistArray = item.artists;
            const names = artistArray.map((artistObj, index) => {
                return artistObj.name
            })

            const combinedNames = names.join(",")
            setArtistsNames(combinedNames)
        }
    }, [])


    function toPlaylistHandler(){
        const link = `/app/playlist/${item.uri}`
        navigate(link)
    }
    return(
        <li className = "H_catCardli">
            <div className = "H_CardliImageCon">
                <img src = {item.images[0].url} alt ="album image"/>
                {/* play Button for small device */}

                {homeID === linkTitle ? 
                    <button 
                        className = "H_CardliImagePlayBTN"
                        onClick = {(e) => {toPlaylistHandler()}}
                        >
                        <FaPlay/>
                    </button>
                    : null
                }
            </div>

            <h3 className = "H_CatCardliTitle">{item.name}</h3>
            {/* Fresh New Music Artists Names */}
            {title === "Fresh New Music" ?
            <p className = "H_CatCardliDescription">{artistsNames}</p>

            :<p className = "H_CatCardliDescription">{item.description}</p>
            }

        </li>
    ) 
}

//-> RECENTLY PLAYED AND FRESH NEW MUSIC


function CommonHomeCard({title, items}){
    const {homeID} = useParams();
    const [linkTitle, setLinkTitle] = useState("");
    useEffect(() => {
        if(!title) return
        const _title = title.split(" ").join("").toLowerCase();
        setLinkTitle(_title)
    }, [])
    {/* fix this later */}
    if(title==="Recently Played"){
        return null
    }
    // Workout Mood Chill
    return(
        <>
            <div className = "H_catTitleViewAllCont">
                <h2 className = "H_categoryTitle">{title}</h2>
                {homeID === linkTitle ? 
                    null
                    :
                    <Link to={`/app/home/${linkTitle}`} className="H_categoryViewAll">see all</Link>
                }
            
            </div>
            <ul className = "H_categoryUL">
                {items && items.map((item, index) => {
                    return( 
                        <ListItems 
                        title = {title}
                        key = {item.id} 
                        item = {item}
                        homeID = {homeID}
                        linkTitle = {linkTitle}
                    />)
                })}

            </ul>
        </>
    )
}

export {
    CommonHomeCard,
}
