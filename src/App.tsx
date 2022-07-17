import { ChakraProvider } from '@chakra-ui/react'
import React from 'react'
import { RecoilRoot } from 'recoil'
import { Routes } from './Routes/Routes'
import './Admin/UI/Components/MyTable/MyTable.css'
import { QueryClientProvider } from 'react-query'
import queryClient from './Mutations/Client'
import RecoilOutside from './Utils/RecoilOutside/RecoilOutside'

function App() {
  return (
    <QueryClientProvider client={queryClient}  contextSharing={true}>
      <RecoilRoot>
        <RecoilOutside/>
        <ChakraProvider>
          <Routes />
        </ChakraProvider>
      </RecoilRoot>
    </QueryClientProvider>
  )
}

export default App
