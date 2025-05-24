import { observer } from "mobx-react-lite"
import { useAuthStore } from "./AuthStore"
import Typography from "@mui/material/Typography"
import FormControl from "@mui/material/FormControl"
import FormLabel from "@mui/material/FormLabel"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Link from "@mui/material/Link"
import TextField from "@mui/material/TextField"

const Register = observer(function Register() {
  const authStore = useAuthStore()
  return (
    <>
      <Typography component="h1" variant="h4" sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}>
        Sign up
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
            name="username"
            error={!!authStore.errorText}
            helperText={authStore.errorText}
            variant="outlined"
            color="primary"
          />
        </FormControl>
        <Button type="submit" fullWidth variant="contained" onClick={authStore.register} loading={authStore.registerLoader.isLoading}>
          Sign up
        </Button>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography sx={{ textAlign: "center" }}>
          Already have an account?{" "}
          <Link onClick={authStore.goToLogin} variant="body2" sx={{ alignSelf: "center", cursor: "pointer" }}>
            Sign in
          </Link>
        </Typography>
      </Box>
    </>
  )
})

export default Register
