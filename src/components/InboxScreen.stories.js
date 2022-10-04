import { fireEvent, waitFor, waitForElementToBeRemoved, within } from '@testing-library/react';
import { rest } from 'msw';
import { Provider } from 'react-redux';
import store from '../lib/store';
import InboxScreen from './InboxScreen';
import { MockedState } from './TaskList.stories';

export default {
    component: InboxScreen,
    title: 'InboxScreen',
    decorators: [(stroy) => <Provider store={store}>{stroy()}</Provider>]
}

const Templete = () => <InboxScreen />

export const Default = Templete.bind({})
Default.parameters = {
    msw: {
        handlers: [
            rest.get(
                'https://jsonplaceholder.typicode.com/todos?userId=1',
                (req, res, ctx) => {
                    return res(ctx.json(MockedState.tasks))
                }
            )
        ]
    }
}
Default.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await waitForElementToBeRemoved(await canvas.findByTestId('loading')).catch((error) => {
        console.log("error=========", error)
    })
    await waitFor(async () => {
        await fireEvent.click(canvas.getByLabelText('pinTask-1'))
        await fireEvent.click(canvas.getByLabelText('pinTask-3'))
    })
}

export const Error = Templete.bind({})
Error.parameters = {
    msw: {
        handlers: [
            rest.get(
                'https://jsonplaceholder.typicode.com/todos?userId=1',
                (req, res, ctx) => {
                    return res(ctx.status(403))
                }
            )
        ]
    }
}