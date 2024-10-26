import Image from 'next/image'

export default async function Header() {
  return (
    <header>
      <nav className="mx-auto flex items-center justify-between p-6 lg:px-8 lg:gap-x-12">
        <a href="#" className="-m-1.5 p-1.5">
          <span className="sr-only">Quizlet</span>
          <Image
            priority
            alt="Logo"
            height={20}
            width={23.5}
            src="/svg/logo.svg"
          />
        </a>

        <div className="hidden lg:flex lg:gap-x-12">
          <a href="#" className="text-sm font-semibold leading-6 text-gray-300">Main</a>
          <a href="#" className="text-sm font-semibold leading-6 text-gray-300">Folders</a>
          <a href="#" className="text-sm font-semibold leading-6 text-gray-300">Company</a>
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <a href="#" className="text-sm font-semibold leading-6 text-gray-300">
            Log in
          </a>
        </div>
      </nav>

      <div className="lg:hidden" role="dialog" aria-modal="true">

        <div className="fixed inset-0 z-10"></div>
        <div
          className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-gray-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-300/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Quizlet</span>
              <Image
                priority
                alt="Logo"
                height={20}
                width={23.5}
                src="/svg/logo.svg"
              />
            </a>
            <button type="button" className="-m-2.5 rounded-md p-2.5 text-gray-500">
              <span className="sr-only">Close menu</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                   stroke="currentColor" aria-hidden="true" data-slot="icon">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500">
              <div className="space-y-2 py-6">
                <a href="#"
                   className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-300">Features</a>
                <a href="#"
                   className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-300">Marketplace</a>
                <a href="#"
                   className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-300">Company</a>
              </div>
              <div className="py-6">
                <a href="#"
                   className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-300">Log in</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
