import React from 'react'
import './Footer.css'
import {Link} from 'react-router-dom'

function Footer() {
    return (
    <div className='footer'>
        <div className= 'footer__left'>
            <h4> Download Our App</h4>
            <p> Download App for Play Store and Apple Store</p>
            <img 
                className='footer__playstore__image'
                src='https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/2560px-Google_Play_Store_badge_EN.svg.png' 
                alt=''
            />
            <img 
                className='footer__appstore__image'
                src='https://www.vortex6.com/wp-content/uploads/2019/09/app-store.png' 
                alt=''
            />
        </div>
        <div className= 'footer__mid'>
            <h1> Ecommerce </h1>
            <p> High Quality is our First Priority</p>
            <p> Copyright 2021 &copy; Pratham</p>
        </div>
        <div className= 'footer__right'>
            <h4> Follow Us </h4>
            <Link to='instagram'>Instagram</Link>
            <Link to='facebook'>Facebook</Link>
            <Link to='twitter'>Twitter</Link>
            <Link to='linkedin'>Linkedin</Link>
            <Link to='pinterest'>Pinterest</Link>
        </div>
    </div>
    )
}

export default Footer