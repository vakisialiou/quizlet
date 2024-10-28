import Link from 'next/link'

export default function Page({ params }: { params: { id: string } }) {
  return (
    <div>
      <Link href="../">Назад</Link>

      <br/>
      Page {params.id}
    </div>
  )
}
