import React from "react";

//sample config for container
export const HeaderContainerDummy = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "start",
  padding: "34px",
  backgroundColor: "#f5f5f5",
} as const;

interface Props {
  config: typeof HeaderContainerDummy;
  children?: React.ReactNode;
}

function HeaderContainer({ config, children }: Props) {
  return <div style={config}>{children}</div>;
}

export default HeaderContainer;
