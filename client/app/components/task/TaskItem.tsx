import { useUpdateTask } from '@/hooks/useTasks';
import { socket } from '@/lib/socket';
import { Task } from '@/types/Task'
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BiCheck } from 'react-icons/bi';

type TaskItemProps = {
  item: Task
}

function TaskItem({ item }: TaskItemProps) {
  const { id: board_id } = useParams();
  const [isDone, setIsDone] = useState(item.status === 'Done');
  const updateTask = useUpdateTask();

  useEffect(() => {
    setIsDone(item.status === 'Done');
  }, [item.status])
  
  console.log("Render Task", item.id);

  const handleToggleDone = () => {
    setIsDone(!isDone);

    updateTask.mutate(
      {
        id: item.id, name: item.name,
        description: item.description || "", status: isDone ? "Pending" : "Done",
        card_id: item.card_id, board_id: board_id as string
      }, {
      onSuccess: () => {
        socket.emit("update_task", {
          boardId: board_id,
          cardId: item.card_id,
          taskId: item.id,
          status: isDone ? "Pending" : "Done"
        });
      },
      onError: () => {
        setIsDone(!isDone);
        toast.error("Failed to update task");
      }
    }
    )
  }

  return (
    <div className='bg-gray-800 hover:bg-gray-600 cursor-pointer text-white border border-white py-2 px-3 rounded-md flex gap-2'>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleToggleDone();
        }}
        className={`mt-1 w-4 h-4 rounded-full border flex items-center justify-center transition-colors cursor-pointer
                    ${isDone
            ? 'bg-green-500 border-green-500 text-white'
            : 'border-gray-400 hover:border-white bg-transparent'
          }`}
      >
        {isDone && <BiCheck size={14} />}
      </button>
      <span className='text-base'>{item.name}</span>
    </div>
  )
}

export default TaskItem