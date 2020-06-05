
import { Link, navigate } from "gatsby"
import axios from 'axios'
import Layout from "../components/layout"
import SEO from "../components/seo"
import authStyles from '../styles/auth.module.css'
import React, { useState, useEffect } from 'react'
import { connect } from "react-redux";
import { loginUser } from '../actions/authActions'
import PropTypes from "prop-types";


const Login =  (props) => {
    const [formValues, setFormValues] = useState({ username:"", password:"" });
    const [errors, setErrors] = useState({ username: null, password: null, server: null});

    const onChange = (e) =>{
        setFormValues({...formValues, [e.target.name]: e.target.value});
    }
    const checkValid = () =>{
        let errorsNew = {};
        formValues.password === '' ? errorsNew.password = 'Please enter a password' : errorsNew.password = null;
        formValues.username === '' ? errorsNew.username = 'Please enter a username' : errorsNew.username = null;
        setErrors(errorsNew);
        if (!errors.username  && !errors.password )return true
        else return false
    }
    const onSubmit = (e) =>{
        e.preventDefault();
        if(checkValid()){
            props.loginUser({username:formValues.username,password:formValues.password});
        }
    }
    useEffect(() => {
        if (props.auth.isAuthenticated) navigate("/");
     }, [props.auth.isAuthenticated])
    useEffect(() => {
        setErrors(props.errors);
        return setErrors({});
    }, [props.errors])
    return (
        <Layout>
            <SEO title="Login" description="Login to your BallRunner account!"/>
            <div className={authStyles.flexCont} >
                <h1>Login</h1>
                <form className={authStyles.form} method="POST" onSubmit={onSubmit}>
                    <input onChange={onChange} aria-label="Username" value={formValues.username} name="username" placeholder="Username"/>
                    {<span className="error">{errors.username}</span>}
                    <input onChange={onChange} type="password" aria-label="Password" value={formValues.password} name="password" placeholder="Password"/>
                    {<span className="error">{errors.password}</span>}
                    <div>
                        <button className={authStyles.homeButton}>Login</button><Link to="/signup" className={authStyles.awayButton}>Register</Link>
                    </div>
                </form>
            </div>
        </Layout>
    )
}
Login.propTypes = {
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
  )(Login);
