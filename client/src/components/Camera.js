import React, { useRef, useState, useCallback } from 'react'
import Webcam from 'react-webcam'
import axios from 'axios'
import { Button, Col, Row, Form, Container } from 'react-bootstrap'
import Loader from './Loader'

const Camera = () => {
  // Set video parameters
  const videoConstraints = {
    width: 400,
    height: 400,
    facingMode: 'user', // will use front facing camera if on mobile
    audio: false,
  }

  // set webcamRef to null on render (useRef does not re render when updated whereas useEffect would)
  const webcamRef = useRef(null)

  // set initial state of imgSrc to null
  const [imgSrc, setImgSrc] = useState(null)

  //set initial state of translation to empty string
  const [translation, setTranslation] = useState('')

  const handleCapture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot()
    setImgSrc(imageSrc)
  }, [webcamRef, setImgSrc])

  const sendImage = async () => {
    try {
      const config = {
        headers: { 'Content-Type': 'application/json' },
      }

      console.log(imgSrc)

      await axios.post('/api/image', { image: imgSrc }, config)
      setImgSrc(null)
    } catch (error) {
      setImgSrc(null)
      window.alert(error)
    }
  }

  const submitHandler = (e) => {
    e.preventDefault()

    setTranslation('lorem ipsum dolor sit amet')
  }

  const [loading, setLoading] = useState(true)

  const handleUserMedia = () => setTimeout(() => setLoading(false), 200)

  return (
    <>
      <Row className='py-3'>
        <Col className='d-flex justify-content-center'>
          <Button
            className='mx-2 py-2'
            variant='primary'
            onClick={() => handleCapture()}
            disabled={imgSrc}
          >
            Take Picture
          </Button>

          <Button
            className='mx-2 py-2'
            variant='danger'
            onClick={() => {
              setImgSrc(null)
              setLoading(true)
            }}
            disabled={!imgSrc}
          >
            Retake
          </Button>

          <Button
            className='mx-2 py-2'
            variant='info'
            onClick={() => {
              sendImage()
              setLoading(true)
            }}
            disabled={!imgSrc}
          >
            Send Picture
          </Button>
        </Col>
      </Row>

      <Row>
        {loading && (
          <div>
            <Loader />
          </div>
        )}
        <Col md={12} className='mb-3 d-flex justify-content-center'>
          {imgSrc ? (
            <img src={imgSrc} alt='alt' />
          ) : (
            <>
              <Webcam
                videoConstraints={videoConstraints}
                ref={webcamRef}
                screenshotFormat='image/jpeg'
                style={{ opacity: loading ? 0 : 1 }}
                onUserMedia={handleUserMedia}
              />
            </>
          )}
        </Col>
      </Row>

      <Row>
        <Col>
          <Form onSubmit={(e) => submitHandler(e)}>
            <Container className='d-flex justify-content-center'>
              {imgSrc && (
                <>
                  <Button
                    variant='success'
                    size='lg'
                    type='submit'
                    className='mx-2'
                  >
                    Translate
                  </Button>

                  <Button
                    variant='warning'
                    size='lg'
                    className='mx-2'
                    onClick={() => {
                      setTranslation('')
                      setImgSrc(null)
                      setLoading(true)
                    }}
                  >
                    Clear
                  </Button>
                </>
              )}
            </Container>
            <Form.Group
              className='mb-3'
              controlId='exampleForm.ControlTextarea1'
            >
              <Form.Label>Translation</Form.Label>
              <Form.Control
                value={translation}
                as='textarea'
                rows={3}
                disabled
              />
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </>
  )
}

export default Camera
