import { useState } from 'react'

import image531 from './image531.png'
import SignupModal from './SignupModal'
import './CreateListing.css'
const CreateListing = () => {
    const [modal, setModal] = useState(false)
    console.log('create Listing')
    return (
        <>
            <SignupModal show={modal} onClear={()=> setModal(false)} />
            <div className="create-listing">
                <img src={image531} alt='icon' className="image" />
                <div className="image-content">
                    <div className="head">
                        <b style={{ fontSize: '16px' }}>INDIA'S FIRST PARENTING MARKETPLACE</b><br></br><br></br>
                        <b style={{ fontSize: '50px' }}>List your business online.</b><br></br><br></br>
                        <b style={{ fontSize: '50px' }}>Start getting orders</b>
                        <p style={{ fontSize: '16px' }}>Local empowers small businesses to build their e-Commerce listing, put it in front of millions of parents and drive more sales</p>
                        <div className="auth-buttons">
                            <button onClick={() => setModal(true)}>Create my free listing</button>
                            <a>Login</a>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default CreateListing