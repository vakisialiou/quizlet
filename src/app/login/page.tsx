import { auth } from '@auth'
import Test from './Test'

export default async function LoginPage() {
  const session = await auth()

  return (
    <Test session={session} />
  )
}
