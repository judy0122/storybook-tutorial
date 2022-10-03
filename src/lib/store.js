const { configureStore, createSlice, createAsyncThunk } = require('@reduxjs/toolkit');


const initialState = {
    tasks: [],
    status: 'idle',
    error: null
}

// fetch를 통해서 data 가져오기
export const getTasks = createAsyncThunk('todos/fetchTodos', async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos?userId=1')
    const data = await response.json()
    const result = data.map((task) => ({
        id: `${task.id}`,
        title: task.title,
        state: task.completed ? "TASK_ARCHIVED" : "TASK_INBOX"
    }))
    return result
})

const TaskSlice = createSlice({
    name: 'taskbox',
    initialState,
    reducers: {
        updateTaskState: (state, action) => {
            const { id, newTaskState } = action.payload
            const taskIndex = state.tasks.findIndex((task) => task.id === id)
            if (taskIndex >= 0) {
                state.tasks[taskIndex].state = newTaskState
            }
        },
    }, extraReducers(builder) {
        builder.addCase(getTasks.pending, (state) => {
            state.status = 'loading';
            state.error = null;
            state.tasks = []
        })
            .addCase(getTasks.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.tasks = action.payload
            })
            .addCase(getTasks.rejected, (state) => {
                state.status = 'failed';
                state.error = 'something went wrong';
                state.tasks = []
            })
    }
})

const store = configureStore({
    reducer: {
        taskbox: TaskSlice.reducer
    }
})

export const { updateTaskState } = TaskSlice.actions
export default store