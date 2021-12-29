import { useMutation, gql } from "@apollo/client";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const AddToDoInput = props => {
    const [toDo, setToDo] = useState('');
    const [assignee, setAssignee] = useState('');
    const [message, setMessage] = useState('');
    const [selectedToDo, setSelectedToDo] = useState({});

    useEffect(() => {
        if (props.selectedToDo && props.selectedToDo.id) {
            const _todo = props.selectedToDo;
            setSelectedToDo(_todo);
            setToDo(_todo.task);
            setAssignee(_todo.assignee);
            setMessage('');
        } else {
            setToDo('');
            setAssignee('');
            setSelectedToDo({});
        }
    }, [props.selectedToDo])

    const [addTodo] = useMutation(
        gql`
            mutation addTodo ($task: String!, $assignee: String!) {
                insert_todo_list(objects: {task: $task, assignee: $assignee}) {
                    returning {
                        id
                    }
                }
            }
        `);

    const [modifyTodo] = useMutation(
        gql`
            mutation updateTodo ($id: Int!, $task: String!, $assignee: String!) {
                update_todo_list(_set: {assignee: $assignee, task: $task}, where: {id: {_eq: $id}}) {
                    affected_rows
                }
            }
        `);

    const [removeTodo] = useMutation(
        gql`
            mutation removeTodo ($id: Int!) {
                delete_todo_list(where: {id: {_eq: $id}}) {
                    affected_rows
                }
            }
        `);

    const handleToDo = e => {
        setToDo(e.target.value);
    }

    const handleAssignee = e => {
        setAssignee(e.target.value);
    }

    const handleAddToDo = e => {
        if (!toDo && !assignee) {
            setMessage('請輸入任務與受派者');
            return;
        } else if (!toDo && assignee) {
            setMessage('請輸入任務');
            return;
        }

        addTodo({ variables: { task: toDo, assignee } });
        setMessage('');
    }

    const handleModifyToDo = e => {
        if (props.selectedToDo && props.selectedToDo.id) {
            modifyTodo({ variables: { id: props.selectedToDo.id, task: toDo, assignee } });
        } else {
            setMessage("此項目可能已刪除或重新選擇 ToDo 項目");
        }
    }

    const handleDeleteToDo = e => {
        if (props.selectedToDo && props.selectedToDo.id) {
            removeTodo({ variables: { id: props.selectedToDo.id } });
            if (props.onClearToDo) {
                props.onClearToDo();
            }
        } else {
            setMessage("此項目可能已刪除或重新選擇 ToDo 項目");
        }
    }

    const handleClearToDo = e => {
        if (props.onClearToDo) {
            props.onClearToDo();
        }
    }

    return (
        <div className="todo-panel">
            <div className="title">GraphQL 控制</div>
            <div className="input-panel">
                <label>ID:</label><label className="id-label">{selectedToDo.id ? selectedToDo.id : "--"}</label>
                <label>任務:</label><input type="text" placeholder="新任務內容" value={toDo} onChange={handleToDo} />
                <label>受派者:</label><input type="text" placeholder="受派者" value={assignee} onChange={handleAssignee} />
            </div>
            {message ? <div className="message">{message}</div> : null}
            <div>
                <div className="button" onClick={handleAddToDo}>新增</div>
                <div className={selectedToDo.id ? "button" : "button disabled"} onClick={selectedToDo.id ? handleModifyToDo : null}>修改</div>
                <div className={selectedToDo.id ? "button" : "button disabled"} onClick={selectedToDo.id ? handleDeleteToDo : null}>刪除</div>
                <div className="button" onClick={handleClearToDo}>清空輸入</div>
            </div>
        </div>
    );
}

AddToDoInput.propsType = {
    selectedToDo: PropTypes.object,
    onClearToDo: PropTypes.func
}

export default AddToDoInput;