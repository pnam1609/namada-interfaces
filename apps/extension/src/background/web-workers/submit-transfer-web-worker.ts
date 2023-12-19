import { fromBase64 } from "@cosmjs/encoding";
import { deserialize, serialize } from "@dao-xyz/borsh";
import { chains, defaultChainId } from "@namada/chains";
import { Sdk } from "@namada/shared";
import { init as initShared } from "@namada/shared/src/init";
import { TxMsgValue } from "@namada/types";
import {
  INIT_MSG,
  SubmitTransferMessageData,
  TRANSFER_FAILED_MSG,
  TRANSFER_SUCCESSFUL_MSG,
  WEB_WORKER_ERROR_MSG,
} from "./types";

(async function init() {
  await initShared();
  const sdk = new Sdk(chains[defaultChainId].rpc);
  await sdk.load_masp_params();

  addEventListener(
    "message",
    async ({ data }: { data: SubmitTransferMessageData }) => {
      try {
        const txMsg = fromBase64(data.txMsg);

        const { privateKey, xsk } = data.signingKey;

        if (!xsk) {
          await sdk.reveal_pk(privateKey as string, txMsg);
        }

        let www = txMsg;
        if (xsk) {
          const asd = deserialize(Buffer.from(txMsg), TxMsgValue);
          asd.feeUnshield = xsk;
          www = serialize(asd);
        }

        const builtTx = await sdk.build_transfer(
          fromBase64(data.transferMsg),
          www,
          xsk
        );
        const txBytes = await sdk.sign_tx(builtTx, www, privateKey);
        await sdk.process_tx(txBytes, www);

        postMessage({ msgName: TRANSFER_SUCCESSFUL_MSG });
      } catch (error) {
        console.error(error);
        postMessage({
          msgName: TRANSFER_FAILED_MSG,
          payload: error instanceof Error ? error.message : error,
        });
      }
    },
    false
  );

  postMessage({ msgName: INIT_MSG });
})().catch((error) => {
  const { message, stack } = error;
  postMessage({
    msgName: WEB_WORKER_ERROR_MSG,
    payload: { message, stack },
  });
});
