import axios from "axios";
import {
  GET_PROFILE,
  PROFILE_LOADING,
  GET_ERRORS,
  CLEAR_CURRENT_PROFILE
} from "./types";

//GET CURRENT PROFILE
export const getProfile = () => dispatch => {
  dispatch(setProfileLoading());
  axios
    .get("/api/profile/me")
    .then(res =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PROFILE,
        payload: {}
      })
    );
};


//Create Profile
export const createProfile = (profileData) => dispatch => {
  axios
    .post("/api/profile", profileData)
    .then(() => window.location.reload())
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//Profile Loading
export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING
  };
};

//clear profile
export const clearProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE
  };
};

