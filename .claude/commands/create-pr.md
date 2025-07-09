# Create PR

You are given the following context: $ARGUMENTS

## Instructions

Create a new GitHub pull request for the current branch. Follow these steps:

1. First, check the current git status to understand what changes will be included
2. Review the commit history since the branch diverged from main to understand the full scope of changes
3. Create a comprehensive PR description that includes:
   - Summary of changes (1-3 bullet points)
   - Test plan or verification steps
   - Any relevant context or considerations

4. Use the `gh pr create` command to create the PR with an appropriate title and body
5. Return the PR URL so the user can review it

## Important Notes

- Ensure the current branch is up to date and pushed to remote before creating the PR
- Follow the repository's existing PR conventions if any are found
- Include proper formatting in the PR body using markdown
- Add the Claude Code signature to the PR body