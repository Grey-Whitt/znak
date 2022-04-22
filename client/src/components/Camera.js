import React, { useRef, useState, useCallback } from 'react'
import Webcam from 'react-webcam'
import axios from 'axios'
import { Button, Col, Row, Form, Container } from 'react-bootstrap'
import Loader from './Loader'

const Camera = () => {
  // set webcamRef to null on render (useRef does not re render when updated whereas useEffect would)
  const webcamRef = useRef(null)

  // set initial state of imgSrc to null
  const [imgSrc, setImgSrc] = useState(null)

  // set initial state of translation to empty string
  const [translation, setTranslation] = useState('')

  // set initial state of loading to true
  const [loading, setLoading] = useState(true)

  // set the imgSrc variable using the getScreenshot method which returns a base64 image
  const handleCapture = useCallback(() => {
    setImgSrc(webcamRef.current.getScreenshot())
  }, [webcamRef, setImgSrc])

  // send image to api
  const sendImage = async () => {
    try {
      const config = {
        headers: { 'Content-Type': 'application/json' },
      }

      const { data } = await axios.post(
        'https://znak-app.herokuapp.com/jsonroute',
        { image: imgSrc },
        config
      )

      setTranslation(translation + data.value)
      setLoading(true)
      setImgSrc(null)
    } catch (error) {
      setImgSrc(null)
      window.alert(error)
    }
  }

  // send english text to api to be translated
  const translateHandler = async (e) => {
    e.preventDefault()

    const { data } = await axios.post(
      `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${process.env.REACT_APP_YANDEX_KEY}&text=${translation}&lang=en-ru&format=plain`
    )

    setTranslation(data.text[0])
  }

  // when camera loads, set loading to false after 500ms
  const handleUserMedia = () => setTimeout(() => setLoading(false), 500)

  // Set video parameters
  const videoConstraints = {
    width: 350,
    height: 350,
    facingMode: 'user', // will use front facing camera if on mobile
    audio: false,
  }

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
                style={{ opacity: loading ? 0 : 1 }} // if loading = true set opacity to 0, if loading = false set opacity to 1
                onUserMedia={handleUserMedia}
              />
            </>
          )}
        </Col>
      </Row>

      <Row>
        <Col>
          <Form onSubmit={(e) => translateHandler(e)}>
            <Container className='d-flex justify-content-center'>
              {translation && (
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
                    }}
                  >
                    Clear
                  </Button>

                  <Button
                    variant='secondary'
                    size='lg'
                    className='mx-2'
                    onClick={() => {
                      setTranslation(translation.slice(0, -1))
                    }}
                  >
                    Backspace
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
                as='textarea'
                rows={3}
                type='text'
                onChange={(event) => setTranslation(event.target.value)}
                value={translation}
              />
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </>
  )
}

export default Camera
