import axios from "axios";
import requestConfig from "../config";

export async function requestHandler({
  method,
  payload = {},
  url,
}: {
  method: string;
  payload?: any;
  url: string;
}) {
  const config = {
    method,
    url: `${requestConfig.domain}${url}`,
    headers: {
      authorization: "",
    },
    data: payload,
  };

  return axios(config);
}
