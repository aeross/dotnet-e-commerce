import { Alert, AlertTitle, Button, ButtonGroup, Container, List, ListItem, ListItemText, Typography } from '@mui/material'
import agent from '../../app/api/agent'
import { useState } from 'react'

function AboutPage() {
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    async function handleValidationError() {
        try {
            await agent.TestErrors.getValidationError();
            console.log("should not see this");
        } catch (error: any) {
            setValidationErrors(error);
        }

    }

    return (
        <Container>
            <Typography gutterBottom variant="h2">Errors for testing purposes</Typography>
            <ButtonGroup fullWidth>
                <Button variant="contained" onClick={agent.TestErrors.get400}>Bad Request Error</Button>
                <Button variant="contained" onClick={agent.TestErrors.get401}>Unauthorized Error</Button>
                <Button variant="contained" onClick={agent.TestErrors.get404}>Not Found Error</Button>
                <Button variant="contained" onClick={agent.TestErrors.get500}>Internal Server Error</Button>
                <Button variant="contained" onClick={handleValidationError}>Validation Error</Button>
            </ButtonGroup>

            {validationErrors.length > 0 && (
                <Alert severity="error">
                    <AlertTitle>Validation Errors</AlertTitle>
                    <List>
                        {validationErrors.map((e, i) => (
                            <ListItem key={i}>
                                <ListItemText>{e}</ListItemText>
                            </ListItem>
                        ))}
                    </List>
                </Alert>
            )}
        </Container>
    )
}

export default AboutPage