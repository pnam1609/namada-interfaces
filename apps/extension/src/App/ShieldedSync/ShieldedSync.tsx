import { Card } from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";
import PromisePool from "@supercharge/promise-pool";
import { ExtensionRequester } from "extension";
import { useGetAccounts } from "hooks/useGetAccounts";
import { useGetLastBlock } from "hooks/useGetBlock";
import { useRequester } from "hooks/useRequester";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { tv } from "tailwind-variants";
import {
  BLOCK_INDEX_SYNCED_KEY,
  fetchPartMASPByBlockWithRetry,
  generateArray,
  saveShieldedSync,
} from "./utils";

const loading = tv({
  slots: {
    container:
      "block h-full w-full min-h-[50vh] transition-opacity duration-150",
    panel:
      "flex flex-col items-center bg-yellow gap-10 absolute top-0 left-0 h-full w-full py-24 px-12 z-50",
    header:
      "flex items-end text-2xl font-medium min-h-[2.5em] text-center uppercase text-balance",
    image: "block max-w-[240px] mx-auto",
  },
  variants: {
    visible: {
      false: {
        container: "opacity-0 pointer-events-none absolute",
      },
    },
    variant: {
      contained: {},
      full: { container: "absolute left-0 top-0" },
    },
  },
});

enum ProgressStatus {
  Todo,
  FetchingMASP,
  Scanning,
  Done,
  Error,
}

export const ShieldedSync = () => {
  const { image } = loading({
    variant: "contained",
    visible: true,
  });
  const [progress, setProgress] = useState({
    total: 0,
    current: 0,
  });
  const { block: latestBlockIdx } = useGetLastBlock();
  const requester = useRequester();
  const { accounts, loading: loadingAccount } = useGetAccounts();
  const { accountId } = useParams<{ accountId: string }>();
  const [statusShieldedSync, setStatusShieldedSync] = useState(
    ProgressStatus.Todo
  );

  const accountFetch = useMemo(() => {
    const shieldedAccount = accounts.find(
      (acc) => acc.alias === accountId && acc.type === "shielded-keys"
    );
    return shieldedAccount;
  }, [accounts]);

  const fetchingAllMASP = async (
    requester: ExtensionRequester,
    address: string,
    latestBlock: number,
    currentIdxSynced: number,
    stepBlock?: number
  ) => {
    const defaultStepBlock = 500;
    const stepValueBlock = stepBlock || defaultStepBlock;
    const arrayStepBlock = generateArray(
      latestBlock,
      stepValueBlock,
      currentIdxSynced
    );

    setProgress((prev) => ({
      ...prev,
      total: arrayStepBlock.length,
    }));

    const { results, errors } = await PromisePool.withConcurrency(20)
      .for(arrayStepBlock)
      .onTaskFinished(() => {
        setProgress((prev) => ({
          ...prev,
          current: prev.current + 1,
        }));
      })
      .process(async (valueBlockIdx) => {
        const startBlock = valueBlockIdx;
        const rawEndBlock = valueBlockIdx + stepValueBlock - 1;
        const endBlock = rawEndBlock > latestBlock ? latestBlock : rawEndBlock;

        return await fetchPartMASPByBlockWithRetry(
          requester,
          address,
          startBlock,
          endBlock
        );
      });
    return results;
  };

  useEffect(() => {
    if (
      accountFetch?.address &&
      statusShieldedSync === ProgressStatus.Todo &&
      latestBlockIdx !== 1
    ) {
      (async () => {
        try {
          const stepBlock = 500;

          const currentIdxSynced = Number(
            localStorage.getItem(BLOCK_INDEX_SYNCED_KEY) || "1"
          );

          console.log(
            `Fetch From ${currentIdxSynced} block to ${latestBlockIdx}`
          );

          setStatusShieldedSync(ProgressStatus.FetchingMASP);

          await fetchingAllMASP(
            requester,
            accountFetch.address,
            latestBlockIdx,
            currentIdxSynced,
            stepBlock
          );

          setStatusShieldedSync(ProgressStatus.Scanning);
          await saveShieldedSync(
            requester,
            latestBlockIdx,
            stepBlock,
            currentIdxSynced
          );

          setStatusShieldedSync(ProgressStatus.Done);
        } catch (error) {
          console.error(error);
          setStatusShieldedSync(ProgressStatus.Error);
        }
      })();
    }
  }, [latestBlockIdx, accountFetch]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "calc(100% - 56px)",
      }}
    >
      <div style={{ width: 500, height: 500 }}>
        <Card
          style={{
            width: "100%",
            height: "100%",
            background: "#ff0",
            padding: 16,
          }}
        >
          <div style={{ color: "black", fontSize: 20, textAlign: "center" }}>
            Fetching MASP
          </div>

          <img
            src={"/assets/images/loading.gif"}
            alt="Loading..."
            className={image()}
          />
          <div style={{ padding: "30px 40px" }}>
            <div style={{ fontSize: 16, paddingBottom: 10 }}>
              Progress Status Sync:{" "}
            </div>
            <LinearProgress
              variant="determinate"
              value={
                Math.round((progress.current / progress.total) * 10_000) / 100
              }
              style={{ height: 16, borderRadius: 6 }}
            />
            <div
              style={{
                textAlign: "center",
                marginTop: 10,
                fontSize: 16,
              }}
            >
              {statusShieldedSync === ProgressStatus.Scanning ||
              statusShieldedSync === ProgressStatus.Done
                ? "Done 100 %"
                : `${(progress.current / progress.total) * 100 || 0} %`}
            </div>
            {statusShieldedSync === ProgressStatus.Scanning && (
              <div style={{ fontSize: 16, paddingBottom: 10 }}>
                Status: Scanning
              </div>
            )}
            {statusShieldedSync === ProgressStatus.Done && (
              <div style={{ fontSize: 16, paddingBottom: 10 }}>
                Status: Done Shielded Sync
              </div>
            )}
            {statusShieldedSync === ProgressStatus.Error && (
              <div style={{ fontSize: 16, paddingBottom: 10 }}>
                Status: Error Fetching MASP
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
