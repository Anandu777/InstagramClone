import React, { useContext, useState, useEffect, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../../App'
import axios from 'axios'
import {
   ALLPOSTS,
   SET_LOADING,
   REMOVE_LOADING,
} from '../../actions/actionTypes'
import Container from '@material-ui/core/Container'
import Card from '@material-ui/core/Card'
import M from 'materialize-css'
import Spinner from '../Spinner'
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

const Home = () => {
   const { state, dispatch } = useContext(UserContext)
   const [data, setData] = useState([])
   const classes = useStyles()
   const [open, setOpen] = useState(false)
   const [postOpen, setPostOpen] = useState(false)
   useEffect(() => {
      getAllPosts()
   }, [])

   const handleOpen = () => {
      setOpen(true)
   }

   const handleClose = () => {
      setOpen(false)
   }

   const handlePostOpen = () => {
      setPostOpen(true)
   }

   const handlePostClose = () => {
      setPostOpen(false)
   }

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
         await axios.put('/like', body, config)
         getAllPosts()
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
         await axios.put('/unlike', body, config)
         getAllPosts()
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
         await axios.put('/comment', body, config)
         getAllPosts()
         M.toast({
            html: 'Commented!',
            classes: '#43a047 green darken-1',
         })
      } catch (err) {
         console.error(err)
      }
   }

   const deletePost = async (postId) => {
      handlePostClose()
      try {
         const token = localStorage.getItem('jwt')
         const config = {
            headers: {
               'x-auth-token': token,
            },
         }
         await axios.delete(`/deletepost/${postId}`, config)
         getAllPosts()
         M.toast({
            html: 'Post deleted!',
            classes: '#43a047 green darken-1',
         })
      } catch (err) {
         console.error(err)
      }
   }

   const deleteComment = async (postId, commentId) => {
      handleClose()
      try {
         const token = localStorage.getItem('jwt')
         const config = {
            headers: {
               'x-auth-token': token,
            },
         }
         await axios.delete(`/deletecomment/${postId}/${commentId}`, config)
         getAllPosts()
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
                                                onClick={handlePostOpen}
                                             >
                                                delete
                                             </i>
                                             {/* Delete post modal */}
                                             <Modal
                                                aria-labelledby='transition-modal-title'
                                                aria-describedby='transition-modal-description'
                                                className={classes.modal}
                                                open={postOpen}
                                                onClose={handlePostClose}
                                                closeAfterTransition
                                                BackdropComponent={Backdrop}
                                                BackdropProps={{
                                                   timeout: 500,
                                                }}
                                             >
                                                <Fade in={postOpen}>
                                                   <div
                                                      className={classes.paper}
                                                      style={{
                                                         display: 'flex',
                                                         flexDirection:
                                                            'column',
                                                      }}
                                                   >
                                                      <h3
                                                         style={{
                                                            marginLeft: 'auto',
                                                            marginRight: 'auto',
                                                         }}
                                                      >
                                                         Delete Post
                                                      </h3>
                                                      <p
                                                         style={{
                                                            marginLeft: 'auto',
                                                            marginRight: 'auto',
                                                         }}
                                                      >
                                                         Are you sure?
                                                      </p>
                                                      <button
                                                         className='btn waves-effect waves-light #64b5f6 blue darken-1'
                                                         onClick={() => {
                                                            deletePost(item._id)
                                                         }}
                                                         style={{
                                                            marginLeft: 'auto',
                                                            marginRight: 'auto',
                                                         }}
                                                      >
                                                         Delete
                                                      </button>
                                                   </div>
                                                </Fade>
                                             </Modal>
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
                                                         onClick={handleOpen}
                                                      >
                                                         delete
                                                      </i>
                                                      {/* Delete comment modal */}
                                                      <Modal
                                                         aria-labelledby='transition-modal-title'
                                                         aria-describedby='transition-modal-description'
                                                         className={
                                                            classes.modal
                                                         }
                                                         open={open}
                                                         onClose={handleClose}
                                                         closeAfterTransition
                                                         BackdropComponent={
                                                            Backdrop
                                                         }
                                                         BackdropProps={{
                                                            timeout: 500,
                                                         }}
                                                      >
                                                         <Fade in={open}>
                                                            <div
                                                               className={
                                                                  classes.paper
                                                               }
                                                               style={{
                                                                  display:
                                                                     'flex',
                                                                  flexDirection:
                                                                     'column',
                                                               }}
                                                            >
                                                               <h3
                                                                  style={{
                                                                     marginLeft:
                                                                        'auto',
                                                                     marginRight:
                                                                        'auto',
                                                                  }}
                                                               >
                                                                  Delete Comment
                                                               </h3>
                                                               <p
                                                                  style={{
                                                                     marginLeft:
                                                                        'auto',
                                                                     marginRight:
                                                                        'auto',
                                                                  }}
                                                               >
                                                                  Are you sure?
                                                               </p>
                                                               <button
                                                                  className='btn waves-effect waves-light #64b5f6 blue darken-1'
                                                                  onClick={() => {
                                                                     deleteComment(
                                                                        item._id,
                                                                        comment._id
                                                                     )
                                                                  }}
                                                                  style={{
                                                                     marginLeft:
                                                                        'auto',
                                                                     marginRight:
                                                                        'auto',
                                                                  }}
                                                               >
                                                                  Delete
                                                               </button>
                                                            </div>
                                                         </Fade>
                                                      </Modal>
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
