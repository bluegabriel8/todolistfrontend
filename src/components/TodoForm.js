import React, {useState} from 'react'

const TodoForm = ({addTodo}) => {

    const [value, setValue] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        addTodo(value)
        setValue('')
    }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
        <input type="text" className="todo-input" placeholder='What is the next task?' 
        value={value} onChange={(e)=> setValue(e.target.value)}/>
        <button type="submit" className="todo-button">Add Task</button>
    </form>
  )
}

export default TodoForm;