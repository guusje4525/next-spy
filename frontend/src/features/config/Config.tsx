import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import { observer } from 'mobx-react-lite'
import SettingsIcon from '@mui/icons-material/Settings'
import useStore from '../../utils/useStore'
import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import TextField from '@mui/material/TextField'
import DialogTitle from '@mui/material/DialogTitle'
import Dialog from '@mui/material/Dialog'
import DialogTransition from '../../utils/DialogTransition'
import apiClient from '../../api'
import Typography from '@mui/material/Typography'
import { useEffect } from 'react'

const Config = observer(function Config() {

    const configStore = useStore(() => ({
        loading: false,
        config: {
            userId: ''
        },
        fields: {
            userId: '',
        },
        dialogOpen: false,

        closeDialog: () => {
            configStore.dialogOpen = false
        },
        openDialog: () => {
            configStore.dialogOpen = true
        },
        handleSubmit: async () => {
            await apiClient.config.set.mutate({ userId: configStore.fields.userId })
            configStore.closeDialog()
        },
        handleChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target
            configStore.fields.userId = value
        },
        fetch: async () => {
            configStore.loading = true
            const res = await apiClient.config.get.query()
            if (res) {
                configStore.fields.userId = res.userId
            }
            configStore.loading = false
        }
    }))

    useEffect(() => {
        configStore.fetch()
    }, [configStore])

    return <Box>
        <IconButton onClick={configStore.openDialog}>
            <SettingsIcon color="info" sx={{ fontSize: '40px', color: '#999' }} />
        </IconButton>

        <Dialog
            open={configStore.dialogOpen}
            onClose={configStore.closeDialog}
            PaperProps={{ style: { backgroundColor: '#333', color: '#fff', width: '400px' } }}
            TransitionComponent={DialogTransition}>
            <DialogTitle sx={{ color: '#888', fontWeight: 700 }}>
                Configuration
            </DialogTitle>
            <DialogContent>
                {configStore.loading && <Typography>Loading...</Typography>}
                {!configStore.loading && <TextField
                    autoFocus
                    margin="dense"
                    label="Pushover user ID"
                    value={configStore.fields.userId}
                    onChange={configStore.handleChange}
                    fullWidth
                    InputLabelProps={{ style: { color: '#888' } }}
                    InputProps={{ style: { color: '#fff' } }}
                    sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#555' }, '&:hover fieldset': { borderColor: '#888' } } }}
                />}
            </DialogContent>
            <DialogActions>
                <Button onClick={configStore.closeDialog} sx={{ color: '#888' }}>
                    Cancel
                </Button>
                <Button onClick={configStore.handleSubmit} sx={{ color: '#888' }}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    </Box>
})

export default Config
