import React from "react"
import "./hero.css"
import { Link } from "react-router-dom"
import { logo } from "../assets"

const Nav = () => {
	return (
		<nav className='flex justify-between items-center w-full mb-10 pt-3 w-full flex-row'>
			<Link to='/'>
				<img src={logo} alt='sumz_logo' className='logo object-contain' />
			</Link>

			<button
				type='button'
				onClick={() =>
					window.open("https://github.com/open-xyz/doctalyzer", "_blank")
				}
				className='black_btn'
			>
				GitHub
			</button>
		</nav>
	)
}

export default Nav
