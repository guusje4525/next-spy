import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material'
import useStore from '../../utils/useStore'
import { observer } from 'mobx-react-lite'
import { useProductListStore } from './ProductListStore'

const ProductAdd = observer(function ProductAdd () {
    const productListStore = useProductListStore()

    const productAddStore = useStore(sp => ({
        fields: {
            id: '0',
        },
        dialogOpen: false,
        closeDialog: () => {
            productAddStore.dialogOpen = false
        },
        openDialog: () => {
            productAddStore.dialogOpen = true
        },
        handleSubmit: async () => {
            if (Number.isNaN(Number(productAddStore.fields.id))) {
                return alert('ID can only contain numbers')
            }
            productAddStore.closeDialog()
            sp.productListStore.add(Number(productAddStore.fields.id))
        },
        handleChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            const { value } = e.target
            productAddStore.fields.id = value
        }
    }), { productListStore })

  return (
    <>
      <Button variant="text" onClick={productAddStore.openDialog} sx={{ color: '#888', borderColor: '#555' }}>
        Add product
      </Button>

      <Dialog open={productAddStore.dialogOpen} onClose={productAddStore.closeDialog} PaperProps={{ style: { backgroundColor: '#333', color: '#fff' } }}>
        <DialogTitle sx={{ color: '#888', fontWeight: 700 }}>
            Enter Details
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="ID"
            name="id"
            value={productAddStore.fields.id}
            onChange={productAddStore.handleChange}
            fullWidth
            InputLabelProps={{ style: { color: '#888' } }}
            InputProps={{ style: { color: '#fff' } }}
            sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#555' }, '&:hover fieldset': { borderColor: '#888' } } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={productAddStore.closeDialog} sx={{ color: '#888' }}>
            Cancel
          </Button>
          <Button onClick={productAddStore.handleSubmit} sx={{ color: '#888' }}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
})

export default ProductAdd