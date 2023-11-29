import { ActionButton } from "@namada/components";
import {
  InstallExtensionContainer,
  InstallExtensionContent,
  InstallExtensionContentWrapper,
  InstallExtensionTitle,
} from "./InstallExtensionPanel.components";

type InstallExtensionPanelProps = {
  children: React.ReactNode;
  size?: "large" | "small";
};

export const InstallExtensionPanel = ({
  size = "small",
  children,
}: InstallExtensionPanelProps): JSX.Element => {
  return (
    <InstallExtensionContainer size={size}>
      <InstallExtensionTitle>
        Don&apos;t have Namada address yet?
      </InstallExtensionTitle>
      <InstallExtensionContentWrapper>
        <InstallExtensionContent>{children}</InstallExtensionContent>
        <ActionButton
          size="sm"
          borderRadius="sm"
          variant="utility1"
          hoverColor="secondary"
        >
          Install Extension
        </ActionButton>
      </InstallExtensionContentWrapper>
    </InstallExtensionContainer>
  );
};