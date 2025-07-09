# start-task

You are given the following context: $ARGUMENTS

## Framework: Explore -> Plan -> Code

Follow this systematic approach for any new development task:

### 1. EXPLORE Phase
- **Understand the codebase**: Use search tools (Grep, Glob, Task) to understand existing code structure
- **Analyze requirements**: Break down what needs to be accomplished
- **Identify dependencies**: Look for existing components, libraries, and patterns to follow
- **Research constraints**: Check existing conventions, styling, and architectural patterns

### 2. PLAN Phase
- **Use TodoWrite tool**: Create a structured todo list breaking down the task into specific, actionable items
- **Prioritize tasks**: Mark items as high/medium/low priority
- **Consider edge cases**: Think about error handling, responsive design, accessibility
- **Define success criteria**: What constitutes completion of each task

### 3. CODE Phase
- **Mark todos as in_progress**: Only work on one task at a time
- **Follow existing patterns**: Use established conventions, styling, and component patterns
- **Test as you go**: Verify functionality after each major change
- **Complete tasks properly**: Mark todos as completed immediately after finishing each item
- **Run quality checks**: Execute lint, typecheck, and test commands before final completion

## Best Practices
- Always read relevant files before making changes
- Use the existing tech stack and libraries
- Follow established naming conventions and code style
- Never create new files unless absolutely necessary
- Prefer editing existing files over creating new ones
- Run development server to test changes: `npm run dev`

## Quality Assurance
Before marking the entire task complete:
- Run `npm run lint` to check code quality
- Run `npm run build` to verify production build
- Test functionality in browser
- Verify responsive design on mobile

Start by exploring the codebase to understand what needs to be done, then create a comprehensive plan with TodoWrite, and finally execute the code changes systematically.