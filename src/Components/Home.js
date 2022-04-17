import React from "react";

// importing stylesheet
import "../styles/Home.scss"



/* --Data */

const HomeData = [
    {
        title: "artists you like",
        artists: [
            {
                name: "artist Name",
                artisttitle: "artitst title",
                description: "description here"
            },
            {
                name: "artist Name",
                artisttitle: "artitst title",
                description: "description here"
            }
        ]
    }
]


/* Artist Card */
function CommonCard(props){
    return(
        <div className = "H_cardContnainer commonCardContainer">
            <img src = "" alt =""/>
            {/* Artist Card */}
            {props.artist ? <h2 className="H_artistName">{props.artist}</h2>: null }
            <h2 className = "H_cardTitle">{props.name}</h2>
            <p className="H_cardDescription">{props.description}</p>
        </div>
    )

}


export default function Home(){
    return(
        <div className="Home_mainContainer commonMainContainer">
            {HomeData.map(({}, index) => {
              
                return (
                    <div  key= {index.toString()} className = "H_rowContainer">
                        <h1 className = "H_title">{}</h1>

                        {/* Check for the length */}
                        <div className="H_cardContainer">
                            <CommonCard 
                                image =" link"
                                name = "some Name"
                                description = "some description"
                            />
                        </div>

                    </div>
                )
            })}
        </div>
    )
}