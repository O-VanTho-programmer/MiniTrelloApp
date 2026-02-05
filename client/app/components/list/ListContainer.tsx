import { Card } from '@/types/Card'
import CardItem from '../card/CardItem'
import { FaPlus } from 'react-icons/fa'

type ListContainerProps = {
    title: string
    cards: Card[]
}

function ListContainer({ title, cards }: ListContainerProps) {
    return (
        <div className="min-w-[100px] flex-1 shrink-0">
            <div className="bg-gray-800 rounded-xl p-3 shadow-sm">

                <h3 className="font-bold text-gray-200 text-sm">{title}</h3>

                <div className="max-h-[70vh] overflow-y-auto">
                    {cards.map((card, idx) => (
                        <CardItem key={idx} item={card} />
                    ))}
                </div>

                <button className="w-full flex items-center gap-2 text-gray-400 hover:text-gray-100 hover:bg-gray-700 py-2 px-2 rounded-lg text-sm mt-1 cursor-pointer">
                    <FaPlus size={12} />
                    <span>Add a card</span>
                </button>
            </div>
        </div>
    )
}

export default ListContainer