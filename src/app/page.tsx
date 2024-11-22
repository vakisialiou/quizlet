import {auth} from '@auth'
import Link from 'next/link'

export default async function Page() {
  const session = await auth()

  return (
    <div className="flex flex-col items-center justify-center w-full h-80">
      {session &&
        <div className="flex flex-col gap-8 justify-center items-center text-center">
          <div className="text-xl font-bold">Create folder to start <br/>learn new terms!</div>

          <Link
            href="/private"
            className="text-gray-400 underline hover:text-gray-500"
          >
            Go to folders 👉🏼
          </Link>
        </div>
      }

      {!session &&
        <div className="inline text-center">
          Sign-in to start learn new terms!
        </div>
      }
    </div>
  )
}
