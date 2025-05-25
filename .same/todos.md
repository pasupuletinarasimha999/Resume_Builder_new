# Resume Builder Todos

## Current Tasks

(None)

## Completed Tasks

- [x] **completed** Modify JSON save functionality to use fullname as filename instead of date
  - Changed from: `resume-data-2025-05-25.json`
  - Changed to: `{sanitizedFullName}.json` (e.g., "Alex_Johnson.json")
  - Added sanitization for fullName to replace spaces and special characters with underscores
