

import PropTypes from "prop-types"
import { useStaticQuery, graphql, navigate } from "gatsby"
import store from '../redux/store';
import "./layout.css"
import Navbar from './navbar'
import React, { Component , useEffect} from 'react'
import jwt_decode from "jwt-decode";
import setAuthToken from "../utils/setAuthToken";
import { setCurrentUser, logoutUser } from "../actions/authActions";
import { clearProfile } from "../actions/profileActions";
const Layout = ({children}) => {
//   const data = useStaticQuery(graphql`
//   query SiteTitleQuery {
//     site {
//       siteMetadata {
//         title
//       }
//     }
//   }
// `)
useEffect(() => {
  if (localStorage.jwtToken) {
    setAuthToken(localStorage.jwtToken);
    const decoded = jwt_decode(localStorage.jwtToken);
  
    store.dispatch(setCurrentUser(decoded));
  
    //Check for expired token
  
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      store.dispatch(logoutUser());
      store.dispatch(clearProfile());
      window.location.href = "login";
    }
  }
  
}, []);
    return (
        <div>
          <Navbar/>
          <main>{children}</main>
          <footer>
          </footer>
        </div>    
    )
}


Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
