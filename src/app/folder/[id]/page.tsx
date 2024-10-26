import Link from 'next/link'

export default function Page({ params }: { params: { id: string } }) {
  return (
    <div>
      <Link href="../">Назад</Link>
      Page {params.id}
    </div>
  )
}
