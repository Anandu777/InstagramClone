import React, { useContext, Fragment, useState } from 'react'
import { UserContext } from '../App'
import { Link, useHistory } from 'react-router-dom'
import { CLEAR_USER } from '../actions/actionTypes'
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'

const useStyles = makeStyles((theme) => ({
   modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
   },
   paper: {
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
   },
}))

const Navbar = () => {
   const { state, dispatch } = useContext(UserContext)
   const history = useHistory()

   const [search, setSearch] = useState('')
   const [users, setUsers] = useState()
   const classes = useStyles()
   const [open, setOpen] = useState(false)
   const [logoutOpen, setLogoutOpen] = useState(false)

   const handleOpen = () => {
      setOpen(true)
   }

   const handleClose = () => {
      setOpen(false)
      setSearch('')
      setUsers()
   }

   const handleLogoutOpen = () => {
      setLogoutOpen(true)
   }

   const handleLogoutClose = () => {
      setLogoutOpen(false)
   }

   const logout = () => {
      handleLogoutClose()
      dispatch({
         type: CLEAR_USER,
      })
      localStorage.removeItem('jwt')
      history.push('/signin')
   }

   const guestLinks = () => (
      <Fragment>
         <li>
            <Link to='/Signin'>Signin</Link>
         </li>
         <li>
            <Link to='/signup'>Signup</Link>
         </li>
      </Fragment>
   )

   const authLinks = () => (
      <Fragment>
         <li>
            <i
               className='large material-icons Navbar__icon'
               style={{ color: '#000' }}
               onClick={handleOpen}
            >
               search
            </i>
         </li>
         <li>
            <Link to='/profile'>
               <i className='large material-icons Navbar__icons--hide'>
                  contact_mail
               </i>
               <span className='Navbar__hide'>Profile</span>
            </Link>
         </li>

         <li>
            <Link to='/create'>
               <i className='large material-icons Navbar__icons--hide'>
                  create
               </i>
               <span className='Navbar__hide'>Create Post</span>
            </Link>
         </li>
         <li>
            <Link to='/settings'>
               <i className='large material-icons Navbar__icons--hide'>
                  settings
               </i>
               <span className='Navbar__hide'>Settings</span>
            </Link>
         </li>
         <li>
            <Link to='#!' onClick={handleLogoutOpen}>
               <i className='large material-icons Navbar__icons--hide'>
                  logout
               </i>
               <span className='Navbar__hide'>Logout</span>
            </Link>
         </li>
      </Fragment>
   )

   const searchUsers = async (name) => {
      setSearch(name)

      try {
         const config = {
            headers: {
               'Content-Type': 'application/json',
               'x-auth-token': localStorage.getItem('jwt'),
            },
         }

         const body = JSON.stringify({ name })

         const res = await axios.post('/searchusers', body, config)

         setUsers(res.data)
      } catch (err) {}
   }

   return (
      <nav>
         <div className='nav-wrapper white'>
            <Link
               to={state.user !== null ? '/' : 'signin'}
               className='brand-logo left'
            >
               Instagram
            </Link>
            <ul id='nav-mobile' className='right'>
               {state.user !== null ? authLinks() : guestLinks()}
            </ul>
         </div>

         {/* Search users modal */}
         <Modal
            aria-labelledby='transition-modal-title'
            aria-describedby='transition-modal-description'
            className={classes.modal}
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
               timeout: 500,
            }}
         >
            <Fade in={open}>
               <div className={classes.paper}>
                  <input
                     type='text'
                     placeholder='Search users'
                     value={search}
                     onChange={(e) => searchUsers(e.target.value)}
                  />
                  {users &&
                     users.map((user) => (
                        <div className='collection' key={user._id}>
                           <Link
                              to={`/profile/${user._id}`}
                              className='collection-item'
                              onClick={handleClose}
                           >
                              {user.name}
                           </Link>
                        </div>
                     ))}
               </div>
            </Fade>
         </Modal>

         {/* Logout modal */}
         <Modal
            aria-labelledby='transition-modal-title'
            aria-describedby='transition-modal-description'
            className={classes.modal}
            open={logoutOpen}
            onClose={handleLogoutClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
               timeout: 500,
            }}
         >
            <Fade in={logoutOpen}>
               <div
                  className={classes.paper}
                  style={{ display: 'flex', flexDirection: 'column' }}
               >
                  <h3
                     style={{
                        marginLeft: 'auto',
                        marginRight: 'auto',
                     }}
                  >
                     Logout
                  </h3>
                  <p
                     style={{
                        marginLeft: 'auto',
                        marginRight: 'auto',
                     }}
                  >
                     Do you want to logout?
                  </p>
                  <button
                     className='btn waves-effect waves-light #64b5f6 blue darken-1'
                     onClick={logout}
                     style={{ marginLeft: 'auto', marginRight: 'auto' }}
                  >
                     Logout
                  </button>
               </div>
            </Fade>
         </Modal>
      </nav>
   )
}

export default Navbar
