# Vibe-Check

> A daily personality tracking app that helps you check in with your vibe — little by little, day by day.

---

## What is Vibe-Check?

Vibe-Check is a fullstack web app designed to help you track your personality traits over time through daily, bite-sized questions. Inspired by the MBTI personality model, this app lets you answer 3 simple questions every day, helping you see how your vibe evolves over weeks and months.

Unlike traditional quizzes that try to capture your personality in one sitting, Vibe-Check embraces the long game — building a deeper understanding of you with consistent, manageable check-ins. Plus, with charts and streaks planned down the line, it’s as fun as it is insightful.

---

## Features

### Core Experience
- ✅ **Daily personality check-in**
  - 3 fixed questions per day (pulled from a DB-stored question set)
  - Answers limited to a simplified scale (e.g., Agree / Neutral / Disagree)
  - Questions follow MBTI personality model dimensions

- ✅ **Answer persistence and enforcement**
  - Strict daily limit (no backlog or catch-up)
  - Responses saved per user per day

- ✅ **Authentication**
  - Handled via `better-auth`

- ✅ **Beautiful, accessible UI**
  - Built using `shadcn-ui`

### Visualization & Insights
- 📊 **Personality evolution charts**
  - Track progression for each MBTI axis (E/I, S/N, T/F, J/P)
  - Compare current status vs. historical baseline

- 📈 **Summary & analysis views**
  - Current personality “diagnosis”
  - Distribution of answer types over time

- 🔍 **Future Ideas for Insight Features**
  - Compare with aggregated anonymous data
  - Show “personality volatility” or stability metrics

### Gamification (Post-MVP)
- 🔥 **Streak tracking**
  - Daily streak UI
  - Optional reminder notifications
  - Rewards or badges (TBD)

- 🧠 **Milestones**
  - “100 questions answered!”
  - Long-term reflection reports

### Developer Experience
- ✅ **Written with TDD using Vitest**
  - Emphasis on test-first development for both UI and logic
  - Maintainable, predictable codebase

- 🛠 **Observability**
  - Integrate `Sentry` for error monitoring
  - Use `PostHog` for product analytics and usage insights

---

## Tech Stack

- **App Framework:** TanStack Start (meta-framework)
- **ORM:** Drizzle (PostgreSQL)
- **Auth:** better-auth
- **UI Components:** shadcn-ui
- **Testing:** Vitest
- **Monitoring:** Sentry (planned)
- **Analytics:** PostHog (planned)

---

## Getting Started

1. Clone the repo
2. Install dependencies
   ```bash
   npm install
