import { ZodType } from "zod"
import { Converge } from ".."
import { ParseParamsFromPathArray, PathStringToArray, SplitPathStr } from "./route.types"

type ConvergeRequest<Params, SearchParams, Body> = {
  params: keyof Params extends never ? never : Params,
  searchParams: SearchParams extends never ? never : SearchParams,
  url: URL,
  headers: Headers,
  body: Body
}

export type RouteFn<Params, SearchParams, Body> = (
  request: ConvergeRequest<Params, SearchParams, Body>
) => Promise<Response>



export const route = (method: "get" | "post" | "patch", clss: Converge) => (
  (<
    _Body extends ZodType,

    _PathStr extends string = string,
    _PathParamsAndSearchParamsArr extends string[] = SplitPathStr<_PathStr>,
    _Params = ParseParamsFromPathArray<PathStringToArray<_PathParamsAndSearchParamsArr[0], "/">>,
    _SearchParams = ParseParamsFromPathArray<PathStringToArray<_PathParamsAndSearchParamsArr[1], "&">>,
  >(
    path: _PathStr,
    routeFn: RouteFn<_Params, _SearchParams, _Body>,
    runtimeParsing?: { body: _Body }
  ) => {
    clss.routes[path] = routeFn
  })
)
