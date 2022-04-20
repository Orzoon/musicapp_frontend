import React from "react";
import { Outlet } from "react-router-dom";



// directly displaying playlist --->
// return to home if no playlis id
export default function PlaylistOutlet(){
    return <>
        <Outlet/>
    </>
}