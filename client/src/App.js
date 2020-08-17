import React, { useEffect, createContext, useReducer, useContext } from 'react'
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom'
import axios from 'axios'
import './App.css'
import Navbar from './components/Navbar'
import Home from './components/screens/Home'
import Signin from './components/screens/Signin'
import Profile from './components/screens/Profile'
import Signup from './components/screens/Signup'
import CreatePost from './components/screens/CreatePost'
import OthersProfile from './components/screens/OthersProfile'
import UpdateImage from './components/screens/UpdateImage'
import SentResetPasswordLink from './components/screens/SentResetPasswordLink'
import ChangePasswordUsingLink from './components/screens/ChangePasswordUsingLink'
import ChangePassword from './components/screens/ChangePassword'
import Settings from './components/screens/Settings'
import { reducer, initialState } from './reducers/userReducer'
import { USER, CLEAR_USER, TOKEN } from './actions/actionTypes'

export const UserContext = createContext()

const Routing = () => {
   const history = useHistory()
   const { dispatch } = useContext(UserContext)
   useEffect(() => {
      async function getUser() {
         try {
            const token = localStorage.getItem('jwt')

            if (!token) {
               if (
                  history.location.pathname.startsWith('/resetpassword') ||
                  history.location.pathname.startsWith('/signup')
               ) {
                  return
               }
               history.push('/signin')
               return
            }
            const config = {
               headers: {
                  'x-auth-token': token,
               },
            }
            const res = await axios.get('/getuser', config)

            dispatch({ type: USER, payload: res.data.user })
            dispatch({ type: TOKEN, payload: res.data.token })
         } catch (err) {
            dispatch({ type: CLEAR_USER })
            localStorage.removeItem('jwt')
            history.push('/signin')
         }
      }
      getUser()
   }, [])
   return (
      <Switch>
         <Route path='/' exact component={Home} />
         <Route path='/signin' component={Signin} />
         <Route path='/profile' exact component={Profile} />
         <Route path='/signup' component={Signup} />
         <Route path='/create' component={CreatePost} />
         <Route path='/profile/:userId' component={OthersProfile} />
         <Route path='/updateimage' component={UpdateImage} />
         <Route path='/resetpassword' exact component={SentResetPasswordLink} />
         <Route
            path='/resetpassword/:token'
            component={ChangePasswordUsingLink}
         />
         <Route path='/changepassword' component={ChangePassword} />
         <Route path='/settings' component={Settings} />
      </Switch>
   )
}

function App() {
   const [state, dispatch] = useReducer(reducer, initialState)
   return (
      <UserContext.Provider value={{ state, dispatch }}>
         <BrowserRouter>
            <Navbar />
            <Routing />
         </BrowserRouter>
      </UserContext.Provider>
   )
}

export default App
