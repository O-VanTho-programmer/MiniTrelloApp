import { Task } from '@/types/Task'

type TaskItemProps = {
  item: Task
}

function TaskItem({ item }: TaskItemProps) {
  return (
    <div className='bg-gray-600 text-white border border-white p-1 rounded-md'>
      <span className='text-base'>{item.name}</span>
    </div>
  )
}

export default TaskItem