
import logo from "../../assets/logo-horizontal.svg";
import helpIcon from "../../assets/icons/question.svg";
import SearchBar from "../SearchBar/SearchBar";
import classes from "./Header.module.css";
import React, { Component } from "react";
import firebase from 'firebase'
import {getUser, saveUserToDB} from "../../API/user"
import history from "../../utils/history"
var firebaseui = require('firebaseui')
class Header extends Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
    this.handleRedirect = this.handleRedirect.bind(this);
    this.handleCloseSignupWindow = this.handleCloseSignupWindow.bind(this);
    
    // config for firebaseui auth window
    this.uiConfig = {
      callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
          // User successfully signed in.
          // Return type determines whether we continue the redirect automatically
          // or whether we leave that to developer to handle.
          this.setState({user:authResult.user.email, signInWindowActive:false});
          
          sessionStorage.setItem("userEmail", authResult.user.email);
          sessionStorage.setItem("userID", authResult.user.uid);
          getUser(authResult.user.email)
            .catch((err) => {
              saveUserToDB({uid:authResult.user.uid,email: authResult.user.email, files: [], user_since:new Date().toString()})
            })
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
    this.ui = null;
  }
  state = {
    user: null,
    signInWindowActive: false
  }

  componentDidMount() {
    // initialize firebase signin ui
    this.ui =  new firebaseui.auth.AuthUI(firebase.auth());
  }
  
  handleLogin() {
    // activate signin window
    this.ui.start('#firebaseui-auth-container', this.uiConfig);
    this.setState({signInWindowActive: true});
  }
  componentWillUnmount() {
    this.ui.reset();
  }
  handleCloseSignupWindow() {
    // deactivate signin window, ckear firebase auth state
    this.ui.reset();
    this.setState({signInWindowActive: false});
  }
  handleRedirect() {
    history.push('/CMS');
  }

  handleSignOut() {
    this.setState({user:null});
    firebase.auth().signOut();
    this.ui.reset();
    sessionStorage.removeItem("userEmail");
    sessionStorage.removeItem("userID");
  }
  render() {
    let username = this.state.user || sessionStorage.getItem("userEmail");
    if(username) {
      return (
        <div className={classes.Header}>
          <img className={classes.Logo} src={logo} alt="logo" />
          <div className={classes.MiddleArea}>
            {this.props.canvasPage ? <h1>{this.props.graphName ? this.props.graphName: "My New Graph"}</h1> : <SearchBar />}
          </div>     
                <button className={classes.LoginBtn} onClick={this.handleRedirect}>Workspace</button>
                <button className={classes.RegisterBtn} onClick={this.handleSignOut}>Sign Out</button>
  
          <button className={classes.HelpBtn} type="button">
            <img src={helpIcon} alt="help" />
          </button>
  
        </div>
      );
    } else if(!this.state.signInWindowActive){
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
    } else {
      return (
      <div className={classes.Header}>
      <img className={classes.Logo} src={logo} alt="logo" />
      <div className={classes.MiddleArea}>
        {this.props.canvasPage ? <h1>My New Graph</h1> : <SearchBar />}
      </div>     

        <button className={classes.LoginBtn} onClick={this.handleCloseSignupWindow}>Cancel Login</button>
      

      <button className={classes.HelpBtn} type="button">
        <img src={helpIcon} alt="help" />
      </button>

    </div>
      );
    }

  }
}

export default Header;
