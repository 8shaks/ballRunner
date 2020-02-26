import React, { Component } from 'react'
import {  Link } from "gatsby";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { clearProfile } from "../../actions/profileActions";
import { logoutUser } from "../../actions/authActions";
import LoginModal from '../loginSignup/login'
import navbarStyles from './navbar.module.css'
class Navbar extends Component {
   constructor(props){
       super(props)
       this.state={
           navbarClass : navbarStyles.navbar,
           url:'',
           login:false
       }
   }

expandMenu = () => {
    if(this.state.navbarClass === navbarStyles.navbar)
    this.setState({navbarClass:navbarStyles.navbar_activated})
    else{
        this.setState({navbarClass:navbarStyles.navbar})
    }
}
newPage = () => {
    this.setState({navbarClass:navbarStyles.navbar})
}

login = () =>{
    this.setState(prevState => ({
        login: !prevState.login
    }))
}
render() {
    const { isAuthenticated, user } = this.props.auth;
    let navbarOptions, loginModal, registerModal;
    if (this.state.login){
        loginModal = <LoginModal loginToggle = {this.login}/>
    }else{
        loginModal = null
    }
    navbarOptions=(                
        <ul>
        <li><a onClick={this.login}>Login</a></li>
        <li><Link to='/services' onClick={this.newPage}>Sign up</Link></li>
        <li ><Link to='/contact' onClick={this.newPage}>Contact Us</Link></li>
        {/* <li ><a>About Us</a></li> */}
        </ul>)
    return (
        <div className={this.state.navbarClass}> 
            <Link to='/' onClick={this.newPage} className={navbarStyles.navbar_logo}>inkDown</Link>
            <div className={navbarStyles.menu_icon} onClick={this.expandMenu} style={{color:'white'}}><div className={navbarStyles.icon_line}/><div className={navbarStyles.icon_line}/><div className={navbarStyles.icon_line}/></div>
                {navbarOptions}
            {loginModal}
        </div>
    )
}
}
Navbar.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
  };
  const mapStateToProps = state => ({
    auth: state.auth
  });
  export default connect(
    mapStateToProps,
    { logoutUser, clearProfile }
  )(Navbar);
  