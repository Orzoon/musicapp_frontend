import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";



function ListItems({item, title}){
    const [artistsNames, setArtistsNames] = useState("");
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
    return(
        <li className = "H_catCardli">
            <div className = "H_CardliImageCon">
                <img src = {item.images[0].url} alt ="album image"/>
                {/* play Button for small device */}
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
    {/* fix this later */}
    if(title==="Recently Played"){
        return null
    }
    // Workout Mood Chill
    return(
        <>
            <div className = "H_catTitleViewAllCont">
                <h2 className = "H_categoryTitle">{title}</h2>
                <Link to="#" className="H_categoryViewAll">see all</Link>
            </div>
            <ul className = "H_categoryUL">

                {items && items.map((item, index) => {
                    if(index > 1){
                        return null
                    }

                    return( 
                        <ListItems 
                        title = {title}
                        key = {item.id} 
                        item = {item}
                    />)
                })}

            </ul>
        </>
    )
}


export {
    CommonHomeCard
}
