import { useState } from "react";
import { loginUser } from "../api/authApi";
import {
  Button,
  TextField,
  Typography,
  Alert,
  Container,
  Box,
  Paper,
} from "@mui/material";

export default function LoginForm({ onLoginSuccess }) {
  const [form, setForm] = useState({ login: "", password: "" });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(form);
      localStorage.setItem("token", data.token);
      onLoginSuccess?.(data);
    } catch (err) {
      setError("Неверный логин или пароль");
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 10, borderRadius: 3 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Вход в систему
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            margin="normal"
            label="Логин"
            name="login"
            value={form.login}
            onChange={handleChange}
            required
          />

          <TextField
            fullWidth
            margin="normal"
            label="Пароль"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Войти
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
