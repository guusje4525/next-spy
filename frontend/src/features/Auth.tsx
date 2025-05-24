import Typography from "@mui/material/Typography"
import Stack from "@mui/material/Stack"
import MuiCard from "@mui/material/Card"
import { styled } from "@mui/material/styles"
import useStore from "../utils/useStore"
import AuthStore, { AuthStoreProvider } from "./AuthStore"
import { observer } from "mobx-react-lite"
import { useEffect } from "react"
import Register from "./Register"
import Login from "./Login"

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  boxShadow: "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow: "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}))

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 90dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage: "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage: "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}))

const Auth = observer(function Auth(props: { children: React.ReactNode }) {
  const authStore = useStore(() => new AuthStore())
  useEffect(() => {
    authStore.getPasskeySupported()
  }, [authStore])

  return (
    <AuthStoreProvider store={authStore}>
      <SignUpContainer direction="column" justifyContent="space-between">
        <Card variant="outlined" sx={{ width: authStore.state === "authenticated" ? "650px" : "450px" }}>
          {authStore.state === "loading" && <Loading />}
          {authStore.state === "unsupported" && <Unsupported />}
          {authStore.state === "register" && <Register />}
          {authStore.state === "login" && <Login />}
          {authStore.state === "authenticated" && props.children}
        </Card>
      </SignUpContainer>
    </AuthStoreProvider>
  )
})

export default Auth

const Loading = observer(function Loading() {
  return <Typography sx={{ textAlign: "center" }}>Please use a browser that has passkey support</Typography>
})

const Unsupported = observer(function Unsupported() {
  return <Typography sx={{ textAlign: "center" }}>Please use a browser that has passkey support</Typography>
})
