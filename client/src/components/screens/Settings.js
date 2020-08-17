import React from 'react'
import { Link } from 'react-router-dom'
import Container from '@material-ui/core/Container'

const Settings = () => {
   return (
      <Container maxWidth='lg'>
         <button
            className='btn waves-effect waves-light #64b5f6 blue darken-1 '
            style={{ marginTop: '10px' }}
         >
            <Link to='/changepassword' className='Settings_link'>
               Change Password
            </Link>
         </button>
      </Container>
   )
}

export default Settings
