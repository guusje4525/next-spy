import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Typography } from "@mui/material"
import useStore from "../../utils/useStore"
import { observer } from "mobx-react-lite"
import { useProductListStore } from "./ProductListStore"
import DeleteIcon from "@mui/icons-material/Delete"
import ModalState from "../../utils/ModalState"

const ProductDeleteDialog = observer(function ProductAdd(params: { id: string }) {
    const productListStore = useProductListStore()

    const productDeleteDialogStore = useStore(
        (sp) => ({
            dialog: new ModalState(),
            get product() {
                return sp.productListStore.products.find((product) => product.id === sp.params.id)
            },
            handleSubmit: async () => {
                await sp.productListStore.delete(sp.params.id)
                productDeleteDialogStore.dialog.close()
            },
        }),
        { productListStore, params }
    )

    return (
        <>
            <IconButton onClick={productDeleteDialogStore.dialog.open}>
                <DeleteIcon sx={{ fontSize: "40px", color: "#999" }} />
            </IconButton>

            <Dialog open={productDeleteDialogStore.dialog.visible} onClose={productDeleteDialogStore.dialog.close}>
                <DialogTitle>Delete product?</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want the delete {productDeleteDialogStore.product!.name}?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={productDeleteDialogStore.dialog.close} sx={{ color: "#888" }}>
                        Cancel
                    </Button>
                    <Button onClick={productDeleteDialogStore.handleSubmit} sx={{ color: "#fff" }}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
})

export default ProductDeleteDialog
