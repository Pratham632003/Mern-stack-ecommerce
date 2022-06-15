import React from "react";
import "./Header.css";
import { ReactNavbar } from "overlay-navbar";

function Header() {

  const options = {
    burgerColorHover:"#eb4034",
      logo: "https://library.kissclipart.com/20180909/gqe/kissclipart-e-commerce-icon-clipart-computer-icons-e-commerce-071c4f184e54c155.png",
      logoWidth:"20vmax",
      navColor1:"white",
      logoHoverSize:"10px",
      logoHoverColor:"#eb4034",
      link1Text:"Products",
      link2Text:"About",
      link3Text:"Login",
      link4Text:"Register",
      link1Url:"/products",
      link2Url:"/about",
      link3Url:"/login",
      link4Url:"/register",
      link1Size:"1.3vmax",
      link1Color:"rgba(35 35 350.8)",
      nav1justifyContent:"flex-end",
      nav2justifyContent:"flex-end",
      nav3justifyContent:"flex-start",
      nav4justifyContent:"flex-start",
      link1ColorHover:"#eb4034",
      link1Margin:"1vmax",
      profileIconUrl:"/login",
      profileIconColor:"rgba(35 35 350.8)",
      searchIconColor:"rgba(35 35 350.8)",
      cartIconColor:"rgba(35 35 350.8)",
      profileIconColorHover:"#eb4034",
      searchIconColorHover:"#eb4034",
      cartIconColorHover:"#eb4034",
      cartIconMargin:"1vmax",
  }
  return(
  <div className="header">
    <ReactNavbar {...options}/>
  </div>
  )
}

export default Header;
