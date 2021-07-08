import { useState } from 'react'
import { AiOutlineAntDesign } from 'react-icons/ai'
import { GiHand } from 'react-icons/gi'
import { MdDone } from 'react-icons/md'
import BusinessCategory from './BusinessCategory'
import BusinessType from './BusinessType'

import './Sidebar.css'

const Sidebar = () => {

    const [active, setActive] = useState(true)
    const [businessTypeStatus, setBusinessTypeStatus] = useState(null)

    const statusHandler = () => {
        console.log('statusHandler')
        setActive(false);
        setBusinessTypeStatus(true)
    }

    return (
        <>
            <div className='listing'>
                <div className='sidebar'>
                    <div className="icon">
                        <AiOutlineAntDesign size={30} />
                    </div>
                    <div className="content">
                        <span className="greeting">
                            <p>Hello</p>
                            <GiHand style={{ color: "#F8D064" }} size={30} />
                        </span>
                        <p className="about">Tell us a bit about your business, so that we can help you create a perfect listing.</p>
                        <div className="buttons-section">
                            <button className={active ? 'active' : 'buttons'}>Business Type {businessTypeStatus && <MdDone className="tick" />}</button><br />
                            <button onClick={statusHandler} className={!active ? 'active' : 'buttons'}>Category {businessTypeStatus !== null && !businessTypeStatus && <MdDone className="tick" />}</button><br />
                        </div>
                    </div>
                </div>
                {active ? <BusinessType status={statusHandler} /> : <BusinessCategory />}
            </div>
        </>
    )
}
export default Sidebar