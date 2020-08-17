import React, { useState, useEffect, Fragment, useContext } from 'react'
import { UserContext } from '../../App'
import { useHistory } from 'react-router-dom'
import Card from '@material-ui/core/Card'
import Container from '@material-ui/core/Container'
import Spinner from '../Spinner'
import M from 'materialize-css'
import axios from 'axios'
import { SET_LOADING, REMOVE_LOADING } from '../../actions/actionTypes'

const CreatePost = () => {
   const { state, dispatch } = useContext(UserContext)
   const history = useHistory()
   const [title, setTitle] = useState('')
   const [body, setBody] = useState('')
   const [image, setImage] = useState('')
   const [url, setUrl] = useState('')

   useEffect(() => {
      async function postData() {
         if (url) {
            try {
               const config = {
                  headers: {
                     'Content-Type': 'application/json',
                     'x-auth-token': localStorage.getItem('jwt'),
                  },
               }
               const bodyy = JSON.stringify({ title, body, url })

               await axios.post('/createpost', bodyy, config)
               M.toast({
                  html: 'Post Created!',
                  classes: '#43a047 green darken-1',
               })
               dispatch({
                  type: REMOVE_LOADING,
               })
               history.push('/')
            } catch (err) {
               dispatch({
                  type: REMOVE_LOADING,
               })
               if (err.response.data.errors) {
                  err.response.data.errors.forEach((e) => {
                     M.toast({ html: e.msg, classes: '#c62828 red darken-3' })
                  })
               }
            }
         }
      }
      postData()
   }, [url])

   const postDetails = async () => {
      const data = new FormData()
      data.append('file', image)
      data.append('upload_preset', 'insta-clone')
      data.append('cloud_name', 'anandu777')
      try {
         dispatch({
            type: SET_LOADING,
         })
         const res = await axios.post(
            'https://api.cloudinary.com/v1_1/anandu777/image/upload',
            data
         )
         setUrl(res.data.url)
      } catch (err) {
         dispatch({
            type: REMOVE_LOADING,
         })
         if (err.response.data.error) {
            M.toast({
               html: 'All fields are required!',
               classes: '#c62828 red darken-3',
            })
         }
      }
   }

   return (
      <Fragment>
         {state.loading === false ? (
            <Container maxWidth='lg'>
               <Card
                  className='input-field'
                  style={{
                     margin: '30px auto',
                     maxWidth: '500px',
                     padding: '20px',
                     textAlign: 'center',
                  }}
               >
                  <div>
                     <input
                        type='text'
                        placeholder='Title'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                     />
                  </div>
                  <div>
                     <input
                        type='text'
                        placeholder='Body'
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                     />
                  </div>
                  <div className='file-field input-field'>
                     <div className='btn #64b5f6 blue darken-1'>
                        <span>Upload Image</span>
                        <input
                           type='file'
                           onChange={(e) => setImage(e.target.files[0])}
                        />
                     </div>
                     <div className='file-path-wrapper'>
                        <input className='file-path validate' type='text' />
                     </div>
                  </div>
                  <button
                     className='btn waves-effect waves-light #64b5f6 blue darken-1'
                     onClick={postDetails}
                  >
                     Create Post
                  </button>
               </Card>
            </Container>
         ) : (
            <Spinner />
         )}
      </Fragment>
   )
}

export default CreatePost
