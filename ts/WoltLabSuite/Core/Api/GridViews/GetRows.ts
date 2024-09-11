import { prepareRequest } from "WoltLabSuite/Core/Ajax/Backend";
import { ApiResult, apiResultFromError, apiResultFromValue } from "../Result";

type Response = {
  template: string;
};

export async function getRows(
  gridViewClass: string,
  pageNo: number,
  sortField: string = "",
  sortOrder: string = "ASC",
): Promise<ApiResult<Response>> {
  const url = new URL(`${window.WSC_RPC_API_URL}core/gridViews/rows`);
  url.searchParams.set("gridView", gridViewClass);
  url.searchParams.set("pageNo", pageNo.toString());
  url.searchParams.set("sortField", sortField);
  url.searchParams.set("sortOrder", sortOrder);

  let response: Response;
  try {
    response = (await prepareRequest(url).get().allowCaching().disableLoadingIndicator().fetchAsJson()) as Response;
  } catch (e) {
    return apiResultFromError(e);
  }

  return apiResultFromValue(response);
}