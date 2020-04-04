import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getProfile, createProfile } from "../../actions/profileActions"
import profileStyles from "./profile.module.css";
import Layout from '../../components/layout'
import NotAuth from '../../components/notAuthenticated/index'

class Profile extends Component {
    constructor(){
      super();
      this.state={
        profileRetrieved:false,
        skillLevel:null,
        phone:null,
        errors:{},
        formDisabled : true
      }
    }
    componentWillReceiveProps(nextProps){
      if (nextProps.errors) {
        this.setState({ errors: nextProps.errors });
      }
      if(nextProps.auth.isAuthenticated && !this.state.profileRetrieved){
        this.props.getProfile()
        this.setState({profileRetrieved:true})
      }else if(nextProps.profile.profile !== null) {
        const { skillLevel, phone } = nextProps.profile.profile
        this.setState({skillLevel, phone})
      }
    }
    onChange = (e) =>{
      e.preventDefault()
      this.setState({[e.target.id]:e.target.value})
    }
    edit = () => {
      this.setState(prevState => ({
        formDisabled: !prevState.formDisabled
      }))
    }
    onSubmit = () =>{
      const phoneFormat1 = new RegExp(/^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/);
      const phoneFormat2 = new RegExp(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g);
      let errors = {}
      const skillLevel = parseFloat(this.state.skillLevel)
      if(!phoneFormat1.test(this.state.phone) && !phoneFormat2.test(this.state.phone)){
        errors.phone = "Please enter a valid phone number"
      }
      if(skillLevel < 0 || skillLevel > 1000){
        errors.phone = "Please enter a valid skill level"
      }
      this.setState({errors})
      if(Object.keys(errors).length === 0 && errors.constructor === Object){
        this.props.createProfile({skillLevel:skillLevel, phone:this.state.phone})
      }
      
    }
    render() {
      const { profile, loading } = this.props.profile;
      const { isAuthenticated } = this.props.auth
      const { errors, formDisabled } = this.state
      let content;
      if(!isAuthenticated ){
          return (<Layout><NotAuth/></Layout>)
      }
      if (profile === null || loading) {
        content = (
          <div style={{textAlign:'center'}}>
            Loading...
          </div>
        );
      } else {
        content = (
          <div>
            <div className={profileStyles.input_group}> <span className={profileStyles.input_label}>Skill Level(0-1000)</span><input disabled={formDisabled} id="skillLevel"  type="number" onChange={this.onChange} value={this.state.skillLevel}/>{errors.skillLevel ? <span className={profileStyles.errors}>{errors.skillLevel}</span> : null}</div>
            <div className={profileStyles.input_group}> <span className={profileStyles.input_label}>Phone</span><input disabled={formDisabled} id="phone" onChange={this.onChange} value={this.state.phone}/>{errors.phone ? <span className={profileStyles.errors}>{errors.phone}</span> : null}<span className={profileStyles.input_note}>Please enter a real phone number since we will use this number to contact you once a number has been found.</span></div>
            <div className={profileStyles.button_container}>
              <button className={profileStyles.submit} onClick={this.onSubmit}>Submit</button>
              <button className={profileStyles.edit} onClick={this.edit}>Edit</button>
            </div>
          </div>
        );
      }
  
      return (
        <Layout>
            <div className={profileStyles.page}>
              <h1 className={profileStyles.page_heading}>Welcome to your profile!</h1>
              <h3 className={profileStyles.page_subheading}>Here you can edit your phone number and skill level. These fields are required to use our match making feature. </h3>
              {content}
            </div>
        </Layout>
      );
    }
  }
  Profile.propTypes = {
    profile: PropTypes.object.isRequired,
    getProfile: PropTypes.func.isRequired,
    createProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
  };
  
  const mapStateToProps = state => ({
    profile: state.profile,
    auth:state.auth,
    errors:state.errors
  });
  
  export default connect(
    mapStateToProps,
    { getProfile, createProfile }
  )(Profile);