import { useState } from "react"
import { useEffect } from "react"
import { TodoCard } from "./TodoCard";
import axios from "axios";


export function Header() {
    const [title, setTitle] = useState();
    const [description, setDescription] = useState();
    const [todos, setTodos] = useState([]);

    async function addTodo() {
        const response = await axios.post("http://localhost:3000/create-todo", {
            title: title,
            description: description,
        })
        const newTodo = response.data;

        // console.log("Todo added successfully:", newTodo);


        setTodos((prevTodos) => [...prevTodos, newTodo]);
        setTitle("");
        setDescription("");
    }

    const markAsDone = async (id) => {
        try {
            const response = await axios.put(`http://localhost:3000/todos/${id}/complete`);
            const updatedTodo = response.data;

            setTodos((prevTodos) =>
                prevTodos.map((todo) =>
                    todo._id === updatedTodo._id ? updatedTodo : todo
                )
            );
        } catch (error) {
            console.error("Error marking todo as done:", error);
        }
    };

    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const response = await axios.get('http://localhost:3000/todos');
                setTodos(response.data);
            } catch (error) {
                console.error('Error fetching todos:', error);
            }
        };

        fetchTodos();
    }, []);

    return (
        <div className=" bg-green-200 h-screen">
            <div className="flex flex-col justify-center items-center py-10">
                <div className="flex">
                    <div className="px-4">
                        <label className="px-4 text-xl">Title</label>
                        <input type="text" className=" rounded-xl shadow-xl border-2 border-black p-1" value={title}
                            onChange={(e) => setTitle(e.target.value)} />
                    </div>

                    <div>
                        <label className="px-4 text-xl">Description</label>
                        <input type="text" className=" rounded-xl shadow-xl border-2 border-black p-1" value={description}
                            onChange={(e) => setDescription(e.target.value)} />
                    </div>
                </div>

                <button className="border-2 rounded-3xl bg-black text-white p-2 mt-8 shadow-lg" onClick={addTodo}>Add Todo</button>
            </div>


            <div className="grid grid-cols-3 gap-2 max-w-40em px-20">
                {todos.length > 0 ? (
                    todos.map((todo, index) => (
                        <TodoCard key={index}>
                            <div>
                                <strong>Title:</strong> {todo.title}
                            </div>
                            <div>
                                <strong>Description:</strong> {todo.description}
                            </div>

                            {todo._id && (
                                <div>
                                    {todo.isCompleted ? null : <button className="border-2 rounded-3xl bg-black text-white p-2 mt-8 shadow-lg" onClick={() => markAsDone(todo._id)}>
                                        Mark as Done
                                    </button>
                                    }
                                    {todo.isCompleted ? "Completed" : "Pending"}
                                </div>)}
                        </TodoCard>
                    ))
                ) : (
                    <p>No todos available</p>
                )}
            </div>


        </div>
    )
}