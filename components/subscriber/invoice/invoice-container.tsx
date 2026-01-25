import React from "react";

//sample config for container

interface Props {
  config: string;
  children?: React.ReactNode;
}

function InvoiceContainer({ config, children }: Props) {
  return <div className={config}>{children}</div>;
}

export default InvoiceContainer;
