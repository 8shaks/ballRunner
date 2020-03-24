import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getProfile, createProfile } from "../../actions/profileActions"
import "./profile.module.css";
import Layout from '../../components/layout'
import NotAuth from '../../components/notAuthenticated/index'

class Profile extends Component {
    constructor(){
      super();
      this.state={
        profileRetrieved:false,
        skillLevel:null,
        phone:null
      }
    }
    componentWillReceiveProps(nextProps){
      if(nextProps.auth.isAuthenticated && !this.state.profileRetrieved){
        this.props.getProfile()
        this.setState({profileRetrieved:true})
      }else if(nextProps.profile.profile !== null) {
        const { skillLevel, phone } = nextProps.profile.profile
        this.setState({skillLevel, phone})
      }
    }
    onChange = (e) =>{
      console.log(e.target)
      e.preventDefault()
      this.setState({[e.target.id]:e.target.value})
    }
    edit = () => {
      let inputs = document.getElementsByTagName("input"); 
      for (let i = 0; i < inputs.length; i++) { 
          inputs[i].disabled = !inputs[i].disabled;
      } 
    }
    onSubmit= () =>{
      this.props.createProfile({skillLevel:this.state.skillLevel, phone:this.state.phone})
    }
    render() {
      const { profile, loading } = this.props.profile;
      const { isAuthenticated } = this.props.auth
      let content;
      if(!isAuthenticated ){
          return (<Layout><NotAuth/></Layout>)
      }
      if (profile === null || loading) {
        content = (
          <div>
            Loading...
          </div>
        );
      } else {
        content = (
          <div>
            <div> <span>Skill Level</span><input disabled id="skillLevel"  type="number" onChange={this.onChange} value={this.state.skillLevel}/></div>
            <div> <span>Phone</span><input disabled id="phone" type="number" onChange={this.onChange} value={this.state.phone}/></div>
            <button onClick={this.onSubmit}>Submit</button>
            <button onClick={this.edit}>Edit</button>
          </div>
        );
      }
  
      return (
        <Layout>
            <div>
            <h4>{content}</h4>
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
    auth:state.auth
  });
  
  export default connect(
    mapStateToProps,
    { getProfile, createProfile }
  )(Profile);