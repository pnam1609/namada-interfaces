import { ParentAccounts } from "App/Accounts/ParentAccounts";
import { LoadingStatus } from "App/types";
import { useAccountContext, useVaultContext } from "context";
import { openSetupTab } from "utils";

export const Root = () => {
  const { status: accountLoadingStatus } = useAccountContext();
  const { passwordInitialized } = useVaultContext();

  if (
    !passwordInitialized &&
    accountLoadingStatus === LoadingStatus.Completed
  ) {
    openSetupTab();
    return <></>;
  }

  if (accountLoadingStatus === LoadingStatus.Completed) {
    return <ParentAccounts />;
  }

  return <div>Loading</div>;
};
