import { http } from "../http.jsx";

export const SupportService = {
  send: ({ type, subject, message, contact }) =>
    http("/support", {
      method: "POST",
      data: { type, subject, message, contact }
    }),
};
