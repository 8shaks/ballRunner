import React, { Component } from 'react'
import {  Link } from "gatsby";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { clearProfile } from "../../actions/profileActions";
import { logoutUser, resetErrors } from "../../actions/authActions";
import LoginModal from '../loginSignup/login'
import SignupModal from '../loginSignup/signup'
import navbarStyles from './navbar.module.css'
class Navbar extends Component {
   constructor(props){
       super(props)
       this.state={
           navbarClass : navbarStyles.navbar,
           url:'',
           login:false,
           signUp:false
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
    this.props.resetErrors()
}
signUp = () =>{
    this.setState(prevState => ({
        signUp: !prevState.signUp
    }))
    this.props.resetErrors()
}

render() {
    const { isAuthenticated, user } = this.props.auth;
    let navbarOptions, loginModal, signupModal;
    if (this.state.login){
        loginModal = <LoginModal loginToggle = {this.login}/>
    }else{
        loginModal = null
    }
    if (this.state.signUp){
        signupModal = <SignupModal signupToggle = {this.signUp}/>
    }else{
        signupModal = null
    }
    navbarOptions=(                
        <ul>
        <li><a onClick={this.login}>Login</a></li>
        <li><a onClick={this.signUp}>Sign up</a></li>
        {/* <li ><Link to='/contact' onClick={this.newPage}>Contact Us</Link></li> */}
        {/* <li ><a>About Us</a></li> */}
        </ul>)
    return (
        <div className={this.state.navbarClass}> 
            <Link to='/' onClick={this.newPage} className={navbarStyles.navbar_logo}>BallRunner</Link>
            <div className={navbarStyles.menu_icon} onClick={this.expandMenu} style={{color:'white'}}><div className={navbarStyles.icon_line}/><div className={navbarStyles.icon_line}/><div className={navbarStyles.icon_line}/></div>
                {navbarOptions}
            {loginModal}
            {signupModal}
        </div>
    )
}
}
Navbar.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    resetErrors: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
  };
  const mapStateToProps = state => ({
    auth: state.auth
  });
  export default connect(
    mapStateToProps,
    { logoutUser, clearProfile, resetErrors }
  )(Navbar);
  