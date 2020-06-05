import { GET_ERRORS, SET_CURRENT_USER, CLEAR_ERRORS } from "./types";
import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import { navigate } from "gatsby";

// REGISTERr
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/api/users", userData)
    .then(() => navigate('/post-signup'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//Login

export const loginUser = userData => dispatch => {
  axios
    .post("/api/auth", userData)
    .then(res => {
      const { token } = res.data;

      //Set to auth Header
      setAuthToken(token);
      const decoded = jwt_decode(token);
      dispatch(setCurrentUser(decoded));
      window.location.reload()
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//set current user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

export const resetErrors = dispatch =>{
  return{
    type: CLEAR_ERRORS,
  }
}
export const logoutUser = history => dispatch => {

  setAuthToken(false);
  dispatch(setCurrentUser({}));
  navigate('/')
};
