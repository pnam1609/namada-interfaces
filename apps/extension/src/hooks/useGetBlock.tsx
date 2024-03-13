import { QueryLastBlocksMsg } from "provider";
import { useEffect, useState } from "react";
import { Ports } from "router";
import { useRequester } from "./useRequester";

export const useGetLastBlock = () => {
  const [block, setBlock] = useState(1);
  const requester = useRequester();

  const getIndexLatestBlock = async () => {
    const latestBlock = await requester.sendMessage(
      Ports.Background,
      new QueryLastBlocksMsg()
    );
    setBlock(latestBlock);
  };
  useEffect(() => {
    getIndexLatestBlock();
  });

  return { block };
};
