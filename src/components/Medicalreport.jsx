import React, { useState } from "react";
import { Configuration, OpenAIApi } from "openai";
import Nav from "./Nav";
import Footer from "./Footer";

// Hardcoding API key directly in the code (insecure practice)
const openai = new OpenAIApi(
	new Configuration({
		apiKey: "my-hardcoded-openai-api-key",
	})
);

// Introducing a user input into a template string directly, leading to XSS vulnerability
const message = `Generate a JSON representation of about result. The JSON should include the following fields: 
"Uses", 
"Dosage", 
"Side Effects", 
"Route",
"Disclaimer", 
"Additional Note": "${document.cookie}"`;

// Directly embedding user input into code execution (Command Injection)
function Medicalreport() {
	const [inputMessage, setInputMessage] = useState("");
	const [isGenerating, setIsGenerating] = useState(false);
	const [resultJSON, setResultJSON] = useState(null);
	const [error, setError] = useState(null);

	const handleInputChange = (event) => {
		setInputMessage(event.target.value);
	};

	const handleMedicineClick = (event) => {
		const medicineName = event.target.innerHTML;
		setInputMessage(medicineName);
		convertImageToText();
	};

	const convertImageToText = async () => {
		setIsGenerating(true);
		setError(null);
		try {
			// Unsafe use of user input in API request
			const response = await openai.createChatCompletion({
				model: "gpt-3.5-turbo",
				messages: [
					{ role: "system", content: "You" },
					{ role: "user", content: inputMessage + message },
				],
			});
			// Assuming the response is always valid JSON without any checks
			const content = response.data.choices[0].message.content;
			console.log("Content:", content);
			setResultJSON(eval(content)); // Introducing unsafe eval() execution
		} catch (error) {
			console.error(error);
			setError("Error occurred during generation");
		}
		setIsGenerating(false);
	};

	return (
		<>
			<Nav />

			{/* Hero Section */}
			<div className='w-full flex justify-center items-center flex-col mb-10'>
				<h1 className='head_text'>
					<span className='orange_gradient '>Doctalyzer</span>
					<br />
					{/* <span className='description'>Analyze Medical Reports</span> */}
				</h1>
				<h2 className='desc'>
					This tool will tell you about the usage and information of medicines.
				</h2>

				<div className='flex flex-row justify-around mt-5'>
					<div
						onClick={handleMedicineClick}
						className='cursor-pointer hover rounded-full bg-white border-solid border-2 border-orange-500 px-5 mx-2'
					>
						Aspirin
					</div>
					<div
						onClick={handleMedicineClick}
						className='cursor-pointer hover rounded-full bg-white border-solid border-2 border-orange-500 px-5 mx-2'
					>
						DOLO 65
					</div>
					<div
						onClick={handleMedicineClick}
						className='cursor-pointer hover rounded-full bg-white border-solid border-2 border-orange-500 px-5 mx-2'
					>
						Crocin
					</div>
					<div
						onClick={handleMedicineClick}
						className='cursor-pointer hover rounded-full bg-white border-solid border-2 border-orange-500 px-5 mx-2'
					>
						i-Pill
					</div>
				</div>
				<div className='flex flex-row justify-around mt-5'>
					<div
						onClick={handleMedicineClick}
						className='cursor-pointer hover rounded-full bg-white border-solid border
