import {
  GET_ERRORS,
  GET_POSTS,
  GET_POST,
  ADD_POST,
  DELETE_POST,
  POST_LOADING,
  CLEAR_ERRORS
} from "./types";
import axios from "axios";

export const addPost = (postData, history, image) => dispatch => {
  axios({
    method: "post",
    url: "/api/post",
    data: postData
  })
    .then(
      res => {
        if (image) {
          dispatch(addPostImage(image, history, res.data._id));
        } else {
          history.push(`/post/${res.data._id}`);
        }
      },
      res => {
        if (image) {
          dispatch(addPostImage(image, history, res.data._id));
        } else {
          dispatch({
            type: ADD_POST,
            payload: res.data
          });
        }
      }
    )
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};
export const editPost = (postData, id, history, image) => dispatch => {
  axios
    .post(`/api/post/${id}`, postData)
    .then(
      res => {
        if (image !== null) {
          dispatch(addPostImage(image, history, id));
        } else {
          history.push(`/post/${res.data._id}`);
        }
      },
      res => {
        if (image !== {}) {
          dispatch(addPostImage(image, history, id));
        } else {
          dispatch({
            type: ADD_POST,
            payload: res.data
          });
        }
      }
    )
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};
export const addPostImage = (image, history, id) => dispatch => {
  const formData = new FormData();
  formData.append("image", image);
  axios({
    method: "post",
    url: "/api/post/image_upload/" + id,
    data: formData
  })
    .then(
      res => history.push(`/post/${res.data._id}`),
      res =>
        dispatch({
          type: ADD_POST,
          payload: res.data
        })
    )
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

export const getPosts = () => dispatch => {
  dispatch(setPostLoading());
  axios
    .get("/api/post")
    .then(res =>
      dispatch({
        type: GET_POSTS,
        payload: res.data
      })
    )
    .catch(err => {
      dispatch({
        type: GET_POSTS,
        payload: null
      });
    });
};

export const setPostLoading = () => {
  return {
    type: POST_LOADING
  };
};

export const deletePost = (id, history) => dispatch => {
  axios
    .delete(`/api/post/${id}`)
    .then(
      dispatch({
        type: DELETE_POST,
        payload: id
      }),
      history.push(`/`)
    )
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

export const getPost = id => dispatch => {
  dispatch(setPostLoading());
  axios
    .get(`/api/post/${id}`)
    .then(res =>
      dispatch({
        type: GET_POST,
        payload: res.data
      })
    )
    .catch(err => {
      dispatch({
        type: GET_POST,
        payload: null
      });
    });
};

export const addLike = id => dispatch => {
  axios
    .post(`/api/post/like/${id}`)

    .then(res => dispatch(getPost(id)))
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

export const removeLike = id => dispatch => {
  axios
    .post(`/api/post/unlike/${id}`)

    .then(res => dispatch(getPost(id)))
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

export const addComment = (commentData, postId) => dispatch => {
  dispatch(clearErrors());
  axios
    .post(`/api/post/comment/${postId}`, commentData)
    .then(res => dispatch(getPost(postId)))

    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};
export const deleteComment = (postId, commentId) => dispatch => {
  axios
    .delete(`/api/post/comment/${postId}/${commentId}`)
    .then(res => dispatch(getPost(postId)))

    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};
