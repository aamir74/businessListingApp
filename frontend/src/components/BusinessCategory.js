
import { useState } from 'react'
import './BusinessCategory.css'
import { HiOutlineLightBulb } from 'react-icons/hi'
import { MdDone } from 'react-icons/md'
import { AiOutlinePlus } from 'react-icons/ai'
import { useHistory } from 'react-router'


const suitable = [{
    name: "Planning for a baby",
    isSelected: false
},
{
    name: "Pregnancy",
    isSelected: false
},
{
    name: "Baby [0 to 12 months]",
    isSelected: false
},
{
    name: "Toddler [1y to 3y]",
    isSelected: false
},
{
    name: "Child [4y to 6y]",
    isSelected: false
},
{
    name: "Kids [7y to 12y]",
    isSelected: false
},
{
    name: "Teen [13y to 18y]",
    isSelected: false
},
]

const axios = require('axios')
const BusinessCategory = () => {
    const [category, setCategory] = useState()
    const [suitableButtons, setSuitableButtons] = useState(suitable)
    const [selectedSuitables, setSelectedSuitables] = useState([])
    const [tags, setTags] = useState()
    const history = useHistory()

    let storedData = JSON.parse(localStorage.getItem('vendor'))
    const token = storedData && storedData.vendor.token

    const submitHandler = e => {
        e.preventDefault()
        console.log(category,selectedSuitables,tags,token)
        axios.post(`http://localhost:5000/api/businesses/add`, {
            category:category,
            suitable:selectedSuitables,
            tags:tags
        }, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
            .then((response) => {
                // handle success
                console.log('success')
                sessionStorage.setItem('business', JSON.stringify({ business: response.data }))
                history.push('/success')
            })
            .catch((error) => {
                console.log(error.response ? error.response.data.error : 'Something went wrong, Pls try again')
            })
    }

    const suitableHandler = (e, b) => {
        e.preventDefault()
        const a = [...suitableButtons]
        a.forEach(a => {
            if (a.name === b.name) {
                a.isSelected = !a.isSelected
                selectedSuitables.push(a.name)
            }
        })
        setSuitableButtons(a)
    }

    const tagHandler = e => {
        e.preventDefault()
        let tag = e.target.value.split(",")
        setTags(tag)
    }

    return (
        <div className="business-category">
            <p className='heading'>What is your business category?</p>
            <p className='description'>Select a category that best describes your business and what customers can expect from you. This will help customers find your business when they need it</p>
            <form className='category-form' onSubmit={submitHandler}>
                <input
                    name="category"
                    type="text"
                    placeholder="Type in your category your looking for"
                    onChange={e => setCategory(e.target.value)}
                    value={category}
                    required
                /><br />
                <div className="bulb-icon">
                    <HiOutlineLightBulb />
                    <p>Select a specific category that you want to focus on E.g. Guitar class [not music class]. This improve your listing's performance</p>
                </div>
                <hr />
                <div className="suitables">
                    <p>Which parenting group is your listing most suitable for? [optional]</p>
                    <div className="suitable-buttons">
                        {suitableButtons.map(b => {
                            return <>

                                <button onClick={e => suitableHandler(e, b)} className={b.isSelected ? "selected-button" : "specific-button"}>{b.name} {b.isSelected ? <MdDone className="tick" /> : <AiOutlinePlus className="tick" />}</button>

                            </>
                        })}
                    </div>
                    <hr />
                </div>
                <div className="tags">
                    <p>Do you want to add some tags? [optional]</p>
                    <input
                        name="category"
                        type="text"
                        placeholder="E.g. Classical,Jazz,Hindustani [separate tags with enter]"
                        onChange={tagHandler}
                        //value={pan}
                        required
                    /><br />
                    <div className="suitable-buttons">
                        {tags && tags.map(b => {
                            return <>
                                <button className="specific-button">{b}</button>
                            </>
                        })}
                    </div>
                </div>
                <button type="submit" className="category-button">Submit</button>
            </form>
        </div>

    )
}

export default BusinessCategory