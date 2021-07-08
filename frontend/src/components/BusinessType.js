import { useState } from "react"
import { RiSuitcaseLine } from 'react-icons/ri'
import { BiHomeAlt } from 'react-icons/bi'
import { BsInfoCircle } from 'react-icons/bs'
import './BusinessType.css'
import Card from '../shared/Card'

const axios = require('axios')

const BusinessType = (props) => {
    const [pan, setPan] = useState()
    const [show, setShow] = useState()
    let storedData = JSON.parse(localStorage.getItem('vendor'))
    const vendorId = storedData && storedData.vendor.vendorId
    

    const submitHandler = e => {
        e.preventDefault()
        axios.post(`http://localhost:5000/api/vendors/addPan/${vendorId}`, {
            pan_no: pan,
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
                props.status()

            })
            .catch(function (error) {
                console.log(error.response.data.error) //For exact message use error.response.data.error
            })
    }

    return (
        <>
            <div className="business-type">
                <p className='heading'>First up, choose your business type</p>
                <p className='description'>Select a category that best describes your business and what customers can expect from you. This will help customers find your business when they need it</p>
                <div className="type-card">
                    <Card className="card-1">
                        <RiSuitcaseLine size={30} />
                        <p className="card-heading">Business with GST</p>
                        <p className="card-description">Choose this if you're a registered business with GST certification</p>
                    </Card>
                    <Card className="card-1">
                        <div onClick={() => setShow(true)}>
                            <BiHomeAlt size={30} />
                            <p className="card-heading">Small/home based business</p>
                            <p className="card-description">Choose this if you're a running it as a small, home based setup</p>
                        </div>
                    </Card>
                </div>
                <div className="info-icon">
                    <BsInfoCircle />
                    <p>You'll be required to submit relevant proofs to verify either of the above</p>
                </div>
                <hr />
                {show && <form onSubmit={submitHandler} className='pan-form'>
                    <p>Your PAN No</p>
                    <input
                        name="pan"
                        type="text"
                        placeholder="Type in your PAN No here"
                        onChange={e => setPan(e.target.value)}
                        value={pan}
                        required
                    /><br />
                    <button type="submit" className="pan-button">Submit</button>
                </form>}
            </div>

        </>
    )
}

export default BusinessType