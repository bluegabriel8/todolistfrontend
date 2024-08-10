import React, {useEffect, useState} from 'react'
import TodoForm from './TodoForm'
import { v4 as uuidv4 } from 'uuid'
import Todo from './Todo'
import EditTodoForm from './EditTodoForm'
import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from './LogoutButton'
import LoginButton from './LoginButton'
import axios from 'axios';

uuidv4()

const TodoWrapper = () => {
    const [todos, setTodos] = useState([])    
    const {isLoading, error} = useAuth0();
    const { user, loginWithRedirect, isAuthenticated } = useAuth0();

  
    //The useEffect hook is used to fetch the todos from the backend when the component mounts
    //The isAuthenticated variable is passed as a dependency to the useEffect hook
    //If the isAuthenticated variable is true, the fetchTodos function is called
        useEffect(() => {
            if (isAuthenticated) {
            fetchTodos();
            }
        }, [isAuthenticated]);
    

    //fetchTodos function is an async function that fetches the todos from the backend
    //It uses the axios library to make a GET request to the backend
    //The response is stored in the data variable
    //The data variable is then used to set the todos state
    //The todos state is an array of objects that contain the id, task, and completed properties
    //The id property is generated using the uuidv4 function
    //The task property is the task that the user wants to add
    //The completed property is a boolean that indicates whether the task is completed or not
    //The setTodos function is then used to set the todos state with the new todos array
    const fetchTodos = async () => {
        try {
           
            const userEmail = user.email
            const response = await axios.get(`http://127.0.0.1:5000/api/tasks?email=${userEmail}`);
            const data = response.data.tasks;
            console.log(data)

            setTodos(
                data.map((todo) => ({id: todo.index, 
                    task: todo.task, 
                    completed: todo.completed, isEditing: false,
                    
            })));
            console.log(todos)
            
        } catch (error) {
            console.error(error);
        }
    };
    
    //addTodo function is an async function that adds a new todo to the backend
    //It uses the axios library to make a POST request to the backend
    //The new todo is an object that contains the task, id, and completed properties
    //The task property is the task that the user wants to add
    //The id property is generated using the uuidv4 function
    //The completed property is a boolean that indicates whether the task is completed or not
    //The new todo is then added to the todos array using the setTodos function
    const addTodo = async (todo) => {
        const index = uuidv4();
        const newTodo = { task: todo, index: index, completed: false, email: user.email}
        console.log(newTodo)
        await axios.post('http://127.0.0.1:5000/api/task', newTodo);
        setTodos([...todos, {id: index, task: todo, completed: false, isEditing: false}])
        console.log(todos)
    }


    //toggleComplete function is a function that toggles the completed property of a todo
    //It takes the id of the todo as an argument
    //It uses the setTodos function to update the todos array
    const toggleComplete = async (id) => {
        
        const newTodo = { index: id, email: user.email};
        await axios.put('http://127.0.0.1:5000/api/toggle', newTodo);
        console.log(todos)
        setTodos(
            todos.map(todo => 
                todo.id === id ? {...todo, completed: !todo.completed} : todo
            )
        )
        
    }


    //deleteTodo function is an async function that deletes a todo from the backend
    //It uses the axios library to make a DELETE request to the backend
    //The id of the todo is passed as a parameter to the DELETE request
    //The todo is then removed from the todos array using the setTodos function
    //The filter method is used to filter out the todo with the id that matches the id passed as a parameter
    //The setTodos function is then used to set the todos state with the new todos array
    //If there is an error, it is logged to the console
    const deleteTodo = async (id) => {
        try {
            await axios.delete('http://127.0.0.1:5000/api/task', {
                params: {
                  index: id,
                  email: user.email
                }
              });
            setTodos(todos.filter(todo => todo.id !== id))
        } catch (error){
            console.error('Error deleting task' + error)
        }
        
    }

    //editTodo function is a function that toggles the isEditing property of a todo
    //It takes the id of the todo as an argument
    //It uses the setTodos function to update the todos array
    //The map method is used to iterate over the todos array
    //If the id of the todo matches the id passed as a parameter, the isEditing property is toggled
    //The setTodos function is then used to set the todos state with the new todos
    //array
    const editTodo = id => {
        setTodos(
            (todos.map(todo => todo.id === id ? ({...todo, isEditing: !todo.isEditing}) : todo))
        )
    }

    //editTask function is an async function that edits a todo in the backend   
    //It uses the axios library to make a PUT request to the backend
    //The newTodo object is created with the updated task, id, and completed properties
    //The newTodo object is then passed as a parameter to the PUT request
    //The todo is then updated in the todos array using the setTodos function
    //The map method is used to iterate over the todos array
    //If the id of the todo matches the id passed as a parameter, the task property is updated
    //The isEditing property is then toggled
    const editTask = async (task, id) => {
        const newTodo = {task: task, index: id, completed: task.completed, email: user.email}
        await axios.put('http://127.0.0.1:5000/api/task', newTodo);
    
        setTodos(
            todos.map(todo => todo.id === id ? {...todo, task, isEditing: !todo.isEditing} : todo)
        )
    }
    
  return (
    <div>

        <h1>To Do List</h1>
        {error && <div>Oops... {error.message}</div>}
        {!error && isLoading && <div>Loading...</div>}
        {!error && !isLoading && (
            <>
            {!isAuthenticated && (
                <LoginButton />
            )}
            {isAuthenticated && (
            <>
                <LogoutButton />
                <TodoForm addTodo={addTodo} className="todo-wrapper"/>
            
                {todos.map((todo, index) => {
                    if (todo.isEditing) {
                        return <EditTodoForm key={index} task={todo} editTodo={editTask}/>
                    } else {
                        return <Todo key={index} task={todo} toggleComplete={toggleComplete}
                        deleteTodo={deleteTodo} editTodo={editTodo}
                        />
                    } 
                })}
            </>
            )}
            {!isAuthenticated && (
                    <button onClick={() => loginWithRedirect()}>Sign Up</button>
            )}
            </>
        )}
    </div>
 )


}

export default TodoWrapper