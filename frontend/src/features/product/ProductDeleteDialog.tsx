import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Typography } from '@mui/material'
import useStore from '../../utils/useStore'
import { observer } from 'mobx-react-lite'
import { useProductListStore } from './ProductListStore'
import DeleteIcon from '@mui/icons-material/Delete'
import DialogTransition from '../../utils/DialogTransition'

const ProductDeleteDialog = observer(function ProductAdd(params: { id: number }) {
  const productListStore = useProductListStore()

  const productDeleteDialogStore = useStore(sp => ({
    dialogOpen: false,
    get product() {
      return sp.productListStore.products.find(product => product.id === sp.params.id)
    },
    closeDialog: () => {
      productDeleteDialogStore.dialogOpen = false
    },
    openDialog: () => {
      productDeleteDialogStore.dialogOpen = true
    },
    handleSubmit: async () => {
      await sp.productListStore.delete(sp.params.id)
      productDeleteDialogStore.closeDialog()
    },
  }), { productListStore, params })

  return (
    <>
      <IconButton edge="end" aria-label="delete" onClick={productDeleteDialogStore.openDialog}>
        <DeleteIcon color="error" />
      </IconButton>

      <Dialog open={productDeleteDialogStore.dialogOpen} onClose={productDeleteDialogStore.closeDialog} PaperProps={{ style: { backgroundColor: '#333', color: '#fff' } }} TransitionComponent={DialogTransition}>
        <DialogTitle>
          Delete product?
        </DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want the delete {productDeleteDialogStore.product!.name}?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={productDeleteDialogStore.closeDialog} sx={{ color: '#888' }}>
            Cancel
          </Button>
          <Button onClick={productDeleteDialogStore.handleSubmit} sx={{ color: '#fff' }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
})

export default ProductDeleteDialog
