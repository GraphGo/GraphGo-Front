import React, { useContext } from 'react'
import { AuthContext } from '../../API/auth'
import {db, auth} from '../../API/db'
import Header from '../../components/Header/Header'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase';

const Login = ({history}) => {


    const uiConfig = {
        // Popup signin flow rather than redirect flow.
        signInFlow: 'redirect',
        signInSuccessUrl: '/CMS',
        // We will display Google and Facebook as auth providers.
        signInOptions: [
            firebase.auth.EmailAuthProvider.PROVIDER_ID
        ],
        signInCallbacks: [
            
        ]
    }

    const redirectSignup = ()=>{
        // redirect sign up 
    }

    const handleLogin = (event) => {

    }

    return (
        <>
            <Header />
            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
        </>
    )

}

export default Login