import { Task } from '@/types/Task'

type TaskItemProps = {
  item: Task
}

function TaskItem({ item }: TaskItemProps) {
  return (
    <div className='bg-gray-800 hover:bg-gray-600 cursor-pointer text-white border border-white py-2 px-3 rounded-md'>
      <span className='text-base'>{item.name}</span>
    </div>
  )
}

export default TaskItem