import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import ProductList from './product/ProductList'
import { observer } from 'mobx-react-lite'
import Config from './config/Config'

const App = observer(function App() {
  return <Box sx={{ backgroundColor: '#242424' }}>
    <Box display="flex" sx={{ pt: 4, pr: 4 }}>
      <Box sx={{ flex: 1 }} />
      <Config />
    </Box>
    <Box sx={{ mt: -11 }}>
      <Box sx={{
        margin: '0',
        display: 'flex',
        placeItems: 'center',
        minWidth: '320px',
        minHeight: '100vh',
      }}>
        <Box sx={{
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
      </Box>
    </Box>
  </Box >
})

export default App
