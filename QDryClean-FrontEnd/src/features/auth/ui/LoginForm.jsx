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

// можно заменить на ваш логотип (png/svg в src/assets)
import Logo from "../../../assets/logo.png";  

export default function LoginForm({ onLoginSuccess }) {
  const [form, setForm] = useState({ login: "", password: "" });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const data = await loginUser(form);
      localStorage.setItem("token", data.token);
      // Call onLoginSuccess without any arguments since the LoginPage doesn't use them
      onLoginSuccess && onLoginSuccess();
    } catch (err) {
      console.error('Login error:', err);
      setError("Неверный логин или пароль");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #e0f7fa, #80deea, #26c6da)", // фон
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 4,
            textAlign: "center",
            backdropFilter: "blur(6px)",
          }}
        >
          {/* Лого */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <img src={Logo} alt="Logo" style={{ width: 80, height: 80 }} />
          </Box>

          <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
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
              sx={{
                mt: 3,
                borderRadius: 2,
                py: 1.2,
                textTransform: "none",
                fontWeight: "bold",
                background: "linear-gradient(90deg, #26c6da, #00acc1)",
              }}
            >
              Войти
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
