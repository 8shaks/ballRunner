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
    this.setState({navbarClass:navbarStyles.navbar})
}
signUp = () =>{
    this.setState(prevState => ({
        signUp: !prevState.signUp
    }))
    this.props.resetErrors()
    this.setState({navbarClass:navbarStyles.navbar})
}
logout = () =>{
    this.props.logoutUser()
    this.setState({navbarClass:navbarStyles.navbar})
}

render() {

    const { isAuthenticated, user, loading } = this.props.auth;
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
    if(isAuthenticated){
        console.log(user)
    navbarOptions=(                
        <ul>
            <li><Link to='/matchmaking' >Matchmaking</Link></li>
            <li><Link to='/profile' >Profile</Link></li>
            <li><button onClick={this.logout} >Logout</button></li>
            {/* <li ><Link to='/contact' onClick={this.newPage}>Contact Us</Link></li> */}
            {/* <li ><button>About Us</button></li> */}
        </ul>)
    }else{
    navbarOptions=(                
        <ul>
        <li><button onClick={this.login}>Login</button></li>
        <li><button onClick={this.signUp}>Sign up</button></li>
        {/* <li ><Link to='/contact' onClick={this.newPage}>Contact Us</Link></li> */}
        {/* <li ><button>About Us</button></li> */}
        </ul>)
    }
  
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
  