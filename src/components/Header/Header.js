import React from "react";
import logo from "../../assets/logo-horizontal.svg";
import helpIcon from "../../assets/icons/question.svg";
import SearchBar from "../SearchBar/SearchBar";
import classes from "./Header.module.css";

const Header = (props) => (
  <div className={classes.Header}>
    <img className={classes.Logo} src={logo} alt="logo" />
    <div className={classes.MiddleArea}>
      {props.canvasPage ? <h1>My New Graph</h1> : <SearchBar />}
    </div>
    <button className={classes.LoginBtn}>Login</button>
    <button className={classes.RegisterBtn}>Register</button>
    <button className={classes.HelpBtn} type="button">
      <img src={helpIcon} alt="help" />
    </button>
  </div>
);

export default Header;
