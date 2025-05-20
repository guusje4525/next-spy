/* eslint-disable @typescript-eslint/no-explicit-any */
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import ProductList from "./product/ProductList"
import { observer } from "mobx-react-lite"
import Config from "./config/Config"
import { Button } from "@mui/material"
import apiClient from "../api"
import { base64urlToArrayBuffer, base64urlToUint8Array } from "../utils/ArrayBufferUtils"

const App = observer(function App() {
  const register = async () => {
    // On button click
    const { options, userID } = await apiClient.auth.registerRequest.mutate()

    const publicKey: PublicKeyCredentialCreationOptions = {
      ...options,
      challenge: base64urlToArrayBuffer(options.challenge),
      user: {
        ...options.user,
        id: base64urlToArrayBuffer(options.user.id),
      },
      excludeCredentials: (options.excludeCredentials || [])?.map((cred) => ({
        // ...cred,
        type: cred.type,
        transports: cred.transports as any,
        id: base64urlToArrayBuffer(cred.id),
      })),
    }

    const cred = await navigator.credentials.create({ publicKey })
    await apiClient.auth.registerResponse.mutate({ userID, credential: cred })
  }

  const login = async () => {
    // Step 1: Request challenge
    const { options } = await apiClient.auth.loginRequest.mutate()

    // Step 2: Call navigator.credentials.get
    const publicKey = {
      ...options,
      challenge: base64urlToUint8Array(options.challenge),
      allowCredentials: options.allowCredentials?.map((cred: any) => ({
        ...cred,
        id: base64urlToUint8Array(cred.id),
      })),
    }
    const assertion = (await navigator.credentials.get({ publicKey })) as any

    // Step 3: Send to backend
    const result = await apiClient.auth.loginResponse.mutate({
      credential: assertion,
    })

    console.log(result)
  }

  return (
    <Box sx={{ backgroundColor: "#242424" }}>
      <Box display="flex" sx={{ pt: 4, pr: 4 }}>
        <Box sx={{ flex: 1 }} />
        <Config />
      </Box>
      <Button onClick={register} variant="contained" sx={{ mr: 2 }}>
        REGISTER
      </Button>
      <Button onClick={login} variant="contained">
        LOGIN
      </Button>
      <Box sx={{ mt: -11 }}>
        <Box
          sx={{
            margin: "0",
            display: "flex",
            placeItems: "center",
            minWidth: "320px",
            minHeight: "100vh",
          }}
        >
          <Box
            sx={{
              maxWidth: "1280px",
              margin: "0 auto",
              padding: "2rem",
              textAlign: "center",
            }}
          >
            <Typography variant="h1" sx={{ color: "#888" }}>
              Next spy
            </Typography>
            <Box sx={{ py: "2em" }}>
              <ProductList />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
})

export default App
