export const DUMMY_INVOICE_HEADER_DATA = {
  container: {
    alignment: "space-between",
    padding: { top: 16, right: 16, bottom: 16, left: 16 },
    backgroundColor: null,
    borderBottom: {
      enabled: true,
      color: "#E5E7EB",
      width: 1,
    },
  },
  logo: {
    visible: true,
    position: "left",
    maxWidth: 120,
    maxHeight: 60,
  },
  businessName: {
    visible: true,
    style: {
      fontFamily: "Inter",
      fontSize: 20,
      fontWeight: 700,
      color: "#111827",
      textTransform: "uppercase",
      textAlign: "left",
      lineHeight: 1.2,
    },
  },

  businessMeta: {
    visible: true,
    style: {
      fontFamily: "Inter",
      fontSize: 10,
      fontWeight: 400,
      color: "#6B7280",
      lineHeight: 1.4,
      textAlign: "left",
    },
    spacingTop: 4,
  },

  invoiceTitle: {
    visible: true,
    variant: "invoice",
    style: {
      fontFamily: "Inter",
      fontSize: 18,
      fontWeight: 600,
      color: "#111827",
      textAlign: "right",
    },
  },

  invoiceMeta: {
    layout: "stacked",
    style: {
      fontFamily: "Inter",
      fontSize: 10,
      fontWeight: 400,
      color: "#374151",
      lineHeight: 1.5,
      textAlign: "right",
    },
  },
};

export const DUMMY_HEADER_RIGHT = {
  container: {
    alignment: "flex-end",
    padding: { top: 16, right: 16, bottom: 16, left: 16 },
    backgroundColor: null,
    borderBottom: {
      enabled: true,
      color: "#E5E7EB",
      width: 1,
    },
  },

  logo: {
    visible: true,
    position: "right",
    maxWidth: 120,
    maxHeight: 60,
  },

  businessName: {
    visible: true,
    style: {
      fontFamily: "Inter",
      fontSize: 20,
      fontWeight: 700,
      color: "#111827",
      textTransform: "uppercase",
      textAlign: "right",
      lineHeight: 1.2,
    },
  },

  businessMeta: {
    visible: true,
    style: {
      fontFamily: "Inter",
      fontSize: 10,
      fontWeight: 400,
      color: "#6B7280",
      lineHeight: 1.4,
      textAlign: "right",
    },
    spacingTop: 4,
  },

  invoiceTitle: {
    visible: true,
    variant: "invoice",
    style: {
      fontFamily: "Inter",
      fontSize: 16,
      fontWeight: 600,
      color: "#111827",
      textAlign: "right",
    },
  },

  invoiceMeta: {
    layout: "stacked",
    style: {
      fontFamily: "Inter",
      fontSize: 10,
      fontWeight: 400,
      color: "#374151",
      lineHeight: 1.5,
      textAlign: "right",
    },
  },
};

export const DUMMY_HEADER_CENTER = {
  container: {
    alignment: "center",
    padding: { top: 24, right: 16, bottom: 24, left: 16 },
    backgroundColor: null,
    borderBottom: {
      enabled: true,
      color: "#E5E7EB",
      width: 1,
    },
  },

  logo: {
    visible: true,
    position: "center",
    maxWidth: 120,
    maxHeight: 60,
  },

  businessName: {
    visible: true,
    style: {
      fontFamily: "Inter",
      fontSize: 22,
      fontWeight: 700,
      color: "#111827",
      textTransform: "uppercase",
      textAlign: "center",
      lineHeight: 1.2,
    },
  },

  businessMeta: {
    visible: true,
    style: {
      fontFamily: "Inter",
      fontSize: 10,
      fontWeight: 400,
      color: "#6B7280",
      lineHeight: 1.4,
      textAlign: "center",
    },
    spacingTop: 6,
  },

  invoiceTitle: {
    visible: true,
    variant: "invoice",
    style: {
      fontFamily: "Inter",
      fontSize: 18,
      fontWeight: 600,
      color: "#111827",
      textAlign: "center",
    },
  },

  invoiceMeta: {
    layout: "stacked",
    style: {
      fontFamily: "Inter",
      fontSize: 10,
      fontWeight: 400,
      color: "#374151",
      lineHeight: 1.5,
      textAlign: "center",
    },
  },
};
