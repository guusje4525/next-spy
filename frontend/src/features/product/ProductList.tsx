import { observer } from 'mobx-react-lite'
import useStore from '../../utils/useStore'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import List from '@mui/material/List'
import Typography from '@mui/material/Typography'
import React from 'react'
import ProductAdd from './ProductAdd'
import ProductListStore, { ProductListStoreProvider } from './ProductListStore'
import ProductDeleteDialog from './ProductDeleteDialog'

const ProductList = observer(function ProductList() {
  const productListStore = useStore(() => new ProductListStore())

  return <ProductListStoreProvider store={productListStore}>
    <List sx={{ maxWidth: '400px', m: '0 auto' }}>
      {!productListStore.products.length && <Typography sx={{ color: '#888' }}>No products found</Typography>}
      {!!productListStore.products.length && <Typography sx={{ color: '#888', mb: 4 }}>Last updated on {productListStore.lastUpdatedText}</Typography>}
      {productListStore.products.map(product => <React.Fragment key={product.id}>
        <ListItem secondaryAction={<ProductDeleteDialog id={product.id} />}>
          <ListItemText
            primary={<Typography sx={{ color: '#888' }}>{product.name}</Typography>}
            secondary={
              <Typography variant="body2" sx={{ color: '#888', display: 'inline' }}>
                {product.price === 0 ? 'No price data found' : `$${product.price}`}
              </Typography>
            }
          />
        </ListItem>
        <Divider component="li" />
      </React.Fragment>)}
    </List>
    <ProductAdd />
  </ProductListStoreProvider>
})

export default ProductList
