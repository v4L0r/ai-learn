# Test Cases for AI-Learn Frontend Pages

Use this guide to manually verify that **CourseOverview**, **Chapter**, and **Quiz** pages work correctly.

---

## Prerequisites

1. **Node.js** installed (v18+ recommended). Download: https://nodejs.org
2. **npm** comes with Node.js. Check in a **new** terminal:
   - `node -v` (should show e.g. v18.x or v20.x)
   - `npm -v` (should show e.g. 10.x)

> **If `npm` is not recognized:** Restart your terminal/IDE after installing Node.js, or use "Node.js command prompt" from the Start menu.

---

## How to Run the App

```bash
cd client
npm install
npm run dev
```

The app will start at **http://localhost:5173**. Open this URL in your browser.

---

## Test Case 1: Dashboard loads and shows course card

| Step | Action | Expected result |
|------|--------|-----------------|
| 1.1 | Open http://localhost:5173 | App redirects to `/dashboard` |
| 1.2 | Look at the page | You see "My Feeds" heading |
| 1.3 | Look at the course card | You see "Introduction to Machine Learning" and "Education • 35% complete" |

**Pass:** All three checks pass.

---

## Test Case 2: CourseOverview page

| Step | Action | Expected result |
|------|--------|-----------------|
| 2.1 | From Dashboard, click the course card | Navigate to `/courses/course-1` |
| 2.2 | Check header | Back arrow on left, "EDUCATION" label, "Introduction to Machine Learning" title |
| 2.3 | Check progress bar | Green bar at 35%, "35%" on the right |
| 2.4 | Check Goals section | End goal, Daily goal, Monthly goal are visible |
| 2.5 | Check hashtags | #MachineLearning, #AI, #Python pills visible |
| 2.6 | Check chapter list | 5 chapters listed with checkmarks (✓) for ch 1–2, numbers for ch 3–5 |
| 2.7 | Click Back arrow | Return to previous page (Dashboard) |

**Pass:** All checks pass.

---

## Test Case 3: Chapter page (video view)

| Step | Action | Expected result |
|------|--------|-----------------|
| 3.1 | From CourseOverview, click any chapter (e.g. "Linear Regression Basics") | Navigate to `/courses/course-1/chapters/ch-3` |
| 3.2 | Check video area | Vertical placeholder with play icon and "Video placeholder" text |
| 3.3 | Check Like button | Heart icon on right, shows "1247" (or 1248 after click) |
| 3.4 | Click Like | Heart fills, count increases by 1 |
| 3.5 | Click Save | Bookmark icon fills |
| 3.6 | Check caption | Title "Linear Regression Basics" and text with green clickable links (Loss function, Overfitting, etc.) |
| 3.7 | Click "Daily Check-in" button | Navigate to Quiz page |

**Pass:** All checks pass.

---

## Test Case 4: Quiz page – MCQ

| Step | Action | Expected result |
|------|--------|-----------------|
| 4.1 | From Chapter, click "Daily Check-in" | Navigate to `/courses/course-1/chapters/ch-3/quiz` |
| 4.2 | Check header | "1 / 3" and progress bar at ~33% |
| 4.3 | Check question | "What does linear regression predict?" with 4 options |
| 4.4 | Try clicking Next without selecting | Button is disabled |
| 4.5 | Click "Continuous values" | Option highlights with green border |
| 4.6 | Click Next | Go to question 2 |

**Pass:** All checks pass.

---

## Test Case 5: Quiz page – Fill-in-blank

| Step | Action | Expected result |
|------|--------|-----------------|
| 5.1 | On question 2 | "The _____ function measures how wrong our predictions are." |
| 5.2 | Try Next with empty input | Button disabled |
| 5.3 | Type "loss" in the input | Input shows "loss" |
| 5.4 | Click Next | Go to question 3 |

**Pass:** All checks pass.

---

## Test Case 6: Quiz page – Short answer and completion

| Step | Action | Expected result |
|------|--------|-----------------|
| 6.1 | On question 3 | "Name one technique to prevent overfitting in linear regression." |
| 6.2 | Type "regularization" | Input shows text |
| 6.3 | Click Submit | Completion screen appears |
| 6.4 | Check completion screen | "Check-in complete!", "You got 2 out of 3 correct" (dummy score) |
| 6.5 | Click "Back to course" | Navigate to `/courses/course-1` |

**Pass:** All checks pass.

---

## Test Case 7: Direct URL access

| Step | Action | Expected result |
|------|--------|-----------------|
| 7.1 | Open http://localhost:5173/courses/course-1 | CourseOverview loads |
| 7.2 | Open http://localhost:5173/courses/course-1/chapters/ch-1 | Chapter loads (ch-1) |
| 7.3 | Open http://localhost:5173/courses/course-1/chapters/ch-3/quiz | Quiz loads |

**Pass:** All three URLs load without errors.

---

## Test Case 8: Navigation flow

| Step | Action | Expected result |
|------|--------|-----------------|
| 8.1 | Start at Dashboard | — |
| 8.2 | Course → Chapter → Quiz → Back to course | Full flow works |
| 8.3 | Use browser Back button from Quiz | Return to Chapter |
| 8.4 | Use browser Back from Chapter | Return to CourseOverview |

**Pass:** Navigation works in both directions.

---

## Quick Checklist

- [ ] `npm install` completes without errors
- [ ] `npm run dev` starts and shows local URL
- [ ] Dashboard loads
- [ ] CourseOverview loads with progress, goals, chapters
- [ ] Chapter loads with video placeholder, Like/Save, caption
- [ ] Quiz loads with all 3 question types
- [ ] Quiz completion screen shows
- [ ] Back navigation works

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `npm` not found | Install Node.js from https://nodejs.org |
| Port 5173 in use | Vite will suggest another port (e.g. 5174) |
| Blank white page | Check browser console (F12) for errors |
| Styles not applied | Ensure `tailwind.config.js` has `content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}']` |
| "Cannot find module 'react-router-dom'" | Run `npm install` in the `client` folder |
