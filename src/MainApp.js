import React from "react";
import { Link, Outlet } from "react-router-dom";


export default function MainApp(){
    return( 
        <div>
                <header className = "Main_header">
                    {<h1>logo</h1>}
                    {<p>Account details</p>}
                </header>
                <nav className = "Main_nav">
                    <ul>
                        <li>
                            <Link to="home">Home</Link>
                        </li>
                        <li>
                            <Link to="search">Search</Link>
                        </li>
                        <li>
                            <Link to="yourlibrary">Your library</Link>
                        </li>
                    </ul>
                </nav>

                <div className = "Main_outletContainer">
                    <Outlet/>
                </div>
        </div>
    )
}
