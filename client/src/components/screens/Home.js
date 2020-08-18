import React, { useContext, useState, useEffect, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../../App'
import axios from 'axios'
import {
   ALLPOSTS,
   SET_LOADING,
   REMOVE_LOADING,
   CLEAR_MYPOSTS,
   CLEAR_OTHERSPOSTS,
} from '../../actions/actionTypes'
import Container from '@material-ui/core/Container'
import Card from '@material-ui/core/Card'
import M from 'materialize-css'
import Spinner from '../Spinner'

const Home = () => {
   const { state, dispatch } = useContext(UserContext)
   const [data, setData] = useState([])

   useEffect(() => {
      getAllPosts()
   }, [])

   async function getAllPosts() {
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
         const res = await axios.get('/allpost', config)
         setData(res.data.posts)
         dispatch({
            type: ALLPOSTS,
            payload: res.data.posts,
         })
         dispatch({
            type: CLEAR_MYPOSTS,
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

   const likePost = async (id) => {
      const token = localStorage.getItem('jwt')
      const config = {
         headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
         },
      }

      const body = JSON.stringify({ postId: id })
      try {
         const res = await axios.put('/like', body, config)
         const newData = data.map((item) => {
            if (item._id === res.data._id) {
               return res.data
            } else {
               return item
            }
         })
         setData(newData)
         dispatch({
            type: ALLPOSTS,
            payload: newData,
         })
      } catch (err) {
         console.error(err)
      }
   }

   const unlikePost = async (id) => {
      const token = localStorage.getItem('jwt')
      const config = {
         headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token,
         },
      }

      const body = JSON.stringify({ postId: id })
      try {
         const res = await axios.put('/unlike', body, config)
         const newData = data.map((item) => {
            if (item._id === res.data._id) {
               return res.data
            } else {
               return item
            }
         })
         setData(newData)
         dispatch({
            type: ALLPOSTS,
            payload: newData,
         })
      } catch (err) {
         console.error(err)
      }
   }

   const makeComment = async (text, postId) => {
      try {
         const token = localStorage.getItem('jwt')
         const config = {
            headers: {
               'Content-Type': 'application/json',
               'x-auth-token': token,
            },
         }

         const body = JSON.stringify({ postId, text })
         const res = await axios.put('/comment', body, config)
         const newData = data.map((item) => {
            if (item._id === res.data._id) {
               return res.data
            } else {
               return item
            }
         })
         setData(newData)
         dispatch({
            type: ALLPOSTS,
            payload: newData,
         })

         M.toast({
            html: 'Commented!',
            classes: '#43a047 green darken-1',
         })
      } catch (err) {
         console.error(err)
      }
   }

   const deletePost = async (postId) => {
      try {
         const token = localStorage.getItem('jwt')
         const config = {
            headers: {
               'x-auth-token': token,
            },
         }
         const res = await axios.delete(`/deletepost/${postId}`, config)
         const newData = data.filter((item) => item._id !== res.data._id)
         setData(newData)
         dispatch({
            type: ALLPOSTS,
            payload: newData,
         })

         M.toast({
            html: 'Post deleted!',
            classes: '#43a047 green darken-1',
         })
      } catch (err) {
         console.error(err)
      }
   }

   const deleteComment = async (postId, commentId) => {
      try {
         const token = localStorage.getItem('jwt')
         const config = {
            headers: {
               'x-auth-token': token,
            },
         }
         const res = await axios.delete(
            `/deletecomment/${postId}/${commentId}`,
            config
         )
         const newData = data.map((item) => {
            if (item._id === res.data._id) {
               return res.data
            } else {
               return item
            }
         })
         setData(newData)
         dispatch({
            type: ALLPOSTS,
            payload: newData,
         })

         M.toast({
            html: 'Comment deleted!',
            classes: '#43a047 green darken-1',
         })
      } catch (err) {
         console.error(err.response)
      }
   }

   return (
      <Fragment>
         {state.loading === false ? (
            <div className='home'>
               {state.user && (
                  <Fragment>
                     {state.allposts.length > 0 ? (
                        state.allposts.map((item) => {
                           return (
                              <Container maxWidth='lg' key={item._id}>
                                 <Card
                                    className='home-card'
                                    style={{ padding: '15px' }}
                                 >
                                    {state.user._id === item.postedBy._id ? (
                                       <h5 style={{ marginTop: '0px' }}>
                                          <span>{item.postedBy.name} </span>
                                       </h5>
                                    ) : (
                                       <h5 style={{ marginTop: '0px' }}>
                                          <Link
                                             to={`/profile/${item.postedBy._id}`}
                                          >
                                             <span className='Home__name'>
                                                {item.postedBy.name}{' '}
                                             </span>
                                          </Link>
                                       </h5>
                                    )}

                                    <div className='card-image'>
                                       <img
                                          style={{
                                             display: 'block',
                                             marginLeft: 'auto',
                                             marginRight: 'auto',
                                          }}
                                          className='home-image'
                                          src={item.photo}
                                          alt='wallpaper'
                                          height='320'
                                          width='450'
                                       />
                                    </div>
                                    <div
                                       className='card-content'
                                       style={{ marginTop: '15px' }}
                                    >
                                       {item.likes ? (
                                          <Fragment>
                                             {!item.likes.includes(
                                                state.user._id
                                             ) ? (
                                                <i
                                                   className='material-icons like'
                                                   onClick={() => {
                                                      likePost(item._id)
                                                   }}
                                                >
                                                   favorite
                                                </i>
                                             ) : (
                                                <i
                                                   className='material-icons unlike'
                                                   style={{ color: 'red' }}
                                                   onClick={() => {
                                                      unlikePost(item._id)
                                                   }}
                                                >
                                                   favorite
                                                </i>
                                             )}
                                          </Fragment>
                                       ) : (
                                          <Fragment>
                                             <i
                                                className='material-icons unlike'
                                                style={{ color: 'red' }}
                                                onClick={() => {
                                                   unlikePost(item._id)
                                                }}
                                             >
                                                favorite
                                             </i>
                                          </Fragment>
                                       )}

                                       {state.user._id ===
                                          item.postedBy._id && (
                                          <Fragment>
                                             <i
                                                className='material-icons delete'
                                                style={{ float: 'right' }}
                                                onClick={() => {
                                                   deletePost(item._id)
                                                }}
                                             >
                                                delete
                                             </i>
                                          </Fragment>
                                       )}

                                       <h6>
                                          {item.likes.length > 1 ? (
                                             <Fragment>
                                                {item.likes.length} likes
                                             </Fragment>
                                          ) : (
                                             <Fragment>
                                                {item.likes.length} like
                                             </Fragment>
                                          )}
                                       </h6>
                                       <h6>{item.title}</h6>
                                       <p>{item.body}</p>
                                       {item.comments.map((comment) => {
                                          return (
                                             <h6 key={comment._id}>
                                                <span
                                                   style={{ fontWeight: '500' }}
                                                >
                                                   {comment.postedBy.name}{' '}
                                                </span>
                                                {comment.text}
                                                {(state.user._id ===
                                                   item.postedBy._id ||
                                                   state.user._id ===
                                                      comment.postedBy._id) && (
                                                   <Fragment>
                                                      <i
                                                         className='material-icons delete'
                                                         style={{
                                                            float: 'right',
                                                            marginBottom:
                                                               '-1px',
                                                         }}
                                                         onClick={() => {
                                                            deleteComment(
                                                               item._id,
                                                               comment._id
                                                            )
                                                         }}
                                                      >
                                                         delete
                                                      </i>
                                                   </Fragment>
                                                )}
                                             </h6>
                                          )
                                       })}
                                       <form
                                          onSubmit={(e) => {
                                             e.preventDefault()
                                             const pattern = /^[^\s][\w\W]*$/i
                                             if (e.target[0].value === '') {
                                                return M.toast({
                                                   html:
                                                      'Comment cannot be empty!',
                                                   classes:
                                                      '#c62828 red darken-3',
                                                })
                                             }
                                             if (
                                                !pattern.test(e.target[0].value)
                                             ) {
                                                return M.toast({
                                                   html:
                                                      'Comment should not start with space!',
                                                   classes:
                                                      '#c62828 red darken-3',
                                                })
                                             }
                                             makeComment(
                                                e.target[0].value,
                                                item._id
                                             )
                                             e.target[0].value = ''
                                          }}
                                       >
                                          <input
                                             type='text'
                                             placeholder='Add a comment'
                                          />
                                       </form>
                                    </div>
                                 </Card>
                              </Container>
                           )
                        })
                     ) : (
                        <Container maxWidth='lg'>
                           <div className='Home__nopost'>
                              <h4>Please follow someone to view their posts</h4>
                           </div>
                        </Container>
                     )}
                  </Fragment>
               )}
            </div>
         ) : (
            <Spinner />
         )}
      </Fragment>
   )
}

export default Home
