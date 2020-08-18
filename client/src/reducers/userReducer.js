import {
   USER,
   TOKEN,
   CLEAR_USER,
   ALLPOSTS,
   POST_ERROR,
   MYPOSTS,
   OTHERSPOSTS,
   SET_LOADING,
   REMOVE_LOADING,
   CLEAR_MYPOSTS,
   CLEAR_OTHERSPOSTS,
} from '../actions/actionTypes'

export const initialState = {
   user: null,
   token: null,
   loading: false,
   allposts: [],
   myposts: [],
   othersposts: [],
}

export const reducer = (state = initialState, action) => {
   const { type, payload } = action
   switch (type) {
      case USER:
         return {
            ...state,
            user: payload,
         }
      case TOKEN:
         return {
            ...state,
            token: payload,
         }
      case ALLPOSTS:
         return {
            ...state,
            allposts: payload,
         }
      case MYPOSTS:
         return {
            ...state,
            myposts: payload,
         }
      case OTHERSPOSTS:
         return {
            ...state,
            othersposts: payload,
         }
      case CLEAR_USER:
         return {
            ...state,
            user: null,
            token: null,
            loading: false,
            allposts: [],
            myposts: [],
         }
      case POST_ERROR:
         return {
            ...state,
            allposts: [],
            myposts: [],
         }
      case CLEAR_MYPOSTS:
         return {
            ...state,
            myposts: [],
         }
      case CLEAR_OTHERSPOSTS:
         return {
            ...state,
            othersposts: [],
         }
      case SET_LOADING:
         return {
            ...state,
            loading: true,
         }
      case REMOVE_LOADING:
         return {
            ...state,
            loading: false,
         }
      default:
         return state
   }
}
