```ts
import { Converge, z } from "convergejs"

export const App = new Converge()

// Get example
App.router.get(
  `/:authorId[number] /:blogId[number] /:postId[number] ? :linkAnchor[string]`,
  async ({ params, searchParams }) => {
    return new Response("Hello World!", { status: 200 });
  }
)

// Patch example.
const userInfoSchema = z.object({
  newUsername: z.string().optional(),
  newDisplayname: z.string().optional(),
  newAvatar: z.union([
    z.string().url().endsWith(".png"),
    z.string().url().endsWith(".jpeg"),
    z.string().url().endsWith(".jpg")
  ])
})
App.router.patch(
  `/settings /userInfo`,
  async ({ body }) => {
    return new Response("Hello World!", { status: 200 });
  },
  { body: userInfoSchema }
)

// Runs app.
App.run()
```