import React, {useContext} from "react";
import { AppContext } from "../context";


// importing subHome components
import { CommonHomeCard } from "../subComponents/subHome";
// importing stylesheet
import "../styles/Home.scss"

export default function Home(){
    const {home: homeData} = useContext(AppContext)
    return(

        <div className="H_mainContainer">
            {homeData && homeData.map((homeDataObject, index) => {
                {/* Switch between categories */}
               return(
                   <div className = "H_categoryContainer" key = {index}>
                       <CommonHomeCard 
                        title = {homeDataObject.hometitle}
                        items = {homeDataObject.tracks}
                        />
                   </div>
               )
            })}

        </div>
    )
}