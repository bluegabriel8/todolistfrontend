import React from 'react'
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'



const Todo = ({task, toggleComplete, deleteTodo, editTodo}) => {
  return (
    <div className='todo'>
        
        <button onClick={() => editTodo(task.id)} className='btn btn-primary'>
            <FontAwesomeIcon icon={faPenToSquare} />    
        </button>
        <button onClick={() => deleteTodo(task.id)} className='btn btn-secondary'>
            <FontAwesomeIcon icon={faTrash} />
        </button>

        <p onClick={()=> toggleComplete(task.id)} className={task.completed ? "completed" : ''} text='task'>{task.task}</p>
        
    </div>
  )
}

export default Todo