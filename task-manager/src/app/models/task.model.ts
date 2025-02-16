export class Task {
  constructor(
    public _id: string,
    public user_id: string,
    public title: string,
    public description: string,
    public dueDate: Date,
    public completed: boolean = false
  ) {}
}
