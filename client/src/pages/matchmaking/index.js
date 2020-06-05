import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getProfile, createProfile } from "../../actions/profileActions"
import mmStyles from "./mm.module.css";
import Layout from '../../components/layout'
import NotAuth from '../../components/notAuthenticated/index'
import axios from 'axios';

class Profile extends Component {
    constructor(){
      super();
      this.state={
        status:undefined,
        profileRetrieved:false,
        errors:{},
        streetAddress:'',
        city:''
      }
    }

    componentWillReceiveProps(nextProps){
      if (nextProps.errors) {
        this.setState({ errors: nextProps.errors });
      }
      if(nextProps.auth.isAuthenticated && !this.state.profileRetrieved){
       axios.get('/api/matchmaking/status').then((res) => {
         this.setState({status:res.data.status, profileRetrieved:true})
         this.props.getProfile()
        }).catch((err =>{
          this.setState({status:-1})
        }))
      }else if(nextProps.profile.profile !== null) {
        const { skillLevel, phone } = nextProps.profile.profile
        this.setState({skillLevel, phone})
      }
    }
    onChange = (e) =>{
      e.preventDefault()
      this.setState({[e.target.name]:e.target.value})
    }

    onSubmitStart = () =>{
      let errors = {}
      if (this.state.city === ''){
        errors.city = "Please enter a city"
      }
      if (this.state.streetAddress === ''){
        errors.streetAddress = "Please enter an address"
      }
      if(!this.props.profile.profile.skillLevel || !this.props.profile.profile.phone){
        errors.profile = "Please fill out your profile before trying to play"
      }
      this.setState({errors})
      if(Object.keys(errors).length === 0 && errors.constructor === Object){
        const { profile } = this.props.profile
        const data={
          phone:profile.phone,
          skillLevel: profile.skillLevel,
          address: this.state.streetAddress,
          city: this.state.city
        }
        axios.post('/api/matchmaking/start', data).then((res)=>{
          const { status } = res.data
          this.setState({status})
        }).catch((err) =>{
          console.log(err)
          this.setState({status:-1})
        })
      }
      
    }
    onCancelQueue = () =>{
      axios.get('/api/matchmaking/update').then((res)=>{
        const { status } = res.data
        this.setState({status})
      }).catch((err) =>{
        console.log(err)
        this.setState({status:-1})
      })
    }
    render() {
      const { profile, loading } = this.props.profile;
      const { isAuthenticated } = this.props.auth
      const { errors, status  } = this.state
      let content;
      switch(status){
        case -1:
          content = (
            <div>
              <h1 className={mmStyles.heading}>There was an error</h1>
              <h3 className={mmStyles.subheading}>Seems like there was an issue. Try reloading the page or checking back later.</h3>
            </div>
          )
          break
        case 0:
          content = (
              <div className={mmStyles.form}>
                <div className={mmStyles.input_group}>
                  <input placeholder="Street Address" onChange={this.onChange} value={this.state.streetAddress} name='streetAddress'/><br/>
                  {errors.streetAddress ? <span className={mmStyles.errors}>{errors.streetAddress}</span> : null}
                </div>
                <div className={mmStyles.input_group}>
                  <input  placeholder="City" onChange={this.onChange} value={this.state.city} name='city'/><br/>
                  {errors.city ? <span className={mmStyles.errors}>{errors.city}</span> : null}
                </div>
                <button onClick={this.onSubmitStart} className={mmStyles.submit}>Find</button>
                {errors.profile ? <span style={{textAlign:"center"}} className={mmStyles.errors}>{errors.profile}<br/><br/></span> : null}
              </div>
          );
          break
          case 1:
            content = (
              <div className={mmStyles.inQueue}>
                <h1 className={mmStyles.heading}>You're currently in queue</h1>
                <h3 className={mmStyles.subheading}>We're looking for a match for you right now, check your phone often as we'll send you an update there. You can also come back to this page to check for updates</h3>
                <span>Press the button below to cancel your position in queue.</span>
                <button onClick={this.onCancelQueue} className={mmStyles.submit}>Cancel</button>
              </div>
            )
            break
          case 2:
            content = (
              <div className={mmStyles.inQueue}>
                <h1 className={mmStyles.heading}>We found a match!</h1>
                <h3 className={mmStyles.subheading}>We found a match for you! Check your phone for more details.</h3>
              </div>
            )
            break
        default:
          content = (
            <div style={{textAlign:'center'}}>
              Loading...
            </div>
          );
          break
      }
      if(!isAuthenticated ){
        content = (
            <h3 className={mmStyles.login_prompt}>Log in to start playing some basketball!</h3>
        )
      }
      return (
        <Layout>
            <div className={mmStyles.page}>
              <div className={mmStyles.header}>
                <h1>Find someone to play with!</h1>
                <p>Check out our matchmaking service, this feature allows you to find other players to play with at a court convenient to both of you.
                  keep in mind we're stil in beta and are continually adding features.
                </p>
              </div>
              <div className={mmStyles.process_flexCont}>
                <div className={mmStyles.process_card}>
                  <h2>Step 1: Make an account</h2>
                  <p>Make an account and add some details to your profile. We need your phone number and skill level, (scale of 0 - 1000)
                    so we can contact you once we find the right match

                  </p>
                </div>
                <div className={mmStyles.process_card}>
                  <h2>Step 2: Start looking for a competitor</h2>
                  <p>
                    Once you're logged in you'll see a form below to input your address. Enter the address you want us to use when finding the court between the two of you.
                  </p>
                </div>
                <div className={mmStyles.process_card}>
                  <h2>Step 3: Sit back!</h2>
                  <p>
                    Now all you got to do is sit back and wait. Once we find someone for you to play with we'll contact you immediately via phone to let you know that you found a match 
                    and what court to head to. Have fun!
                  </p>
                </div>
              </div>
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
    auth:state.auth
  });
  
  export default connect(
    mapStateToProps,
    { getProfile, createProfile }
  )(Profile);