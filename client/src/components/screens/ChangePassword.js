import React, { useState, useContext, Fragment } from 'react'
import { UserContext } from '../../App'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import M from 'materialize-css'
import Container from '@material-ui/core/Container'
import Card from '@material-ui/core/Card'
import Spinner from '../Spinner'
import { SET_LOADING, REMOVE_LOADING } from '../../actions/actionTypes'

const ChangePassword = () => {
   const { state, dispatch } = useContext(UserContext)
   const history = useHistory()

   const [formData, setFormData] = useState({
      password: '',
      oldPassword: '',
   })

   const [err, setErr] = useState({
      passwordErr: '',
   })

   const { password, oldPassword } = formData

   const validateForm = (errors) => {
      let valid = true
      Object.values(errors).forEach((val) => val.length > 0 && (valid = false))
      return valid
   }

   const onChange = (e) => {
      let errors = err
      const { name, value } = e.target

      switch (name) {
         case 'password':
            errors.passwordErr =
               value.length < 6 ? 'Password must be 6 characters long!' : ''
            break
         default:
            break
      }
      setFormData({ ...formData, [name]: value })

      setErr({ ...errors, errors })
   }

   const changePassword = async (e) => {
      e.preventDefault()

      if (!password || !oldPassword) {
         return M.toast({
            html: 'Password required!',
            classes: '#c62828 red darken-3',
         })
      }

      if (!validateForm(err)) {
         return M.toast({
            html: 'Cannot change password!',
            classes: '#c62828 red darken-3',
         })
      }

      const token = localStorage.getItem('jwt')

      const config = {
         headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
         },
      }

      const body = JSON.stringify({ password, oldPassword })

      try {
         dispatch({
            type: SET_LOADING,
         })
         const res = await axios.patch('/changepassword', body, config)

         M.toast({ html: res.data.msg, classes: '#43a047 green darken-1' })

         dispatch({
            type: REMOVE_LOADING,
         })
         history.push('/')
      } catch (err) {
         dispatch({
            type: REMOVE_LOADING,
         })
         err.response.data.errors.forEach((e) => {
            M.toast({ html: e.msg, classes: '#c62828 red darken-3' })
         })
      }
   }

   return (
      <Fragment>
         {state.loading === false ? (
            <Container maxWidth='lg'>
               <div className='mycard'>
                  <Card className='auth-card input-field'>
                     <h2>Instagram</h2>
                     <form onSubmit={changePassword}>
                        <div>
                           <input
                              type='password'
                              placeholder='Enter old password'
                              name='oldPassword'
                              value={oldPassword}
                              onChange={onChange}
                           />
                        </div>
                        <div>
                           <input
                              type='password'
                              placeholder='Enter new password'
                              name='password'
                              value={password}
                              onChange={onChange}
                           />
                           {err.passwordErr.length > 0 && (
                              <span style={{ color: 'red' }}>
                                 {err.passwordErr}
                              </span>
                           )}
                        </div>
                        <button className='btn waves-effect waves-light #64b5f6 blue darken-1'>
                           Change Password
                        </button>
                     </form>
                  </Card>
               </div>
            </Container>
         ) : (
            <Spinner />
         )}
      </Fragment>
   )
}

export default ChangePassword
