import styled from "styled-components";
import { motion } from "framer-motion";

export const AccountCreationContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  box-sizing: border-box;
  background-color: ${(props) => props.theme.colors.utility1.main80};
  color: ${(props) => props.theme.colors.utility2.main80};
  padding: ${(props) =>
    props.theme.themeConfigurations.isLightMode ? "0 32px" : "4px 36px 0 32px"};
  height: 100%;
  width: 480px;
  transition: background-color 0.3s linear;
`;

export const MotionContainer = styled(motion.div)`
  height: 100%;
  box-sizing: border-box;
`;

export const TopSection = styled.section`
  display: flex;
  justify-content: start;
  align-items: center;
  width: 100%;
  margin: 32px 0;
`;

export const TopSectionHeaderContainer = styled.section`
  display: flex;
  justify-content: center;
  width: 100%;
  align-items: center;
`;

export const TopSectionButtonContainer = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 48px;
  min-height: 50px;
`;

export const RouteContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;