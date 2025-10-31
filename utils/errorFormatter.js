// utils/errorFormatter.js
export const formatError = ({
  code,
  message,
  status = 400,
  details = [],
  path = "",
}) => {
  return {
    error: {
      code,
      message,
      status,
      details,
      timestamp: new Date().toISOString(),
      path,
    },
  };
};

// helper to build param detail
export const paramDetail = (field, issue) => ({ field, issue });
