import React, { Component } from 'react'
import indexStyles from './index.module.css'
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from '../../actions/authActions'
class LoginModal extends Component {
    constructor(props){
        super(props)
        this.state={
            username:'',
            password:'',
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
        // this.state.lastName === '' ? errors.lastName = 'Please enter a last name' : errors.lastName = ''
        this.state.password === '' ? errors.password = 'Please enter a password' : errors.password = null
        if(this.state.username === ''){
            errors.username = 'Please enter username'
        }else{
            errors.username = null
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
        if (!errors.email  && !errors.password ){
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
        this.props.loginUser({username:this.state.username,password:this.state.password})
       }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.errors) {
          this.setState({ errors: nextProps.errors });
        }
      }
    render() {
        const {errors} = this.state
        let errorUsername = <span className={indexStyles.error}>{errors.username}</span>
        let errorPassword = <span className={indexStyles.error}>{errors.password}</span>
        let errorAuth = <span className={indexStyles.error}>{errors.auth}</span>
        return (
            <div  className={indexStyles.modal}>
                <div className={indexStyles.modal_content}>
                    <span onClick={this.props.loginToggle} className={indexStyles.close}> &times;</span>
                    <form className={indexStyles.loginForm}>
                        <div className={indexStyles.input_group}><span>Username</span><input className={indexStyles.input_large}  value={this.state.username} onChange={this.onChange} name='username' />{errors.username ? errorUsername : null}</div>
                        <div className={indexStyles.input_group}><span>Password</span><input className={indexStyles.input_large}  value={this.state.password} onChange={this.onChange} name='password' type='password'/>{errors.password ? errorPassword : null}</div>
                        {errors.auth ? errorAuth : null}
                        <button type="submit" className={indexStyles.submit_button} onClick={this.onSubmit} >Submit</button>
                    </form>
                </div>
            </div>
        )
    }
}
LoginModal.propTypes = {
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
  };
  const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
  });
  
  export default connect(
    mapStateToProps,
    { loginUser }
  )(LoginModal);