
import logo from "../../assets/logo-horizontal.svg";
import helpIcon from "../../assets/icons/question.svg";
import SearchBar from "../SearchBar/SearchBar";
import classes from "./Header.module.css";
import React, { Component } from "react";
import firebase from 'firebase'
import { auth } from "firebase-admin";
import {useHistory} from "react-router-dom"
import history from "../../utils/history"
var firebaseui = require('firebaseui')
class Header extends Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
    this.handleRedirect = this.handleRedirect.bind(this);
  }
  state = {
    user: null
  }
  
  handleLogin() {
    var uiConfig = {
      callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
          // User successfully signed in.
          // Return type determines whether we continue the redirect automatically
          // or whether we leave that to developer to handle.
          console.log(authResult)
          this.setState({user:authResult.user.email});
          sessionStorage.setItem("user", authResult.user.email)
          document.getElementById('firebaseui-auth-container').style.display = 'none';
          return false;
        }.bind(this),
        uiShown: function () {
          // The widget is rendered.
          // Hide the loader.
          document.getElementById('loader').style.display = 'none';

        }
      },
      // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
      signInFlow: 'popup',
      signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ]
    };
    var ui = new firebaseui.auth.AuthUI(firebase.auth());
    ui.start('#firebaseui-auth-container', uiConfig);
  }
  handleRedirect() {
    history.push('/CMS');
  }

  handleSignOut() {
    this.setState({user:null});
    firebase.auth().signOut();
    sessionStorage.removeItem("user");
  }
  render() {
    console.log(this.state.user)
    let username = this.state.user || sessionStorage.getItem("user");
    if(username) {
      return (
        <div className={classes.Header}>
          <img className={classes.Logo} src={logo} alt="logo" />
          <div className={classes.MiddleArea}>
            {this.props.canvasPage ? <h1>My New Graph</h1> : <SearchBar />}
          </div>     
                <button className={classes.LoginBtn} onClick={this.handleRedirect}>Workspace</button>
                <button className={classes.RegisterBtn} onClick={this.handleSignOut}>Sign Out</button>
  
          <button className={classes.HelpBtn} type="button">
            <img src={helpIcon} alt="help" />
          </button>
  
        </div>
      );
    } else {
      return (
        <div className={classes.Header}>
          <img className={classes.Logo} src={logo} alt="logo" />
          <div className={classes.MiddleArea}>
            {this.props.canvasPage ? <h1>My New Graph</h1> : <SearchBar />}
          </div>     

            <button className={classes.LoginBtn} onClick={this.handleLogin}>Login/Sign Up</button>
          
  
          <button className={classes.HelpBtn} type="button">
            <img src={helpIcon} alt="help" />
          </button>
  
        </div>
      );
    }

  }
}

export default Header;
