const initialState = null;

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "login":
      return action.payload.user
    case "logout":
      return initialState
    default:
      return state
  }
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {initialState, reducer};
