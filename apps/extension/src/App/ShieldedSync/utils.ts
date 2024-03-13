import { ExtensionRequester } from "extension";
import { LoadTempContextMsg, SaveShieldSyncMsg } from "provider";
import { Ports } from "router";

const MAX_TIME_RETRY = 5;
export const BLOCK_INDEX_SYNCED_KEY = "block-synced-index";

export function generateArray(
  maxValue: number,
  step?: number,
  minValue?: number
) {
  const result = [];
  const defaultIndex = 1;
  const defaultStep = 200;
  if ((minValue || defaultIndex) > maxValue) return [];
  for (
    let i = minValue || defaultIndex;
    i < maxValue;
    i += step || defaultStep
  ) {
    result.push(i);
  }
  if (result[result.length - 1] > maxValue) {
    result[result.length - 1] = maxValue;
  }
  return result;
}

export const fetchPartMASPByBlock = async (
  requester: ExtensionRequester,
  address: string,
  startBlock: number,
  endBlock: number
) => {
  return await requester.sendMessage(
    Ports.Background,
    new LoadTempContextMsg(address, startBlock, endBlock)
  );
};

export const fetchPartMASPByBlockWithRetry = async (
  requester: ExtensionRequester,
  address: string,
  startBlock: number,
  endBlock: number
) => {
  let retries = 0;
  while (retries < MAX_TIME_RETRY) {
    try {
      return await fetchPartMASPByBlock(
        requester,
        address,
        startBlock,
        endBlock
      );
    } catch (err) {
      console.error(
        `Attempt ${
          retries + 1
        } failed: ${err} from ${startBlock} height to ${endBlock} height`
      );
      retries++;
    }
  }
  return false;
};

export const saveShieldedSync = async (
  requester: ExtensionRequester,
  latestBlock: number,
  step: number,
  mintBlock: number
) => {
  return await requester.sendMessage(
    Ports.Background,
    new SaveShieldSyncMsg(latestBlock, step, mintBlock)
  );
};
