import React from "react"
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, FormControl, FormLabel } from "@mui/material"
import useStore from "../../utils/useStore"
import { observer } from "mobx-react-lite"
import { useProductListStore } from "./ProductListStore"
import { snackbar } from "../../utils/Snackbar"
import ModalState from "../../utils/ModalState"

const ProductAdd = observer(function ProductAdd() {
    const productListStore = useProductListStore()

    const productAddStore = useStore(
        (sp) => ({
            fields: {
                id: "",
            },
            dialog: new ModalState(),
            handleSubmit: async () => {
                if (Number.isNaN(Number(productAddStore.fields.id))) {
                    return snackbar("ID can only contain numbers")
                }
                productAddStore.dialog.close()
                sp.productListStore.add(Number(productAddStore.fields.id))
            },
            handleChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                const { value } = e.target
                productAddStore.fields.id = value
            },
        }),
        { productListStore }
    )

    return (
        <>
            <Button variant="text" onClick={productAddStore.dialog.open} sx={{ color: "#888", borderColor: "#555" }}>
                Add product
            </Button>

            <Dialog
                open={productAddStore.dialog.visible}
                onClose={productAddStore.dialog.close}
                slotProps={{
                    paper: {
                        style: { width: "300px" },
                    },
                }}
            >
                <DialogTitle sx={{ color: "#888", fontWeight: 700 }}>Enter Details</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth>
                        <FormLabel htmlFor="username">Product ID</FormLabel>
                        <TextField
                            autoFocus
                            margin="dense"
                            value={productAddStore.fields.id}
                            onChange={productAddStore.handleChange}
                            fullWidth
                            sx={{
                                "& .MuiOutlinedInput-root": { "& fieldset": { borderColor: "#555" }, "&:hover fieldset": { borderColor: "#888" } },
                            }}
                        />
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={productAddStore.dialog.close} sx={{ color: "#888" }}>
                        Cancel
                    </Button>
                    <Button onClick={productAddStore.handleSubmit} sx={{ color: "#888" }}>
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
})

export default ProductAdd
