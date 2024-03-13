import { DerivedAccount } from "@namada/types";
import { QueryAccountsMsg } from "provider";
import { useEffect, useState } from "react";
import { Ports } from "router";
import { useRequester } from "./useRequester";

export const useGetAccounts = () => {
  const requester = useRequester();
  const [loading, setIsLoading] = useState(false);
  const [accounts, setAccounts] = useState<DerivedAccount[]>([]);

  const getAccount = async () => {
    setIsLoading(true);
    const accounts = await requester.sendMessage(
      Ports.Background,
      new QueryAccountsMsg()
    );
    setIsLoading(false);
    setAccounts(accounts);
  };

  useEffect(() => {
    getAccount();
  }, []);

  return { accounts, loading };
};
