# Task Import Guide

The Kanban board supports bulk importing tasks via JSON. You can either paste JSON directly into the import dialog or upload a `.json` file.

## How to Import

1. Open a project board (Project or Content)
2. Click the **Import** button in the board header
3. Either:
   - Click **Choose File** to upload a `.json` file
   - Or paste JSON directly into the textarea
4. Click **Import**

All imported tasks default to the **backlog** state (or **video** for content boards if no state is specified).

## JSON Format

The import accepts either a plain array of task objects:

```json
[
  {
    "name": "Task name",
    "description": "Task description",
    "points": 3,
    "date": "2025-01-15",
    "state": "backlog"
  }
]
```

Or an object with a `tasks` array:

```json
{
  "tasks": [
    {
      "name": "Task name",
      "description": "Task description",
      "points": 3,
      "date": "2025-01-15",
      "state": "backlog"
    }
  ]
}
```

## Task Fields

| Field         | Type   | Required | Default     | Description                                                                 |
|---------------|--------|----------|-------------|-----------------------------------------------------------------------------|
| `name`        | string | No       | `"Untitled"`| The task name/title                                                         |
| `description` | string | No       | `""`        | Task description                                                            |
| `points`      | number | No       | `0`         | Story points / effort estimate                                              |
| `date`        | string | No       | today       | Date in `YYYY-MM-DD` format                                                 |
| `state`       | string | No       | `"backlog"` | Task state. See valid states below.                                         |
| `priority`    | number | No       | `0`         | Priority level: 0=None, 1=Lowest, 2=Low, 3=Medium, 4=High, 5=Highest       |
| `doneDate`    | string | No       | auto        | Auto-set when state is `done` or `uploaded`. Override with `YYYY-MM-DD`.    |
| `comments`    | array  | No       | `[]`        | Array of comments. Each item can be a string or an object with `text` and `createdAt`. |

## Valid States

### Project Boards
- `backlog`
- `ready to work`
- `in progress`
- `blocked`
- `in review`
- `done`

### Content Boards
- `video`
- `uploaded`

## Comments

Each task can include an optional `comments` array. Comments can be provided as plain strings or as objects with `text` and `createdAt` fields:

```json
{
  "name": "Task with comments",
  "comments": [
    "This is a simple string comment",
    {
      "text": "This is a structured comment",
      "createdAt": "2025-01-15T10:30:00.000Z"
    }
  ]
}
```

If `createdAt` is omitted, the current timestamp is used.

## Example

See [`example-tasks-import.json`](./example-tasks-import.json) for a sample file you can use to test the import feature.
