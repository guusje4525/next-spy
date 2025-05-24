import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./features/App.tsx"
import { configure } from "mobx"
import Auth from "./features/Auth.tsx"
import AppTheme from "./theme/AppTheme.tsx"

configure({
    enforceActions: "never",
})

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <AppTheme>
            <Auth>
                <App />
            </Auth>
        </AppTheme>
    </StrictMode>
)
