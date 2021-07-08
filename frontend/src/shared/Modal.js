import React from 'react'
import ReactDom from 'react-dom'

import { useHistory } from 'react-router-dom'
import { useState } from 'react'

import BackDrop from './Backdrop'
import { GiHand } from 'react-icons/gi'
import { CSSTransition } from 'react-transition-group'

import './Modal.css'
import '../components/SignupModal.css'

const axios = require('axios')

const ModalOverlay = props => {
    const history = useHistory()
    const [signupDetails, setSignupDetails] = useState({ name: "", email: "", password: "", })

    const submitHandler = e => {
        e.preventDefault()
        console.log(signupDetails)
        axios.post('http://localhost:5000/api/vendors/signup', {
            name: signupDetails.name,
            email: signupDetails.email,
            password: signupDetails.password,
        },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
            .then(function (response) {
                //handle response
                console.log('success')
                console.log(response.data)
                localStorage.setItem('vendor', JSON.stringify({ vendor: response.data }))
                history.push('/category')
            })
            .catch(function (error) {
                console.log(error.response.data.error) //For exact message use error.response.data.error
            })
    }

    const content = (
        <div className={`modal ${props.className}`} style={props.style}>
            <header className={`modal__header ${props.headerClass}`}>
                <p className="icon">{props.cancelIcon}</p>
                <p>{props.header}</p>
            </header>
            <form onSubmit={submitHandler}>
                <div className="form" >
                    <div className="welcome">
                        <GiHand size={25} className="hand-icon" />
                        <p>Hey!</p>
                    </div>
                    <div >
                        <input
                            name="name"
                            type="text"
                            placeholder="Your Name"
                            onChange={e => setSignupDetails({ ...signupDetails, name: e.target.value })}
                            value={signupDetails.name}
                            required
                        /><br />
                        <input
                            name="email"
                            type="text"
                            placeholder="Email"
                            onChange={e => setSignupDetails({ ...signupDetails, email: e.target.value })}
                            value={signupDetails.email}
                            required
                        /><br />
                        <input
                            name="password"
                            type="password"
                            placeholder="Passowrd"
                            onChange={e => setSignupDetails({ ...signupDetails, password: e.target.value })}
                            value={signupDetails.password}
                            required
                        /><br />
                        <button type="submit" >Create My Account</button><br /> <br />
                        <hr />
                        <div className="or">
                            <p>or</p>
                        </div>
                        <button style={{ backgroundColor: " #ffff", color: "#383E41", border: "solid 2px #383E41" }}>Continue with Google</button><br />
                        <p>Already have an account? <a href="/">login</a></p>
                    </div>
                </div>
            </form>
        </div>
    )

    return ReactDom.createPortal(content, document.getElementById('modal-hook'))
}

const Modal = props => {
    return <React.Fragment>
        {props.show && <BackDrop onClick={props.onCancel} />}
        <CSSTransition
            in={props.show}
            mountOnEnter
            unmountOnExit
            timeout={200}
            classNames='modal'>
            <ModalOverlay {...props} />
        </CSSTransition>
    </React.Fragment>

}

export default Modal