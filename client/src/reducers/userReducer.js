import {
   USER,
   TOKEN,
   CLEAR_USER,
   ALLPOSTS,
   POST_ERROR,
   MYPOSTS,
   SET_LOADING,
   REMOVE_LOADING,
} from '../actions/actionTypes'

export const initialState = {
   user: null,
   token: null,
   loading: false,
   allposts: [],
   myposts: [],
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
