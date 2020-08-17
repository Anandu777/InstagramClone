import React, { useState, useContext, Fragment, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { UserContext } from '../../App'
import Container from '@material-ui/core/Container'
import Card from '@material-ui/core/Card'
import M from 'materialize-css'
import axios from 'axios'
import { SET_LOADING, REMOVE_LOADING } from '../../actions/actionTypes'
import Spinner from '../Spinner'

const UpdateImage = () => {
   const { state, dispatch } = useContext(UserContext)
   const [image, setImage] = useState()
   const [url, setUrl] = useState('')
   const history = useHistory()

   useEffect(() => {
      async function postImage() {
         if (url) {
            try {
               const config = {
                  headers: {
                     'Content-Type': 'application/json',
                     'x-auth-token': localStorage.getItem('jwt'),
                  },
               }

               const body = JSON.stringify({ url })

               await axios.patch('/updatepicture', body, config)

               dispatch({
                  type: REMOVE_LOADING,
               })

               M.toast({
                  html: 'Profile picture updated!',
                  classes: '#43a047 green darken-1',
               })
               history.push('/profile')
            } catch (err) {
               dispatch({
                  type: REMOVE_LOADING,
               })

               M.toast({
                  html: 'Image is required!',
                  classes: '#c62828 red darken-3',
               })
            }
         }
      }
      postImage()
   }, [url])

   const updateImage = async () => {
      if (!image) {
         M.toast({
            html: 'Image is required!',
            classes: '#c62828 red darken-3',
         })
         return
      }
      dispatch({
         type: SET_LOADING,
      })
      const data = new FormData()
      data.append('file', image)
      data.append('upload_preset', 'insta-clone')
      data.append('cloud_name', 'anandu777')
      try {
         const res = await axios.post(
            'https://api.cloudinary.com/v1_1/anandu777/image/upload',
            data
         )

         setUrl(res.data.url)
      } catch (err) {
         dispatch({
            type: REMOVE_LOADING,
         })

         M.toast({
            html: 'Image is required!',
            classes: '#c62828 red darken-3',
         })
      }
   }

   return (
      <Fragment>
         {state.loading ? (
            <Spinner />
         ) : (
            <Container maxWidth='lg'>
               <div className='mycard'>
                  <Card className='auth-card input-field'>
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
                        onClick={updateImage}
                     >
                        Update
                     </button>
                  </Card>
               </div>
            </Container>
         )}
      </Fragment>
   )
}

export default UpdateImage
