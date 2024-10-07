import React from "react"
import { Link } from "react-router-dom"
import "./header.css"
const Header = () => {
  return (
    <header>
      <div className="logo">Learn Cort</div>

      <div className="link">
        <Link to={"/"}>Home</Link>
        <Link to={"/courses"}>Courses</Link>
        <Link to={"/about"}>About</Link>
        <Link to={"/account"}>Account</Link>
        
      </div>
    </header>
  )
}

export default Header