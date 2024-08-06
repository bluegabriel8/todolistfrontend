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
    const {loginWithRedirect, isAuthenticated} = useAuth0()  


    useEffect(() => {
        fetchTodos();
    }, []);
    

    const fetchTodos = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/api/tasks');
            
            const data = response.data.tasks;
            console.log(data);
            setTodos(
                data.map((todo) => ({id: todo.index, 
                    task: todo.task, 
                    completed: todo.completed, isEditing: false
            })));
            

        } catch (error) {
            console.error(error);
        }
    };

    // const createTodo = async (todo) => {
    //     try {
    //         const response = await axios.post('https://api.example.com/todos', todo);
    //         setTodos([...todos, response.data]);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };

    // const updateTodo = async (id, updatedTodo) => {
    //     try {
    //         const response = await axios.put(`https://api.example.com/todos/${id}`, updatedTodo);
    //         setTodos(
    //             todos.map((todo) => (todo.id === id ? response.data : todo))
    //         );
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };

    // const deleteTodo = async (id) => {
    //     try {
    //         await axios.delete(`https://api.example.com/todos/${id}`);
    //         setTodos(todos.filter((todo) => todo.id !== id));
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };

    const addTodo = async (todo) => {
        const index = uuidv4();
        const newTodo = { task: todo, index: index, completed: false }
        await axios.post('http://127.0.0.1:5000/api/task', newTodo);
        setTodos([...todos, {id: index, task: todo, completed: false, isEditing: false}])
        console.log(todos)
    }

    const toggleComplete = id => {
        setTodos(
            todos.map(todo => 
                todo.id === id ? {...todo, completed: !todo.completed} : todo
            )
        )
    }

    const deleteTodo = id => {
        setTodos(todos.filter(todo => todo.id !== id))
    }

    const editTodo = id => {
        setTodos(
            (todos.map(todo => todo.id === id ? ({...todo, isEditing: !todo.isEditing}) : todo))
        )
    }

    const editTask = async (task, id) => {
        const newTodo = {task: task, index: id, completed: false}
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
            </>
        )}
    </div>
 )


}

export default TodoWrapper