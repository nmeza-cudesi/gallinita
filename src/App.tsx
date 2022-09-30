import { ChakraProvider } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { RecoilRoot } from "recoil";
import { Routes } from "./Routes/Routes";
import "./Admin/UI/Components/MyTable/MyTable.css";
import { QueryClientProvider, useQuery } from "react-query";
import queryClient from "./Mutations/Client";
import RecoilOutside from "./Utils/RecoilOutside/RecoilOutside";
import AccountsServices from "./Service/AccountsService";

function App() {
  const accounts_service = new AccountsServices();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  async function Accounts() {
    let origin = window.location.origin;
    let hostname = window.location.hostname;

    const res_accounts: any = await accounts_service.get_account({
      origin,
      hostname,
    });

    if (res_accounts.status === 200) {
      console.log(res_accounts)
      setIsLoading(false);
      setIsError(false);
      return;
    }
    
    console.log("Error");
    // console.log("Salio del 200");
  }

  useEffect(() => {
    Accounts();
  }, []);

  if (isLoading) return <>Cargando ...</>;
  if (isError) return <>Error ....</>;

  if (!isLoading && !isError) {
    return (
      <QueryClientProvider client={queryClient} contextSharing={true}>
        <RecoilRoot>
          <RecoilOutside />
          <ChakraProvider>
            <Routes />
          </ChakraProvider>
        </RecoilRoot>
      </QueryClientProvider>
    );
  }
}

export default App;
