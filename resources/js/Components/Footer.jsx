import React from 'react'
import Flama from '../../png/flama.png'
import "../../sass/_footer.scss"
const Footer = () => {
    return (
        <footer>
            <img className='object-scale-down non-selectable' src={Flama} alt="" />
            <p className='pt-5'>
                © 2023 INTERGAS del Norte S.A de C.V. All Rights Reserved. | Aviso de Privacidad
            </p>
        </footer>
    )
}

export default Footer