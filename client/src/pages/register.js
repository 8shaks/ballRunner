
import { Link, navigate } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import authStyles from '../styles/auth.module.css'
import React, { useState, useEffect } from 'react'
import { connect } from "react-redux";
import { registerUser } from '../actions/authActions'
import PropTypes from "prop-types";


const Register =  (props) => {
    const [formValues, setFormValues] = useState({ email:"", username:"", password:"", password2:"" });
    const [errors, setErrors] = useState({ email:null, username: null, password: null, password2:null, server: null});

    const onChange = (e) =>{
        setFormValues({...formValues, [e.target.name]: e.target.value});
    }
    const checkValid = () =>{
        let errorsNew = {};
        formValues.password === '' ? errorsNew.password = 'Please enter a password' : errorsNew.password = null;
        formValues.username === '' ? errorsNew.username = 'Please enter a username' : errorsNew.username = null;
        formValues.email === '' ? errorsNew.email = 'Please enter an email' : errorsNew.email = null;
        formValues.password2 === '' ? errorsNew.password2 = 'Please enter your password' : errorsNew.password2 = null;
        formValues.password.length < 6 || formValues.password.length > 30 ? errorsNew.password = 'Please must be between 6 and 30 characters' : errorsNew.password2 = null;
        formValues.password2 !== formValues.password ? errorsNew.password2 = 'Passwords must match' : errorsNew.password2 = null;

        setErrors(errorsNew);
        if (!errors.email  && !errors.password, !errors.password2, !errors.username ) return true
        else return false
    }
    const onSubmit = (e) =>{
        e.preventDefault();
        if(checkValid()){
            props.registerUser({username:formValues.username,password:formValues.password, email: formValues.email, password2: formValues.password2 });
        }
    }
    useEffect(() => {
        if (props.auth.isAuthenticated) navigate("/");
     }, [props.auth.isAuthenticated])
    useEffect(() => {
        setErrors(props.errors);
        return setErrors({});
    }, [])
    return (
        <Layout>
            <SEO title="Register" description="Register for a BallRunner account!"/>
            <div className={authStyles.flexCont} >
                <h1>Register</h1>
                <form className={authStyles.form} method="POST" onSubmit={onSubmit}>
                    <input onChange={onChange} aria-label="Email" value={formValues.email} name="email" placeholder="Email"/>
                    {<span className="error">{errors.email}</span>}
                    <input onChange={onChange}  aria-label="Username" value={formValues.username} name="username" placeholder="Username"/>
                    {<span className="error"> {errors.username}</span>}
                    <input onChange={onChange} type="password" aria-label="Password" value={formValues.password} name="password" placeholder="Password"/>
                    {<span className="error">{errors.password}</span>}
                    <input onChange={onChange}type="password"  aria-label="Reenter Password" value={formValues.password2} name="password2" placeholder="Reenter Password"/>
                    {<span className="error">{errors.password2}</span>}
                    <div>
                        <button className={authStyles.homeButton}>Register</button><Link to="/signup" className={authStyles.awayButton}>Login</Link>
                    </div>
                </form>
            </div>
        </Layout>
    )
}
Register.propTypes = {
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
  )(Register);
