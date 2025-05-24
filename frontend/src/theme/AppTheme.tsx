import * as React from "react"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import { inputsCustomizations } from "./customizations/inputs"
import { dataDisplayCustomizations } from "./customizations/dataDisplay"
import { feedbackCustomizations } from "./customizations/feedback"
import { navigationCustomizations } from "./customizations/navigation"
import { surfacesCustomizations } from "./customizations/surfaces"
import { typography } from "./themePrimitives"

interface AppThemeProps {
  children: React.ReactNode
}

export default function AppTheme(props: AppThemeProps) {
  const { children } = props
  const theme = React.useMemo(() => {
    return createTheme({
      // For more details about CSS variables configuration, see https://mui.com/material-ui/customization/css-theme-variables/configuration/
      cssVariables: {
        colorSchemeSelector: "data-mui-color-scheme",
        cssVarPrefix: "template",
      },
      typography,
      palette: {
        mode: "dark",
      },
      components: {
        ...inputsCustomizations,
        ...dataDisplayCustomizations,
        ...feedbackCustomizations,
        ...navigationCustomizations,
        ...surfacesCustomizations,
        MuiDialog: {
          styleOverrides: {
            root: {
              ".MuiPaper-root": {
                borderRadius: "8px",
                "--Paper-overlay": "unset !important",
                backgroundColor: "rgb(9, 17, 26)",
              },
            },
          },
        },
      },
    })
  }, [])
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}
