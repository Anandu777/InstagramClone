import React, { useState, useContext, Fragment } from 'react'
import { UserContext } from '../../App'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import M from 'materialize-css'
import Container from '@material-ui/core/Container'
import Card from '@material-ui/core/Card'
import { SET_LOADING, REMOVE_LOADING } from '../../actions/actionTypes'
import Spinner from '../Spinner'

const SentResetPasswordLink = () => {
   const { state, dispatch } = useContext(UserContext)
   const history = useHistory()

   const [formData, setFormData] = useState({
      email: '',
   })

   const [err, setErr] = useState({
      emailErr: '',
   })

   const { email } = formData

   const validEmailRegex = RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)

   const validateForm = (errors) => {
      let valid = true
      Object.values(errors).forEach((val) => val.length > 0 && (valid = false))
      return valid
   }

   const onChange = (e) => {
      let errors = err
      const { name, value } = e.target

      switch (name) {
         case 'email':
            errors.emailErr = validEmailRegex.test(value)
               ? ''
               : 'Email is not valid!'
            break
         default:
            break
      }
      setFormData({ ...formData, [name]: value })

      setErr({ ...errors, errors })
   }

   const resetPassword = async (e) => {
      e.preventDefault()

      if (!email) {
         return M.toast({
            html: 'Email required!',
            classes: '#c62828 red darken-3',
         })
      }

      if (!validateForm(err)) {
         return M.toast({
            html: 'Email not registered!',
            classes: '#c62828 red darken-3',
         })
      }

      const config = {
         headers: {
            'Content-Type': 'application/json',
         },
      }

      const body = JSON.stringify({ email })

      try {
         dispatch({
            type: SET_LOADING,
         })
         const res = await axios.post('/resetpassword', body, config)

         M.toast({ html: res.data.msg, classes: '#43a047 green darken-1' })
         dispatch({
            type: REMOVE_LOADING,
         })
         history.push('/signin')
      } catch (err) {
         dispatch({
            type: REMOVE_LOADING,
         })
         console.log(err.response)
         err.response.data.errors.forEach((e) => {
            M.toast({ html: e.msg, classes: '#c62828 red darken-3' })
         })
      }
   }

   if (state.user) {
      history.push('/')
   }

   return (
      <Fragment>
         {state.loading === false ? (
            <Container maxWidth='lg'>
               <div className='mycard'>
                  <Card className='auth-card input-field'>
                     <h2>Instagram</h2>
                     <form onSubmit={resetPassword}>
                        <div>
                           <input
                              type='text'
                              placeholder='Email'
                              name='email'
                              value={email}
                              onChange={onChange}
                           />
                           {err.emailErr.length > 0 && (
                              <span style={{ color: 'red' }}>
                                 {err.emailErr}
                              </span>
                           )}
                        </div>

                        <button className='btn waves-effect waves-light #64b5f6 blue darken-1'>
                           Send Link
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

export default SentResetPasswordLink
