import { DeleteTaskDto, EditTaskDto, NewTaskDto, ToggleTaskStatusDto } from '../database/dtos'

export const createNewTask = async ({
  title,
  notes,
  time,
  userId,
  selectedDay,
  locale,
}: NewTaskDto) => {
  const uri = `/api/tasks/create`

  const response = await fetch(uri, {
    body: JSON.stringify({
      title,
      notes,
      time,
      locale,
      userId,
      selectedDay,
    }),
    method: 'POST',
  })

  if (response.ok) {
    const json = await response.json()
    return json
  }
  throw new Error('Task could not be created. Try again')
}

export const editTask = async ({ title, notes, taskId, time, userId }: EditTaskDto) => {
  const uri = `/api/tasks/edit`

  const response = await fetch(uri, {
    body: JSON.stringify({
      title,
      taskId,
      notes,
      time,
      userId,
    }),
    method: 'PUT',
  })

  if (response.ok) {
    const json = await response.json()
    return json
  }
  throw new Error('Task could not be edited. Try again')
}

export const deleteTask = async ({ taskId, userId }: DeleteTaskDto) => {
  const uri = `/api/tasks/delete`

  const response = await fetch(uri, {
    body: JSON.stringify({
      taskId,
      userId,
    }),
    method: 'POST',
  })

  if (response.ok) {
    return
  }
  throw new Error('Task could not be deleted. Try again')
}

export const toggleTaskStatus = async ({
  taskId,
  userId,
  isRunning,
  selectedDay,
  locale,
}: ToggleTaskStatusDto) => {
  const uri = isRunning ? `/api/tasks/stop` : '/api/tasks/start'

  const response = await fetch(uri, {
    body: JSON.stringify({
      taskId,
      locale,
      userId,
      selectedDay,
    }),
    method: 'PUT',
  })

  if (response.ok) {
    const json = await response.json()
    return json
  }
  throw new Error('Task could not be updated. Try again')
}
