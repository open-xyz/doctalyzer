import React from "react"
import Hero from "./Hero"
import Buttons from "./Buttons"
import Footer from "./Footer"

export default function Homepage() {
	return (
		<main>
			<div className='main'>
				<div className='gradient' />
			</div>

			<div className='app'>
				<Hero />
				<Buttons />
			</div>
			<Footer />
		</main>
	)
}
