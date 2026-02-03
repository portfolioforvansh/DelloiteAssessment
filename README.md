# User Dashboard Assessment

## Overview

This project demonstrates efficient large data fetching and display in a React application. It is designed to showcase performance optimization, robust API integration, error handling, and smooth user experience when working with large datasets. The solution addresses the following assessment scenario:

> **Assessment:**  
> Design and implement a data‑fetching mechanism to efficiently load and display a large amount of data on a web page using React. The solution should focus on performance optimization, and a smooth user experience. Candidate should demonstrate how they handle API integration, loading states, error handling, and UI performance when working with large datasets.  
>  
> **Scenario:**  
> If you have multiple asynchronous calls, how will you prioritize them & handle them to show the data?

---

## Features & Approaches

### 1. Efficient Large Data Rendering

- **Virtualization:**  
  Utilizes [`react-window`](https://github.com/bvaughn/react-window) to render only visible items in the user list, ensuring smooth performance even with hundreds of records.

### 2. API Integration & Parallel Fetching

- **Multiple APIs:**  
  Fetches data from four APIs in parallel:
  - Users (randomuser.me)
  - Posts (jsonplaceholder)
  - Comments (jsonplaceholder)
  - Todos (jsonplaceholder)
- **Custom Hook:**  
  All data fetching, loading, and error state management is encapsulated in a custom hook (`useDashboardData`), keeping UI logic clean and maintainable.

### 3. Loading & Error States

- **Granular State Management:**  
  Each API call maintains its own loading and error state, providing clear feedback to the user for each data section.
- **User-Friendly Messages:**  
  Displays loading indicators and error messages for both the main user list and additional data sections.

### 4. Performance Optimization

- **Virtualized List:**  
  Only renders the visible portion of the user list, drastically reducing DOM nodes and improving rendering speed.
- **Minimized API Requests:**  
  Limits the number of users fetched to avoid API rate limits and unnecessary network load.

### 5. Prioritization of Asynchronous Calls

- **Critical Data First:**  
  The user list (primary data) is fetched and displayed as soon as possible.
- **Other Data in Parallel:**  
  Posts, comments, and todos are fetched in parallel and displayed independently, ensuring the UI remains responsive.

### 6. UI/UX & Accessibility

- **Responsive Design:**  
  Uses CSS for a clean, modern, and responsive layout.
- **Accessibility:**  
  Semantic HTML and clear feedback for loading/error states.

### 7. Code Structure & Best Practices

- **TypeScript:**  
  Provides type safety and improved maintainability.
- **Separation of Concerns:**  
  API logic, UI components, and styles are organized in separate files and folders.
- **Cleanup:**  
  Unused files, folders, and variables are removed for clarity.

---

## Assumptions

- The APIs used are public and do not require authentication.
- The user dataset size is limited to avoid API rate limits and ensure smooth performance.
- All API responses are well-formed and contain the expected fields.
- The application is intended for desktop and modern browsers.
- Data does not need to be updated in real time.
- No sensitive or private data is handled in this demo.

---

## Possible Enhancements

- **Pagination or Infinite Scrolling:**  
  For even larger datasets, implement pagination or infinite scroll to further optimize performance and user experience.
- **Client-side Caching:**  
  Use caching strategies (e.g., React Query, localStorage) to reduce redundant API calls and improve perceived speed.
- **API Retry & Backoff:**  
  Add retry logic with exponential backoff for handling transient API errors and rate limits.
- **Real-time Updates:**  
  Integrate WebSockets or polling to update data in real time if required.
- **Mobile Responsiveness:**  
  Enhance CSS for better mobile and tablet support.
- **Authentication & Authorization:**  
  Add support for authenticated APIs and user-specific data.
- **Unit & Integration Testing:**  
  Add automated tests for data fetching, error handling, and UI components.
- **Accessibility Improvements:**  
  Further improve keyboard navigation and screen reader support.
- **User Actions:**  
  Allow user interactions such as searching, filtering, or sorting the user list.

---

## How to Run

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Start the development server:**
   ```bash
   npm start
   ```
3. **View the app:**  
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Folder Structure

```
src/
  ├── api/                # API logic
  ├── hooks/              # Custom hooks (useDashboardData)
  ├── components/         # Main Dashboard component
  ├── styles/             # Global and component CSS
  ├── App.tsx             # App entry point
  └── index.tsx           # React DOM entry point
```

---

## License

MIT

