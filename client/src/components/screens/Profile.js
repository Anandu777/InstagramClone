import React, { useEffect, useState, useContext, Fragment } from 'react'
import { UserContext } from '../../App'
import axios from 'axios'
import {
   SET_LOADING,
   REMOVE_LOADING,
   MYPOSTS,
   USER,
   CLEAR_OTHERSPOSTS,
} from '../../actions/actionTypes'
import Container from '@material-ui/core/Container'
import Spinner from '../Spinner'
import { Link } from 'react-router-dom'

const Profile = () => {
   const { state, dispatch } = useContext(UserContext)
   const [data, setData] = useState([])

   useEffect(() => {
      getMyPosts()
      getUserDetails()
   }, [])

   async function getMyPosts() {
      dispatch({
         type: SET_LOADING,
      })
      const token = localStorage.getItem('jwt')
      const config = {
         headers: {
            'x-auth-token': token,
         },
      }
      try {
         const res = await axios.get('/mypost', config)
         setData(res.data.myPost)
         dispatch({
            type: MYPOSTS,
            payload: res.data.myPost,
         })
         dispatch({
            type: CLEAR_OTHERSPOSTS,
         })
         dispatch({
            type: REMOVE_LOADING,
         })
      } catch (err) {
         dispatch({
            type: REMOVE_LOADING,
         })
      }
   }

   const getUserDetails = async () => {
      dispatch({
         type: SET_LOADING,
      })
      const token = localStorage.getItem('jwt')
      const config = {
         headers: {
            'x-auth-token': token,
         },
      }
      try {
         const res = await axios.get('/getuser', config)

         dispatch({
            type: USER,
            payload: res.data.user,
         })
         dispatch({
            type: REMOVE_LOADING,
         })
      } catch (err) {
         dispatch({
            type: REMOVE_LOADING,
         })
      }
   }

   return (
      <Fragment>
         {state.loading === false && state.user !== null ? (
            <Fragment>
               <Fragment>
                  <Container maxWidth='lg'>
                     <div style={{ maxWidth: '550px', margin: '0px auto' }}>
                        <div
                           style={{
                              display: 'flex',
                              justifyContent: 'space-around',
                              margin: '18px 0',
                           }}
                        >
                           <div>
                              <div>
                                 <img
                                    className='Profile__image'
                                    style={{
                                       width: '140px',
                                       height: '140px',
                                       borderRadius: '50%',
                                    }}
                                    src={state.user.photo}
                                    alt='Person'
                                 />
                              </div>
                              <div>
                                 <Link to='/updateimage'>
                                    <button className='btn waves-effect waves-light #64b5f6 blue darken-1 Profile__button'>
                                       Update Picture
                                    </button>
                                 </Link>
                              </div>
                           </div>
                           <div style={{ marginLeft: '10px' }}>
                              <h4>{state.user && state.user.name}</h4>
                              <div
                                 style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    width: '108%',
                                 }}
                              >
                                 <h6>
                                    {data && (
                                       <Fragment>
                                          {data.length > 1 ? (
                                             <Fragment>
                                                {data.length} posts
                                             </Fragment>
                                          ) : (
                                             <Fragment>
                                                {data.length} post
                                             </Fragment>
                                          )}
                                       </Fragment>
                                    )}{' '}
                                 </h6>
                                 <h6>
                                    {state.user.followers ? (
                                       <Fragment>
                                          {state.user.followers.length > 1 ? (
                                             <Fragment>
                                                {state.user.followers.length}{' '}
                                                followers
                                             </Fragment>
                                          ) : (
                                             <Fragment>
                                                {state.user.followers.length}{' '}
                                                follower
                                             </Fragment>
                                          )}
                                       </Fragment>
                                    ) : (
                                       <Fragment>0 follower</Fragment>
                                    )}
                                 </h6>
                                 <h6>
                                    {state.user.following ? (
                                       <Fragment>
                                          {state.user.following.length > 1 ? (
                                             <Fragment>
                                                {state.user.following.length}{' '}
                                                followings
                                             </Fragment>
                                          ) : (
                                             <Fragment>
                                                {state.user.following.length}{' '}
                                                following
                                             </Fragment>
                                          )}
                                       </Fragment>
                                    ) : (
                                       <Fragment>0 following</Fragment>
                                    )}
                                 </h6>
                              </div>
                           </div>
                        </div>
                        <hr />
                        <div className='gallery Profile__images'>
                           {data.map((item) => {
                              return (
                                 <img
                                    key={item._id}
                                    className='item'
                                    src={item.photo}
                                    alt={item.title}
                                    height='120'
                                    width='100'
                                 />
                              )
                           })}
                        </div>
                     </div>
                  </Container>
               </Fragment>
            </Fragment>
         ) : (
            <Spinner />
         )}
      </Fragment>
   )
}

export default Profile
