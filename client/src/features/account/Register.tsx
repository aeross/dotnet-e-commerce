import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Paper } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { FieldValues, useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import agent from '../../app/api/agent';
import { toast } from 'react-toastify';

export default function Register() {
    const navigate = useNavigate();
    const { register, handleSubmit, setError, formState: { isSubmitting, errors, isValid } } = useForm({
        mode: 'onTouched'
    });

    async function handleRegisterSubmit(data: FieldValues) {
        try {
            await agent.Account.register(data);
            toast.success("Registration successful - you can now login");
            navigate("/login");
        } catch (error: any) {
            handleErrors(error);
        }
    }

    function handleErrors(errors: any) {
        if (errors) {
            errors.forEach((e: string) => {
                if (e.includes('Password')) {
                    setError('password', { message: e });
                } else if (e.includes('Email')) {
                    setError('email', { message: e });
                } else if (e.includes('Username')) {
                    setError('username', { message: e });
                }
            })
        }
    }

    return (
        <Container component={Paper} maxWidth="sm" sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 4 }}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Register
            </Typography>
            <Box component="form" onSubmit={handleSubmit(handleRegisterSubmit)} noValidate sx={{ mt: 1 }}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Username"
                    autoFocus
                    {...register("username", { required: "Username is required" })}
                    error={!!errors.username}
                    helperText={errors?.username?.message as string}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Email"
                    type="email"
                    {...register("email", { required: "Email is required" })}
                    error={!!errors.email}
                    helperText={errors?.email?.message as string}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    {...register("password", { required: "Password is required" })}
                    error={!!errors.password}
                    helperText={errors?.password?.message as string}
                />

                <LoadingButton
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    loading={isSubmitting}
                    disabled={!isValid}
                >
                    Register
                </LoadingButton>
                <Grid container>
                    <Grid item>
                        <Link to="/login">
                            {"Already have an account? Sign In"}
                        </Link>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}