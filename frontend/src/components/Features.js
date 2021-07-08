
import Card from '../shared/Card'
import './Features.css'
import { BsFillPeopleFill } from 'react-icons/bs'
const a = [1,2,3]
const Features = () => {
    return (
        <>
            <div className="features">
                <div className='feature-head'>
                    <div className="circle" />
                    <p>Parents on Local are looking to spend their money with the right businesses.</p>
                </div>
                <div className="feature-content">
                    <div className="feature-card">
                        {a.map(() => {
                            return (<>
                                <div>
                                    <BsFillPeopleFill />
                                    <p className="card-head">1.5+ million parents</p>
                                    <p className="card-details">Nearly 1.5 million parents visit our site each month to find parenting related stuff.</p>
                                </div>
                            </>)
                        })}
                    </div>
                </div>
            </div>
            <hr />
        </>
    )
}

export default Features