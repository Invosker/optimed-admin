import { USER_SET } from "./Constants";

export default function UserReducer(state, action) {
  switch (action.type) {
    case USER_SET:
      return {
        ...state,
        ...action.userData,
        // token: action.userData.token,
        // password: action.password,
      };
    default:
      return state;
  }
}
