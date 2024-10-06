import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import ProductList from './product/ProductList'
import { observer } from 'mobx-react-lite'

const App = observer(function App() {
  return <Box sx={{
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '2rem',
    textAlign: 'center',
  }}>
    <Typography variant="h1" sx={{ color: '#888' }}>Next spy</Typography>
    <Box sx={{ py: '2em' }}>
      <ProductList />
    </Box>
  </Box>
})

export default App
