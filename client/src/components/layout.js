

import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"
import { Provider } from "react-redux";
import store from '../store';
import jwt_decode from "jwt-decode";
import setAuthToken from '../utils/setAuthToken'
import { setCurrentUser, logoutUser } from "../actions/authActions"
import { clearProfile } from "../actions/profileActions";
import "./layout.css"
import Navbar from './navbar'
const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)
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
  return (
    <Provider store={store}>
      <Navbar/>
      <main>{children}</main>
      <footer>

      </footer>
    </Provider>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
