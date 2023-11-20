import { type RouteFn, route } from "./route/route";
import { ObjectPrettify } from "./utils/utils.types";

export class Converge {

  routes: { [Path: string]: RouteFn<any, any, any> } = {}
  
  router = {
    get: route("get", this),
    post: route("post", this),
    patch: route("patch", this)
  }

  run = () => {
    const app = this
    Bun.serve({
      async fetch({ url, headers, json }: Request): Promise<Response> {
        const urlClss = new URL(url)

        

        return app.routes[urlClss.pathname]({
          params: "" as any,
          searchParams: "" as any,
          url: urlClss,
          headers: headers,
          body: await json()
        })
      },
    
      // Optional port number - the default value is 3000
      port: 3000,
      development: true,
    })
  }

}

export { z } from "zod"