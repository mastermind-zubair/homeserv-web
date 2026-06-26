import * as ACTION_TYPES from "../actions/ActionTypes";

export const initialState = {
  isAuth: false,
  username: "",
  token: "",
};

export const AuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPES.LOGIN:
      return {
        ...state,
        isAuth: true,
        username: action.username,
        token: action.token,
      };
    case ACTION_TYPES.LOGOUT:
      return {
        ...state,
        isAuth: false,
        username: "",
        token: "",
      };
    default:
      return state;
  }
};
