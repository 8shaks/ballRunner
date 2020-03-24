import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getCurrentProfile } from "../../actions/profileActions"
import "./profileComp.module.css";

class Profile extends Component {
  constructor(){
    super();
    this.state={
      isLoggedIn:false
    }
  }
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.getCurrentProfile();
    }
  }
  render() {
    const { profile, loading } = this.props.profile;

    let content;
    if (profile === null || loading) {
      content = (
        <div>
          
        </div>
      );
    } else {
      profile.social = !isEmpty(profile.social) ? profile.social : {};
      content = (
        <div>
          
        </div>
      );
    }

    return (
      <div>
        <h4>{content}</h4>
      </div>
    );
  }
}
Profile.propTypes = {
  profile: PropTypes.object.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  auth:state.auth
});

export default connect(
  mapStateToProps,
  { getCurrentProfile }
)(Profile);