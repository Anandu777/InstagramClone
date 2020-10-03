import React, { useEffect, useState, useContext, Fragment } from 'react'
import { UserContext } from '../../App'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import {
   REMOVE_LOADING,
   SET_LOADING,
   CLEAR_MYPOSTS,
   OTHERSPOSTS,
} from '../../actions/actionTypes'
import Container from '@material-ui/core/Container'
import Spinner from '../Spinner'

const OthersProfile = () => {
   const { state, dispatch } = useContext(UserContext)
   const [profile, setProfile] = useState()
   const { userId } = useParams()

   useEffect(() => {
      getUserDetails()
   }, [])

   async function getUserDetails() {
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
         const res = await axios.get(`/user/${userId}`, config)
         if (res.data.flag) {
            setProfile(res.data)
         } else {
            setProfile({
               ...profile,
               user: res.data.user,
               posts: [],
               postsCount: res.data.postsCount,
               flag: false,
            })
         }

         dispatch({
            type: OTHERSPOSTS,
            payload: res.data.posts,
         })
         dispatch({
            type: CLEAR_MYPOSTS,
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

   const followUser = async (followId) => {
      const token = localStorage.getItem('jwt')
      const config = {
         headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
         },
      }

      const body = JSON.stringify({ followId })

      try {
         const res = await axios.patch('/follow', body, config)

         setProfile({
            ...profile,
            user: res.data,
            posts: state.othersposts,
            flag: true,
         })
      } catch (err) {
         console.error(err.response)
      }
   }

   const unfollowUser = async (unfollowId) => {
      const token = localStorage.getItem('jwt')
      const config = {
         headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
         },
      }

      const body = JSON.stringify({ unfollowId })

      try {
         const res = await axios.patch('/unfollow', body, config)

         setProfile({
            ...profile,
            user: res.data,
            posts: [],
            flag: false,
         })
      } catch (err) {
         console.error(err.response.data)
      }
   }

   return (
      <Fragment>
         {state.loading === false ? (
            <Fragment>
               {profile && (
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
                              <img
                                 style={{
                                    width: '140px',
                                    height: '140px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                 }}
                                 src={profile.user && profile.user.photo}
                                 alt='Person'
                              />
                           </div>
                           <div style={{ marginLeft: '10px' }}>
                              <h4>{profile.user && profile.user.name}</h4>
                              <div
                                 style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    width: '108%',
                                 }}
                              >
                                 <h6>
                                    {profile.postsCount ? (
                                       <Fragment>
                                          {profile.postsCount > 1 ? (
                                             <Fragment>
                                                {profile.postsCount} posts
                                             </Fragment>
                                          ) : (
                                             <Fragment>
                                                {profile.postsCount} post
                                             </Fragment>
                                          )}
                                       </Fragment>
                                    ) : (
                                       <Fragment>0 post</Fragment>
                                    )}
                                 </h6>
                                 <h6>
                                    {profile.user.followers ? (
                                       <Fragment>
                                          {profile.user.followers.length > 1 ? (
                                             <Fragment>
                                                {profile.user.followers.length}{' '}
                                                followers
                                             </Fragment>
                                          ) : (
                                             <Fragment>
                                                {profile.user.followers.length}{' '}
                                                follower
                                             </Fragment>
                                          )}
                                       </Fragment>
                                    ) : (
                                       <Fragment>0 follower</Fragment>
                                    )}
                                 </h6>
                                 <h6>
                                    {profile.user.following ? (
                                       <Fragment>
                                          {profile.user.following.length > 1 ? (
                                             <Fragment>
                                                {profile.user.following.length}{' '}
                                                followings
                                             </Fragment>
                                          ) : (
                                             <Fragment>
                                                {profile.user.following.length}{' '}
                                                following
                                             </Fragment>
                                          )}
                                       </Fragment>
                                    ) : (
                                       <Fragment>0 following</Fragment>
                                    )}
                                 </h6>
                              </div>
                              <div>
                                 {profile.user.followers ? (
                                    <Fragment>
                                       {profile.user.followers.includes(
                                          state.user._id
                                       ) ? (
                                          <button
                                             className='btn waves-effect waves-light #64b5f6 blue darken-1'
                                             onClick={() =>
                                                unfollowUser(profile.user._id)
                                             }
                                          >
                                             Unfollow
                                          </button>
                                       ) : (
                                          <button
                                             className='btn waves-effect waves-light #64b5f6 blue darken-1'
                                             onClick={() =>
                                                followUser(profile.user._id)
                                             }
                                          >
                                             Follow
                                          </button>
                                       )}
                                    </Fragment>
                                 ) : (
                                    <button
                                       className='btn waves-effect waves-light #64b5f6 blue darken-1'
                                       onClick={() =>
                                          followUser(profile.user._id)
                                       }
                                    >
                                       Follow
                                    </button>
                                 )}
                              </div>
                           </div>
                        </div>
                        <hr />
                        <div className='gallery OthersProfile__images'>
                           {profile.posts &&
                              profile.posts.map((item) => {
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
               )}
            </Fragment>
         ) : (
            <Spinner />
         )}
      </Fragment>
   )
}

export default OthersProfile
