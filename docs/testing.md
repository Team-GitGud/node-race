# Testing Guide

This document described how to manually run tests for both the frontend and backend, and explains the automated testing setup using GitHub Actions.

---

## Manual Testing

### Frontend

The frontend uses Jest for unit testing.

**To run frontend tests:**

1. Open a terminal and navigate to the `frontend` directory:
   ```sh
   cd frontend
   ```
2. Install dependencies (if not already done):
   ```sh
   npm ci
   ```
3. Run the unit tests:
   ```sh
   npm run test:unit
   ```

Test results will be displayed in the terminal.

---

### Backend

The backend uses Vitest for testing

**To run backend tests:**

1. Open a terminal and navigate to the `backend` directory:
   ```sh
   cd backend
   ```
2. Install dependencies (if not already done):
   ```sh
   npm ci
   ```
3. Run the tests:
   ```sh
   npm test
   ```

Test results will be displayed in the terminal.

---

## Automated Testing (GitHub Actions)

Automated tests are run on every push and pull request to the `main` branch, or when relevant files are changed.
There are two separate workflows:

### Frontend Tests

- **Workflow file:** `./github/workflows/test-frontend.yml`
- **Trigger:** Runs when files in `frontend/**` or the workflow file itself are changed.
- **Process:**
  - Checks out the repository.
  - Sets up Node.js environment.
  - Installs dependencies using `npm ci`.
  - Runs frontend unit tests using `npm run test:unit`.
  
### Backend Tests

- **Workflow file:** `./github/workflows/test-backend.yml`
- **Trigger:** Runs when files in `backend/**` or the workflow file itself are changed.
- **Process:**
  - Checks out the repository.
  - Sets up Node.js environment.
  - Installs dependencies using `npm ci`.
  - Runs backend tests using `npm test`.
  
Both workflows run on the self-hosted `trunas` runner.

---

## Best Practices

- Always run tests locally before pushing changes.
- Ensure all tests pass before opening a pull request.
- Review test results in the GitHub Actions tab after pushing or opening a PR.

---