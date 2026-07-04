export interface Project {
    id?: number;
    name: string;
    description: string;
    boardType?: string;
    priority?: number;
    sortOrder?: number;
    ideas?: string;
  }
  
  //Placeholder if error
  export const projects = [
    {
      name: 'KanBan Board',
      description: 'Hexisware kanban board for tasking and tracking'
    },
    {
        name: 'Placeholder',
        description: 'Placeholder'
    }
  ];