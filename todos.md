# 🧠 Personality Tracker App — Project Outline

A SvelteKit-based full-stack application inspired by personality frameworks like **MBTI** and **16 Personalities**. Unlike traditional one-time tests, this app collects timestamped answers to categorized psychometric questions over time, allowing for a **longitudinal understanding of personality traits**. The goal is to reflect **how users evolve over time** rather than giving them a fixed label.

---

## 📚 Stack & Reference Links (`llms.txt`)

| Tool | Purpose | LLM Reference |
|------|---------|---------------|
| **SvelteKit (latest)** | App framework |
| **Drizzle ORM** | DB access |
| **Lucia Auth (Guide-based)** | Auth implementation | N/A |
| **Tailwind CSS** | Styling |
| **svelte-shadcn-ui** | UI components |
| **Playwright** | E2E Testing |
| **Vitest** | Unit testing |
| **PostgreSQL** | Database |

---

## 📦 Feature Breakdown

### 1. 🔐 Auth

**Objective:** Use Lucia guide-based auth system (already implemented) and add metadata for roles and onboarding state.

#### Tasks:
- [x] Add `role`, `is_onboarded`, and `created_at` columns to the existing `user` table under /src/lib/server/db/schema.ts
- [X] Update registration logic to set default values.
- [x] Restrict access to authenticated pages by checking `locals.user` in load functions and redirecting if not set
- [x] Ensure `role` is used to gate admin-only pages
- [ ] Add Vitest unit tests for registration role/onboarding logic
- [ ] Add Playwright tests for login, register, redirection behavior

---

### 2. ❓ Questions Feature

**Objective:** Enable admins to create and categorize psychometric questions by personality trait.

#### Personality Trait Types:
- The `trait` column should be an `enum` with values:
  - `I` (Introversion), `E` (Extraversion)
  - `N` (Intuition), `S` (Sensing)
  - `T` (Thinking), `F` (Feeling)
  - `J` (Judging), `P` (Perceiving)

This aligns with MBTI/16Personalities frameworks and allows deeper insight over time.

#### Database Outline:
- `questions`
  - `id`, `text`, `trait` (enum), `created_at`, `updated_at`

#### Tasks:
- [ ] Create `questions` table
- [ ] Build admin interface under `/(auth)/(admin)/questions`:
  - Add new questions
  - View all questions
  - Edit question text or trait
- [ ] Build basic frontend to render demo questions: `/app/questions/demo`
- [ ] Add Vitest tests for question logic
- [ ] Add Playwright tests for admin interface
- [ ] Include a TypeScript seed script: `scripts/seed.ts`

---

### 3. 🧾 Answers Feature

**Objective:** Users answer 3 randomized questions daily. Answers are stored with timestamps and submitted as a group.

#### Database Outline:
- `answers`
  - `id`, `user_id`, `question_id`, `value` (1–7 scale), `created_at`, `submitted_at`, `is_submitted`

#### Rules:
- Users can change answers up until submitting for that day
- Each answer group must be finalized with a submit button
- New set of questions shown each day

#### Tasks:
- [ ] Create `answers` table
- [ ] Build answer flow in `/app/answer`:
  - One question per page
  - Save progress without submitting
  - Submit all three at once
- [ ] Prevent re-answering once submitted for that day
- [ ] Allow editing if answers are unsubmitted
- [ ] Add Vitest tests for answer logic
- [ ] Add Playwright tests for answer UX

---

### 4. 🚀 Onboarding Flow

**Objective:** Collect 10 questions from new users and explain how the app works.

#### Tasks:
- [ ] Show onboarding flow if `user.is_onboarded === false`
- [ ] Routes: `/(auth)/(no-onboard)/onboarding`
  - Pages: welcome → explanation → 10-question flow
- [ ] Use 10 randomly pulled questions (no need for onboarding tagging)
- [ ] On submit: update `user.is_onboarded = true`
- [ ] Add Vitest tests for onboarding flag
- [ ] Add Playwright tests for onboarding UX

---

### 5. 🌐 Public Pages

**Objective:** Create public marketing-style pages explaining the product's philosophy.

#### Tasks:
- [ ] Pages:
  - `/` → Home (value proposition)
  - `/about` → Motivation & background
  - `/features` → Feature set
  - `/methodology` → Explanation of longitudinal data vs snapshot tests
- [ ] Navigation + link to login/register
- [ ] Add Playwright tests for navigation + accessibility

---

### 6. ⚙️ Admin Interface

**Objective:** MVP scope includes only managing questions.

#### Tasks:
- [ ] All admin pages gated by `user.role === 'admin'`
- [ ] Build simple UI under `/(auth)/(admin)` for:
  - Viewing all questions
  - Creating/editing questions
- [ ] Post-MVP (not included):
  - Viewing user stats
  - Assigning custom questions to users

---

## 🗂️ Route Structure

```txt
src/routes
├── /(auth)/
│   ├── app/                → User dashboard & flows
│   ├── (admin)/questions/  → Admin-only question manager
│   ├── (no-onboard)/       → Onboarding flow
├── /(no-auth)/             → Login, signup
├── /                       → Public pages
