import { useState } from "react";
import styled from "styled-components";
import { Button, TextField } from "@material-ui/core";

const AddTodo = () => {
	const [description, setDescription] = useState("");

	const onSubmitForm = async (e) => {
		try {
			const body = { description };
			const response = await fetch("http://localhost:5000/todos", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body),
			});

			console.log(response);
		} catch (err) {
			console.error(err.message);
		}
		setDescription("");
	};

	return (
		<Container>
			<Form onSubmit={onSubmitForm}>
				<TextField
					variant='outlined'
					label='Add todo'
					fullWidth
					margin='none'
					value={description}
					onChange={(e) => setDescription(e.target.value)}
				/>
				<Button fullWidth size='large' variant='contained' color='primary' type='submit'>
					Add Todo
				</Button>
			</Form>
		</Container>
	);
};

export default AddTodo;

const Container = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100%;
	max-width: 960px;
`;

const Form = styled.form`
	display: grid;
	justify-items: center;
	align-items: center;
	grid-template-columns: 4fr 1fr;
	width: 100%;
	max-width: 760px;
	padding: 50px;
`;
