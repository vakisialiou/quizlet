import { prisma } from '@lib/prisma'

export async function GET(req: Request) {

  console.log(await prisma.user.findMany())
  return new Response(JSON.stringify({ folders: [] }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  })
}
