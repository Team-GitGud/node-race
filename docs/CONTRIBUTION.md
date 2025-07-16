# Contribution Guide

This guide outlines best practices for using GitHub in our project.

---

## Kanban Board

- Use the [GitHub Projects (Kanban board)](https://github.com/orgs/Team-GitGud/projects/3) to track progress.
- **Columns:**
  - `Backlog`: For tasks that are not yet started.
  - `Ready`: For tasks that are ready to be worked on.
  - `In progress`: For tasks currently being worked on.
  - `In review`: For tasks that are completed and ready for review via a pull request.
  - `Done`: For tasks that have been reviewed and merged into the main branch.
- **Link issues to tasks:**
  - Every task should have a corresponding issue.
  - Move issues across columns as work progresses.
  - See issues documentation below for more details on issue management.

## Issues

- **Create an issue for every task, bug, or feature.**
- **Use clear, descriptive titles and details.**

### Types

- `feature`: New feature or enhancement.
- `bug`: Bug fix.
- `docs`: Documentation changes.
- `chore`: Maintenance tasks.
- `refactor`: Code changes that neither fix a bug nor add a feature.
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc.).
- `test`: Adding missing tests or correcting existing tests.
- `ci`: Changes to our CI pipeline configuration files and scripts.
- `perf`: Changes that improve performance.

### Labels

- `frontend`: Issues related to the frontend.
- `backend`: Issues related to the backend.
- `integration`: Issues that involve both frontend and backend.

### Priority

- `high`: Critical issues that need immediate attention.
- `medium`: Important issues that should be addressed soon.
- `low`: Minor issues that can be addressed later.

### Milestones (Sprints)

- Use milestones to group issues for specific project sprints.
- Signify the sprint number in the milestone title (e.g., "Sprint 1").

---

## Branching

- **Create a new branch for each issue or feature.**
- **Branch naming convention:**
  - `<username>/<issue-title>`
  - Example: `alexanderheffernan/feature-login`
- **Never commit directly to `main`.**
- **Keep branches focused on a single issue or feature.**

---

## Commits

- **Commit messages should be clear and consistent.**
- **Commit message format:**
  - `<type>(<scope>): <short description>`
  - Example: `feature(frontend): add login form`
- **Make small, focused commits.**

---

## Pull Requests (PRs)

- **Is your branch ready for review?**
  - Ensure all changes are committed and pushed to your branch.
  - Run tests to ensure everything works as expected.
  - Update documentation if necessary.
- **Open a PR when your branch is ready for review.**
- **PR title format:**
  - `<type>(<scope>): <short description> (issue #<issue-number>)`
  - Example: `feature(frontend): add login form (issue #42)`
- **Reference the related issue in the PR description.**
- **Request reviews from at least one other team member.**
- **If critical changes are made, request at least two reviews from other team members.**
- **Merge PRs to keep the commit history clean.**

---

## General Best Practices

- **Pull the latest changes from `main` before starting work.**
- **Resolve merge conflicts promptly.**
- **Keep documentation up to date.**
- **Keep tests updated and ensure they pass before merging.**