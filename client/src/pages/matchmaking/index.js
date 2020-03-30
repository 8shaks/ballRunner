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
      axios.post('/api/matchmaking/update').get((res)=>{
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
      if(!isAuthenticated ){
          return (<Layout><NotAuth/></Layout>)
      }
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
            <div>
              <h1 className={mmStyles.heading}>Start Matchmaking!</h1>
              <h3 className={mmStyles.subheading}>Fill out the form below to find a match to play basketball with!</h3>
              <ol className={mmStyles.steps}>
                <li>Make sure your profile info is filled out, that information is required if you want to use our match making feature.</li>
                <li>Fill out the information below, currently the matchmaking feature is only available in Ontario.</li>
                <li>If everything checks out you'll be in our queue! We use the two player's location to find a court in between the two of you.</li>
                <li>Once we find you a match we'll text the phone number on your profile. You can also come back here for an update.</li>
                <li>If we don't find a match within 12 hours, we cancel your queue, and you can try again.</li>
              </ol>
              <div className={mmStyles.form}>
                <div className={mmStyles.input_group}>
                  <span>Street Address</span>< input onChange={this.onChange} value={this.state.streetAddress} name='streetAddress'/><br/>
                  {errors.streetAddress ? <span className={mmStyles.errors}>{errors.streetAddress}</span> : null}
                </div>
                <div className={mmStyles.input_group}>
                  <span>City</span><input  onChange={this.onChange} value={this.state.city} name='city'/><br/>
                  {errors.city ? <span className={mmStyles.errors}>{errors.city}</span> : null}
                </div>
                <button onClick={this.onSubmitStart} className={mmStyles.submit}>Find</button>
                {errors.profile ? <span style={{textAlign:"center"}} className={mmStyles.errors}>{errors.profile}<br/><br/></span> : null}
              </div>

            </div>
          );
          break
          case 1:
            content = (
              <div>
                <h1 className={mmStyles.heading}>You're currently in queue</h1>
                <h3 className={mmStyles.subheading}>We're looking for a match for you right now, check your phone often as we'll send you an update there.</h3>
                <span>Press the button below to cancel your position in queue.</span>
                <button onClick={this.onCancelQueue} className={mmStyles.submit}>Cancel</button>
              </div>
            )
            break
          case 2:
            content = (
              <div>
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
  
      return (
        <Layout>
            <div className={mmStyles.page}>
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