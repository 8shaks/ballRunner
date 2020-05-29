import React, { Component } from 'react'
import Layout from "../layout"
import SEO from '../seo'
import indexStyles from './index.module.css'
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from '../../actions/authActions'
class SignupModal extends Component {
    constructor(props){
        super(props)
        this.state={
            email:'',
            username:'',
            password:'',
            password2:'',
            errors:{},
            validForm :true,
        }
    }
    onChange = (e) =>{
        this.setState({[e.target.name]:e.target.value})
    }
     validateEmail = (email) => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase()); 
    }
    checkValid = () =>{
        let errors= {}
        // this.state.firstName === '' ? errors.firstName = 'Please enter a first name' : errors.firstName = ''
        this.state.username === '' ? errors.username = 'Please enter a username' : errors.username = null
        this.state.password === '' ? errors.password = 'Please enter a password' : errors.password = null
        this.state.password2 !== this.state.password ? errors.password2 = 'Your passwords must match' : errors.password2 = null
        this.state.password2 === '' ? errors.password2 = 'Please renter a password' : errors.password2 = null
        
        if(this.state.email === ''){
            errors.email = 'Please enter an email address'
        }else if (!this.validateEmail(this.state.email)){
            errors.email = 'Please enter a valid email address'
        }else{
            errors.email=null
        }
        // this.state.message === '' ? errors.message = 'Please enter a message' : errors.message = ''
        // this.setState({errors:errors})
        // if  ( errors.firstName === '' && errors.lastName === '' &&  errors.phoneNumber === '' && errors.email === ''  && errors.message === '' ){
        //     this.setState({validForm:true, formComplete:true})
        //     return true
        // }else{
        //     this.setState({validForm:false})
        //     return false
        // }
        this.setState({errors:errors})
        if (!errors.username  && !errors.password  && !errors.password2  && !errors.email ){
            this.setState({validForm:true})
            return true
        }else{
            this.setState({validForm:false})
            return false
        }
    }

    onSubmit = (e) =>{
        e.preventDefault();
       if(this.checkValid()){
        this.props.registerUser({username:this.state.username,email:this.state.email,password:this.state.password, password2:this.state.password2})
       }
        
    }
    componentWillReceiveProps(nextProps) {
        console.log(nextProps)
        if (nextProps.errors) {
          this.setState({ errors: nextProps.errors });
        }
      }
    render() {
        const {errors} = this.state
        console.log(errors)
        let errorUsername = <span className={indexStyles.error}>{errors.username}</span>
        let errorPassword = <span className={indexStyles.error}>{errors.password}</span>
        let errorEmail = <span className={indexStyles.error}>{errors.email}</span>
        let errorPassword2 = <span className={indexStyles.error}>{errors.password2}</span>
        
        return (
            <div  className={indexStyles.modal}>
                <div className={indexStyles.modal_content}>
                    <span onClick={this.props.signupToggle} className={indexStyles.close}> &times;</span>
                    <form className={indexStyles.loginForm}>
                        <div className={indexStyles.input_group}><span>Email</span><input className={indexStyles.input_large}  value={this.state.email} onChange={this.onChange} name='email' />{errors.email  ? errorEmail : null}</div>
                        <div className={indexStyles.input_group}><span>Username</span><input className={indexStyles.input_large}  value={this.state.username} onChange={this.onChange} name='username' />{this.state.errors.username  ? errorUsername : null}</div>
                        <div className={indexStyles.input_group}><span>Password</span><input className={indexStyles.input_large}  value={this.state.password} onChange={this.onChange} name='password' type ='password'/>{this.state.errors.password  ? errorPassword : null}</div>
                        <div className={indexStyles.input_group}><span>Password... Again</span><input className={indexStyles.input_large}  value={this.state.password2} onChange={this.onChange} name='password2' type ='password'/>{this.state.errors.password2  ? errorPassword2 : null}</div>
                        
                        <button type="submit" className={indexStyles.submit_button} onClick={this.onSubmit} >Submit</button>
                    </form>
                </div>
            </div>
        )
    }
}
SignupModal.propTypes = {
    registerUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
  };
  const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
  });
  
  export default connect(
    mapStateToProps,
    { registerUser }
  )(SignupModal);