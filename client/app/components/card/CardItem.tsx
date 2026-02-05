import { Card } from '@/types/Card'

type CardItemProps = {
    item: Card
}

function CardItem({item}: CardItemProps) {
  return (
    <div className='bg-gray-600 text-white border border-white p-1 rounded-md'>
        <span className='text-base'>{item.name}</span>
    </div>
  )
}

export default CardItem