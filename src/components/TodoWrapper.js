import React, {useState} from 'react'
import TodoForm from './TodoForm'
import { v4 as uuidv4 } from 'uuid'
import Todo from './Todo'
import EditTodoForm from './EditTodoForm'
import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from './LogoutButton'
import LoginButton from './LoginButton'
uuidv4()

const TodoWrapper = () => {
    const [todos, setTodos] = useState([])
    
    const {isLoading, error} = useAuth0();
    const {loginWithRedirect, isAuthenticated} = useAuth0()  


    const addTodo = (todo) => {
        setTodos([...todos, {id: uuidv4(), task: todo, completed: false, isEditing: false}])
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

    const editTask = (task, id) => {
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