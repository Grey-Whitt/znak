import React, { useRef, useState, useCallback } from 'react'
import Webcam from 'react-webcam'
import { Button, Container, Col, Row } from 'react-bootstrap'

const Camera = () => {
  const videoConstraints = {
    width: 400,
    height: 400,
    facingMode: 'user',
    audio: false,
  }

  const webcamRef = useRef(null)
  const [imgSrc, setImgSrc] = useState(null)

  const handleCapture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot()
    setImgSrc(imageSrc.split(',')[1])
  }, [webcamRef, setImgSrc, imgSrc])

  return (
    <>
      <Row>
        <Col md={12} className='mb-3 d-flex justify-content-center'>
          {imgSrc ? (
            <img src={`data:image/jpeg;base64,${imgSrc}`} alt='alt' />
          ) : (
            <Webcam
              videoConstraints={videoConstraints}
              ref={webcamRef}
              screenshotFormat='image/jpeg'
            />
          )}
        </Col>
      </Row>
      <Row>
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
            onClick={() => setImgSrc(null)}
            disabled={!imgSrc}
          >
            Retake
          </Button>

          <Button className='mx-2 py-2' variant='success'>
            Translate
          </Button>
        </Col>
      </Row>
    </>
  )
}

export default Camera
