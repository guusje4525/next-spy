import Snackbar from "@mui/material/Snackbar"
import IconButton from "@mui/material/IconButton"
import { useEffect, useState, useRef, useMemo, useCallback } from "react"
import CloseIcon from "@mui/icons-material/Close"

import InfoIcon from "@mui/icons-material/Info"

import { styled, Theme } from "@mui/material/styles"
import { Root } from "react-dom/client"
import AppTheme from "../theme/AppTheme"

const MySpan = styled("span")({})
export const SnackbarComponent = ({ title, container, root }: any & { container: HTMLElement; root: Root }) => {
    const removed = useRef(false)
    const [open, setOpen] = useState(true)

    useEffect(() => {
        return () => {
            if (removed.current) return

            document.body.removeChild(container)
            removed.current = true
        }
    })

    const handleClose = useCallback(() => {
        setOpen(false)
        setTimeout(() => root.unmount())
    }, [root])

    const snackbarActions = useMemo(() => {
        return [
            <IconButton key="close" aria-label="Close" color="inherit" onClick={handleClose}>
                <CloseIcon />
            </IconButton>,
        ]
    }, [handleClose])

    const iconSX = (theme: Theme) => ({ fontSize: 20, opacity: 0.9, marginRight: theme.spacing(1) })

    return (
        <AppTheme>
            <Snackbar
                data-variant={"info"}
                anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
                open={open}
                autoHideDuration={3000}
                onClose={handleClose}
                ContentProps={{
                    "aria-describedby": "message-id",
                    sx: () => ({ backgroundColor: "rgb(9, 17, 26)", color: "white" }),
                }}
                message={
                    <MySpan id="message-id" sx={{ display: "flex", alignItems: "center" }}>
                        <InfoIcon sx={iconSX} />
                        <span style={{ fontWeight: 600 }}>{title}</span>
                    </MySpan>
                }
                action={snackbarActions}
            />
        </AppTheme>
    )
}
