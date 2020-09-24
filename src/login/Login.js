import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';


function Login () {
 
  
return (
  <div>
      <div className="d-flex justify-content-center" >
        <h1 style={{ color:'#2372A3', fontFamily:'Time New Roman', textAlign:'center',fontWeight:'Bold',opacity:1 ,display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize:40, marginTop:10 }}>Self Ordering</h1>
        <div
          style={{
            backgroundColor: '#fff',
            width: '50vw',
            padding: 10,
            marginLeft: 350 , 
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily:'noto sans lao',
            fontSize:"24px",
            marginTop:5
          }}
        >
          <h2>
            <b>ຍິນດີຕອ້ນຮັບ ກະລຸນາລ໋ອກອິນ</b>
          </h2>
          <Form noValidate style={{ width: '100%', paddingTop: 32 }}>
            <Form.Group as={Row} controlId="formPlaintextEmail">
              <Form.Label column sm="2">
                {/* <FontAwesomeIcon icon={['fas', 'user']} size="2x" color="#057CAE" style={{ marginTop:"-5"}}/> */}
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  value={''}
                  // onChange={(e) => _handleChangeUserId(e)}
                  placeholder="ໄອດີ"
                 style={{width:'100%', fontFamily:'noto sans lao', marginTop:35,fontSize:'24px',paddingLeft:20}}
                />
                {/* {!userIdStatus ? <p style={{ color: 'red', fontSize: 14 }}>ກະລຸນາປ້ອນໄອດີ</p> : ''} */}
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formPlaintextPassword">
              <Form.Label column sm="2">
                {/* <FontAwesomeIcon icon={['fas', 'lock']} size="2x" color="#057CAE" style={{marginTop:"-5"}} /> */}
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="password"
                  // onChange={(e) => _handleChangePassword(e)}
                  // value={password}
                  placeholder="ລະຫັດຜ່ານ"
                  // onKeyDown={(e) => _onEnterKey(e)}
                  tabIndex="0"
                  style={{width:'100%', fontFamily:'noto sans lao', marginTop:45,fontSize:'24px',paddingLeft:20}}
                />

                 
              </Col>
            </Form.Group>

            <Form.Group as={Row}>
              <Form.Label column sm="2" />
              <Form.Label column sm="10">
               
              </Form.Label>
            </Form.Group>
          </Form>

          <Button style={{ width: '100%', backgroundColor: '#2372A3' , fontFamily:'noto sans lao', marginTop:150, borderRadius:5,fontSize:'24px'}} >
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                width: '100%'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  width: '100%',
                  fontSize: 24
                }}
              >
                ລ໊ອກອິນ
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  width: 30,
                  alignItems: 'flex-end'
                }}
              >
                {/* <FontAwesomeIcon
                  icon={['fas', 'sign-in-alt']}
                  style={{ fontSize: 24, fontWeight: 'normal' }}
                  color="#fff"
                /> */}
              </div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  
);
}

export default Login;
