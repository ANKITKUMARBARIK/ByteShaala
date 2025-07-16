# LMS (Learning Management System) Frontend

A React-based frontend for a course selling Learning Management System with a clean, responsive, and professional UI.

## Technology Stack

- **Core React JS**: Frontend library for building user interfaces
- **Tailwind CSS**: Utility-first CSS framework with global configuration for typography and color themes
- **RTK Query**: For API calls with a common base API interceptor
- **Redux**: For global state management
- **React Router DOM**: For page navigation

## Project Structure

```
src/
├── Components/
│   ├── Courses/       # Course-related components (CourseList, CourseCard, etc.)
│   ├── Profile/       # Profile-related components (ProfileDetails, EditProfileForm, etc.)
│   ├── Auth/          # Authentication components (LoginForm, SignupForm, etc.)
│   ├── Admin/         # Admin-related components (AddCourseForm, CourseTable, etc.)
│   └── Common/        # Reusable components (Button, Input, Loader, etc.)
├── Pages/
│   ├── Profile/       # Profile page (index.js)
│   ├── Courses/       # Courses page (index.js)
│   ├── CourseDetail/  # Course Detail page (index.js)
│   ├── Register/      # Registration page (index.js)
│   ├── Login/         # Login page (index.js)
│   └── Admin/         # Admin pages (index.js)
├── Utils/
│   └── common.js      # Utility functions
├── Static/
│   └── content.js     # Static content (e.g., default avatars, placeholder data)
├── Actions/
│   ├── courseActions.js  # RTK Query endpoints for courses
│   └── profileActions.js # RTK Query endpoints for profile
├── theme/
│   └── tailwind.config.js # Tailwind CSS configuration file (typography, colors, etc.)
├── store/
│   ├── store.js       # Redux store configuration
│   ├── slices/        # Redux slices (e.g., userSlice, courseSlice)
│   └── api/           # RTK Query base API configuration
├── assets/
│   ├── images/        # Images
│   └── svg/           # SVG components
└── App.js             # Main application component
└── index.js           # Entry point
```

## Features

1. **Authentication (Auth Module):**
   - Sign-up and Login pages with form validation
   - RTK Query for authentication API calls
   - Redux store for user authentication status and data

2. **Course Listing (Courses Module & Courses Page):**
   - Display course listings with search/filtering
   - RTK Query for course data fetching

3. **Course Detail Page:**
   - Detailed course information display
   - "Buy Now" or "Enroll" button

4. **User Profile (Profile Module & Profile Page):**
   - User details display and editing
   - Password change functionality
   - Purchased courses list

5. **Admin Interface (Admin Module & Admin Pages):**
   - Course management (list, add, edit, remove)
   - Course status management (draft/active)

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## API Configuration

The application is configured to use RTK Query for all API interactions. The base API is set up with a common interceptor for handling authentication tokens.

Example API endpoints:
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/courses`
- `POST /api/courses`
- `PUT /api/courses/:id`
- `DELETE /api/courses/:id`
- `GET /api/profile`
- `PUT /api/profile`

## Tailwind CSS Configuration

The project uses Tailwind CSS with a custom configuration for typography, colors, and other theme settings. The configuration is defined in `tailwind.config.js` and includes:

- Custom color palette (primary, secondary, accent)
- Typography settings (font families, sizes, headings)
- Custom components and utilities

## State Management

Redux is used for global state management with the following slices:
- `authSlice`: Manages user authentication state
- `courseSlice`: Manages course data and filtering options

RTK Query is used for API calls with endpoints defined in the Actions directory.
