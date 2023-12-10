export interface Task {
    id: number;
    name: string;
    description: string;
    points: number;
    date: string;
    state: string;
  }
  //state: 'backlog' | 'ready to work' | 'in progress' | 'blocked' | 'in review' | 'done'
  //name, description, points, date, projectId
  //Placeholder if error
  export const tasks = [
    {
      id: 1,
      name: 'Task 1',
      description: 'Do the 1 thing',
      points: 1,
      date: '2021-03-01',
      projectOf: 1,
      state: 'backlog'
    },
    {
      id: 2,
      name: 'Task 2',
      description: 'Do the 2 thing',
      points: 8,
      date: '2021-08-01',
      projectOf: 1,
      state: 'in progress'
    }
  ];