import React, { useState, useContext } from 'react'
import { UserContext } from '../../App'
import { Link, useHistory } from 'react-router-dom'
import axios from 'axios'
import M from 'materialize-css'
import Container from '@material-ui/core/Container'
import Card from '@material-ui/core/Card'
import { USER, TOKEN } from '../../actions/actionTypes'

const Signup = () => {
   console.log('Signup.js')
   const { state, dispatch } = useContext(UserContext)
   const history = useHistory()

   const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
   })

   const [err, setErr] = useState({
      nameErr: '',
      emailErr: '',
      passwordErr: '',
   })

   const { name, email, password } = formData

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
         case 'name':
            errors.nameErr =
               value.length < 3 ? 'Name must be 3 characters long!' : ''
            break
         case 'email':
            errors.emailErr = validEmailRegex.test(value)
               ? ''
               : 'Email is not valid!'
            break
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

   const PostData = async (e) => {
      e.preventDefault()

      if (!validateForm(err)) {
         return M.toast({
            html: 'Cannot Signup!',
            classes: '#c62828 red darken-3',
         })
      }

      const config = {
         headers: {
            'Content-Type': 'application/json',
         },
      }

      const body = JSON.stringify({ name, email, password })

      try {
         const res = await axios.post('/signup', body, config)
         localStorage.setItem('jwt', res.data.token)
         dispatch({ type: USER, payload: res.data.user })
         dispatch({ type: TOKEN, payload: res.data.token })
      } catch (err) {
         err.response.data.errors.forEach((e) => {
            M.toast({ html: e.msg, classes: '#c62828 red darken-3' })
         })
      }
   }

   if (state.user) {
      history.push('/')
   }

   return (
      <Container maxWidth='lg'>
         <div className='mycard'>
            <Card className='auth-card input-field'>
               <h2>Instagram</h2>
               <form onSubmit={PostData}>
                  <div>
                     <input
                        type='text'
                        placeholder='Name'
                        name='name'
                        value={name}
                        onChange={onChange}
                     />
                     {err.nameErr.length > 0 && (
                        <span style={{ color: 'red' }}>{err.nameErr}</span>
                     )}
                  </div>
                  <div>
                     <input
                        type='text'
                        placeholder='Email'
                        name='email'
                        value={email}
                        onChange={onChange}
                     />
                     {err.emailErr.length > 0 && (
                        <span style={{ color: 'red' }}>{err.emailErr}</span>
                     )}
                  </div>
                  <div>
                     <input
                        type='password'
                        placeholder='Password'
                        name='password'
                        value={password}
                        onChange={onChange}
                     />
                     {err.passwordErr.length > 0 && (
                        <span style={{ color: 'red' }}>{err.passwordErr}</span>
                     )}
                  </div>
                  <button className='btn waves-effect waves-light #64b5f6 blue darken-1'>
                     Signup
                  </button>
               </form>
               <h6>
                  <Link to='/signin'>Already have an account?</Link>
               </h6>
            </Card>
         </div>
      </Container>
   )
}

export default Signup
