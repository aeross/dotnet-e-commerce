import { Button, ButtonGroup, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/store/configureStore';
import { decrement, increment } from './counterSlice';

function ContactPage() {
    const dispatch = useAppDispatch();
    const { data, title } = useAppSelector(state => state.counter);

    return (
        <>
            <Typography variant="h2">{title}</Typography>
            <Typography variant="h4">
                Count: {data}
            </Typography>
            <ButtonGroup>
                <Button onClick={() => dispatch(decrement(1))}>{"-"}</Button>
                <Button onClick={() => dispatch(increment(1))}>{"+"}</Button>
                <Button onClick={() => dispatch(decrement(5))}>{"-5"}</Button>
                <Button onClick={() => dispatch(increment(5))}>{"+5"}</Button>
            </ButtonGroup>
        </>
    )
}

export default ContactPage