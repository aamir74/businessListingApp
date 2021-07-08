import { MdCloudDone } from 'react-icons/md'
import { AiOutlineAntDesign } from 'react-icons/ai'
import './SuccessfulRegister.css'
import success from './success.png'

const SuccessfulRegister = () => {

    let storedData = JSON.parse(sessionStorage.getItem('business'))
    const a = ["a", "b"]

    return (
        <>
            <div className="success-page">
                <div className="success-header">
                    <div className="success-icon">
                        <AiOutlineAntDesign size={30} />
                    </div>
                    <div className="success-heading">
                        <p>beign the<br /><span style={{ fontSize: "20px" }}> Parent</span></p>
                    </div>

                </div>
                <hr />
                <div className='success-content'>
                    <div className="details">
                        <MdCloudDone className="done-icon" size={30} />
                        <p style={{ fontSize: "28px", fontWeight: "750" }}>Great! Your Business registered successfully </p>
                        <p style={{ fontSize: "17px", fontWeight: "800" }}>Business details</p>
                        <p style={{ fontSize: "15px", fontWeight: "700" }}>Business Category:<span className="table" > {storedData ? storedData.business.business.category : "xyz category"}</span></p>
                        <p style={{ fontSize: "15px", fontWeight: "700" }}>Suitable for:<span className="table" > {storedData ? storedData.business.business.suitable : "abc"}</span></p>
                        <p style={{ fontSize: "15px", fontWeight: "700" }}>Suitable for:<span className="table" > {storedData ? storedData.business.business.tags : "abc"}</span></p>
                    </div>
                    <div className="illustration">
                        <img src={success} alt='icon' className="image" />
                    </div>
                </div>
                <hr />
            </div>
        </>
    )
}
export default SuccessfulRegister