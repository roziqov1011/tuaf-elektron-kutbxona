# Implementation Plan: Famous Books & PDF Library Enhancement

We will enhance the existing Turon University Digital Library to include a curated section for "Famous Books by Field," supporting Economics/Finance and Pedagogy/Language Learning, with PDF download access restricted to registered students.

## 1. Data Structure Enhancement
- **File:** `src/types/library.ts`
- **Change:** Add `imageUrl` (string), `pdfUrl` (string), and `field` ('economics' | 'pedagogy') to `LibraryResource` interface.

## 2. Curated Content
- **File:** `src/data/famousBooks.ts`
- **Change:** Create a new data file containing 4-6 famous books per requested field, including titles, authors, descriptions, image URLs, and PDF URLs.

## 3. Component Implementation
- **File:** `src/components/FamousBooksView.tsx`
- **Change:** Build a new section featuring a responsive grid of book cards. Each card will show the book cover (image), title, author, and a "Download PDF" button.
- **Logic:** Implement an authentication check (`isLoggedIn` or `userRole`) to toggle access to the PDF download functionality. If not logged in, the button will prompt the user to register/login.

## 4. Integration
- **File:** `src/App.tsx`
- **Change:** Integrate `FamousBooksView` into the main application layout, likely accessible via a new tab or as a prominent section on the Catalog or Home view.
- **State Management:** Ensure the user's registration status is correctly tracked via the existing state management in `App.tsx`.

## 5. Security & Verification
- **Auth Implementation:** Ensure the download logic is server-side protected (or safely validated client-side for this MVP) and strictly adheres to the "Registered Students Only" constraint.
- **Testing:** Verify the grid layout, image loading, and conditional PDF download access.
