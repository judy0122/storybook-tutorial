import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateTaskState } from '../lib/store';
import Task from './Task';

const TaskList = () => {
    const dispatch = useDispatch()

    const { state } = useSelector((state) => state.taskbox)
    const tasks = useSelector((state) => {

        const tasksInOrder = [
            ...state.taskbox.tasks.filter((t) => t.state === "TASK_PINNED"),
            ...state.taskbox.tasks.filter((t) => t.state !== "TASK_PINNED"),
        ];
        const filteredTasks = tasksInOrder.filter((t) => t.state === "TASK_INBOX" || 'TASK_PINNED')

        return filteredTasks
    })

    const onClickPin = (id) => {
        dispatch(updateTaskState({ id, newTaskState: "TASK_PINNED" }))
    }

    const onClickArchive = (id) => {
        dispatch(updateTaskState({ id, newTaskState: "TASK_ARCHIVED" }))
    }


    const LoadingRow = (
        <div className="loading-item">
            <span className="glow-checkbox" />
            <span className="glow-text">
                <span>Loading</span> <span>cool</span> <span>state</span>
            </span>
        </div>
    );
    if (state === 'loading') {
        return (
            <div className="list-items" data-testid="loading" key={"loading"}>
                {LoadingRow}
                {LoadingRow}
                {LoadingRow}
                {LoadingRow}
                {LoadingRow}
                {LoadingRow}
            </div>
        );
    }
    if (tasks.length === 0) {
        return (
            <div className="list-items" key={"empty"} data-testid="empty">
                <div className="wrapper-message">
                    <span className="icon-check" />
                    <div className="title-message">You have no tasks</div>
                    <div className="subtitle-message">Sit back and relax</div>
                </div>
            </div>
        );
    }

    return (
        <div className="list-items" data-testid="success" key={"success"}>
            {tasks.map((task) => (
                <Task
                    key={task.id}
                    task={task}
                    onClickPin={onClickPin}
                    onClickArchive={onClickArchive}
                />
            ))}
        </div>
    );
};

export default TaskList;