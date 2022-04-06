import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

const Footer = () => {
  return (
    <>
      <div className='phantom' />
      <footer className='foot'>
        <Container>
          <Row>
            <Col className='text-center'>Copyright &copy; Znak Developers</Col>
          </Row>
        </Container>
      </footer>
    </>
  )
}

export default Footer
