import { Typography, Box, FormControl, FormLabel, TextField, Button, Link } from "@mui/material"
import { observer } from "mobx-react-lite"
import { useAuthStore } from "./AuthStore"

const Login = observer(function Login() {
  const authStore = useAuthStore()
  return (
    <>
      <Typography component="h1" variant="h4" sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}>
        Sign in
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <FormControl>
          <FormLabel htmlFor="username">User name</FormLabel>
          <TextField
            required
            value={authStore.fields.username}
            onChange={authStore.onUserNameUpdate}
            fullWidth
            placeholder="user name"
            error={!!authStore.errorText}
            helperText={authStore.errorText}
            name="username"
            variant="outlined"
            color="primary"
          />
        </FormControl>
        <Button type="submit" fullWidth variant="contained" onClick={authStore.login}>
          Sign in
        </Button>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography sx={{ textAlign: "center" }}>
          Don't have an account?{" "}
          <Link onClick={authStore.goToRegister} variant="body2" sx={{ alignSelf: "center", cursor: "pointer" }}>
            Sign up
          </Link>
        </Typography>
      </Box>
    </>
  )
})

export default Login
