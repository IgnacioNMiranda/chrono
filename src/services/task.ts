import { NewTaskDto } from '../database/dtos'

export const createNewTask = async ({ title, notes, time, userId }: NewTaskDto) => {
  const uri = `/api/tasks/create`

  const response = await fetch(uri, {
    body: JSON.stringify({
      title,
      notes,
      time,
      userId,
    }),
    method: 'POST',
  })

  if (response.ok) {
    const json = await response.json()
    return json
  }
  throw new Error('Task could not be created. Try again')
}
