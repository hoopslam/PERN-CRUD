import "./App.css";
import { useState, useEffect } from "react";
import AddTodo from "./components/AddTodo";
import { Button, Dialog, DialogActions, DialogContent, TextField } from "@material-ui/core";
import styled from "styled-components";

function App() {
	const [todosList, setTodosList] = useState([]);
	const [openDialog, setOpenDialog] = useState(false);
	const [selectedTodo, setSelectedTodo] = useState(null);

	const handleOpen = () => {
		setOpenDialog(true);
	};

	const handleClose = () => {
		setOpenDialog(false);
	};

	const handleSave = async (e) => {
		e.preventDefault();
		const editText=e.target[0].value;
		console.log(selectedTodo.todo_id)
		console.log(editText)
		try {
			//update on server
			const body = { description: editText };
			const res = await fetch(`http://localhost:5000/todos/${selectedTodo.todo_id}`, {
				method: "PUT",
				headers: {
					"content-Type": "application/json",
				},
				body: JSON.stringify(body),
			});
			console.log(res);
		} catch (err) {
			console.error(err.message);
		} finally {
			//update UI (rerender)
			window.location = "/";
		}
		handleClose();
	};

	const deleteItem = (id) => {
		try {
			//update on server
			fetch(`http://localhost:5000/todos/${id}`, {
				method: "DELETE",
			});
			//update UI
			setTodosList(todosList.filter((todo) => todo.todo_id !== id));
		} catch (err) {
			console.error(err.message);
		}
	};

	const fetchTodos = async () => {
		try {
			const res = await fetch("http://localhost:5000/todos");
			const arrayOfTodoObjects = await res.json();
			setTodosList(arrayOfTodoObjects.sort((a, b) => a.todo_id - b.todo_id));
		} catch (err) {
			console.error(err.message);
		}
	};

	useEffect(() => {
		fetchTodos();
	}, []);

	return (
		<div className='App'>
			<h1>My ToDo List</h1>
			<AddTodo />
			<Container>
				{todosList.map((todoItem) => (
					<Row key={todoItem.todo_id}>
						<p>{todoItem.description}</p>
						<Button
							disableElevation
							variant='outlined'
							onClick={() => {
								setSelectedTodo(todoItem);
								handleOpen();
							}}>
							Edit
						</Button>
						<Button
							disableElevation
							variant='contained'
							color='secondary'
							onClick={() => deleteItem(todoItem.todo_id)}>
							Delete
						</Button>
					</Row>
				))}
			</Container>
			<Dialog
				open={openDialog}
				onClose={handleClose}
				aria-labelledby='form-dialog-title'
				fullWidth>
				<DialogContent>
					<form id='myForm' onSubmit={handleSave}>
						<TextField
							autoFocus
							margin='normal'
							id='name'
							label='Edit Todo'
							type='text'
							defaultValue={selectedTodo ? selectedTodo.description : null}
							fullWidth
						/>
					</form>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color='primary'>
						Cancel
					</Button>
					<Button type='submit' form='myForm' color='primary'>
						Save
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}

export default App;

const Container = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100%;
	max-width: 960px;
	border-radius: 5px;
`;

const Row = styled.div`
	display: grid;
	width: 100%;
	grid-template-columns: 4fr 0.8fr 0.8fr;
	grid-gap: 5px;
	padding: 10px;
	margin: 10px;
	background-color: whitesmoke;
	border-radius: 5px;
`;
