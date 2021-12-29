import React, { useEffect, Fragment, useState } from "react";
import uuid from "react-uuid";
import PropTypes from "prop-types";
import { useMutation, useSubscription, gql } from "@apollo/client";

const DoToList = props => {
    const [selectedToDo, setSelectedToDo] = useState({});

    const { loading, error, data } = useSubscription(
        gql`
            subscription getToDoList {
                todo_list(order_by: {id: desc}) {
                    id
                    task
                    assignee
                    created_at
                    updated_at
                }
            }
        `
    );

    if (loading) {
        return <span>Loading...</span>;
    }
    if (error) {
        console.error(error);
        return <span>Error!</span>;
    }
    const handleToDoClick = it => {
        // console.log('[todoList]', it);
        setSelectedToDo(it);
        if (props.onToDoSelected) {
            props.onToDoSelected(it);
        }
    }
    var toDoList = []
    if (data) {
        toDoList = data.todo_list.map(it => (
            <tr key={uuid()} className={selectedToDo && selectedToDo.id === +it.id ? "row selected" : "row"} onClick={e => handleToDoClick(it)}>
                <td key={uuid()} className="id" title={it.id}>{it.id}</td>
                <td key={uuid()} className="task" title={it.task}>{it.task}</td>
                <td key={uuid()} className="assignee" title={it.assignee}>{it.assignee}</td>
                <td key={uuid()} className="time">{new Date(it.created_at).toLocaleString()}</td>
                <td key={uuid()} className="time">{new Date(it.updated_at).toLocaleString()}</td>
            </tr>
        ));
    }
    const renderHeader = () => {
        return <thead>
            <tr key={uuid()} className="head">
                <th key={uuid()} className="id">{"ID"}</th>
                <th key={uuid()} className="task">{"任務"}</th>
                <th key={uuid()} className="assignee">{"受派者"}</th>
                <th key={uuid()} className="time">{"建立時間"}</th>
                <th key={uuid()} className="time">{"更新時間"}</th>
            </tr>
        </thead>
    }
    return <div className="table-container">
        <table className="table">
            {renderHeader()}
            <tbody>
                {toDoList}
            </tbody>
        </table>
    </div>
}

DoToList.propsType = {
    onToDoSelected: PropTypes.func
}

export default DoToList;