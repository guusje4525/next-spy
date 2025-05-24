import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import { observer } from "mobx-react-lite"
import SettingsIcon from "@mui/icons-material/Settings"
import useStore from "../../utils/useStore"
import Button from "@mui/material/Button"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import TextField from "@mui/material/TextField"
import DialogTitle from "@mui/material/DialogTitle"
import Dialog from "@mui/material/Dialog"
import Typography from "@mui/material/Typography"
import { useEffect } from "react"
import FormLabel from "@mui/material/FormLabel"
import FormControl from "@mui/material/FormControl"
import ConfigStore from "./ConfigStore"

const Config = observer(function Config() {
    const configStore = useStore(() => new ConfigStore())

    useEffect(() => {
        configStore.fetch()
    }, [configStore])

    return (
        <Box>
            <IconButton onClick={configStore.dialog.open}>
                <SettingsIcon color="info" sx={{ fontSize: "40px", color: "#999" }} />
            </IconButton>

            <Dialog
                open={configStore.dialog.visible}
                onClose={configStore.dialog.close}
                slotProps={{
                    paper: {
                        style: {
                            width: "500px",
                        },
                    },
                }}
            >
                <DialogTitle sx={{ color: "#888", fontWeight: 700 }}>Configuration</DialogTitle>
                <DialogContent>
                    {configStore.loader.isLoading && <Typography>Loading...</Typography>}
                    {!configStore.loader.isLoading && (
                        <FormControl fullWidth>
                            <Box display="flex" alignItems="center" gap={2} mb={2}>
                                <FormLabel htmlFor="username" sx={{ whiteSpace: "nowrap", minWidth: "150px", mt: "8px" }}>
                                    Pushover user ID
                                </FormLabel>
                                <TextField
                                    id="username"
                                    autoFocus
                                    margin="dense"
                                    value={configStore.fields.pushOverId}
                                    onChange={configStore.handleChange}
                                    fullWidth
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            "& fieldset": { borderColor: "#555" },
                                            "&:hover fieldset": { borderColor: "#888" },
                                        },
                                    }}
                                />
                            </Box>

                            <Box display="flex" alignItems="center" gap={2}>
                                <FormLabel sx={{ whiteSpace: "nowrap", minWidth: "150px", mt: "8px" }}>Send test notification</FormLabel>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    fullWidth
                                    onClick={configStore.sendTest}
                                    loading={configStore.sendTestLoader.isLoading}
                                >
                                    Send
                                </Button>
                            </Box>
                        </FormControl>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={configStore.dialog.close} sx={{ color: "#888" }}>
                        Cancel
                    </Button>
                    <Button onClick={configStore.handleSubmit} sx={{ color: "#888" }} loading={configStore.loader.isLoading}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
})

export default Config
