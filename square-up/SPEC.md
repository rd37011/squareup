# Square Up — Expense Splitter Spec

## Overview

A single-group expense splitter built with React + Vite, TypeScript, and Tailwind CSS. State is managed locally (React context + useReducer) with localStorage persistence. The state shape and abstraction layer are designed for straightforward migration to a Node/Fastify backend with a database.

---

## Stack

- **Frontend:** React (Vite) + TypeScript, Tailwind CSS
- **State:** React context + useReducer, persisted to localStorage
- **Future backend:** Node.js + Fastify (REST API)
- **Currency:** USD, always displayed to 2 decimal places

---

## Data Model

All entities carry `id` (UUID) and `createdAt` (ISO timestamp) to mirror what a REST API would return.

### Member
```ts
{
  id: string
  name: string
  createdAt: string
}
```

### Expense
```ts
{
  id: string
  description: string
  amount: number          // total amount in dollars
  payerId: string         // member who paid
  date: string            // ISO date string
  splitType: 'equal' | 'amount' | 'percent'
  participants: [
    {
      memberId: string
      share: number       // dollar amount owed for this expense
    }
  ]
  createdAt: string
}
```

### Settlement
```ts
{
  id: string
  fromId: string          // member who owes
  toId: string            // member who is owed
  amount: number
  settledAt: string       // ISO timestamp
  createdAt: string
}
```

---

## Features

### People Management
- Add members by name (no auth)
- Remove members (with confirmation if they have associated expenses)
- Session is scoped to a single group

### Expenses
- Add an expense with: description, total amount, payer, date, participants, split type
- **Split types:**
  - **Equal** — amount divided evenly among selected participants
  - **Fixed amounts** — enter a dollar amount per participant (must sum to total)
  - **Percentages** — enter a percentage per participant (must sum to 100%)
- Participants default to all members; can be customized per expense
- Edit and delete existing expenses

### Views / Tabs

#### 1. Expenses
- Chronological list of all expenses
- Each entry shows: description, date, payer, total amount, participants and their shares
- Edit and delete actions per expense

#### 2. Balances
- Per-person summary: total paid, total owed, net balance
- Positive balance = owed money; negative = owes money

#### 3. Settle Up
- Simplified debt graph showing the minimum number of transactions needed to settle all debts
- Each suggested transaction: "Person A pays Person B $X"
- "Mark as Settled" button per transaction
- Settled transactions are displayed with a strikethrough / muted style and excluded from the active debt graph
- Settled transactions are logged and viewable in a collapsible history section

---

## Design

- Minimal, clean aesthetic
- Matte green accent color: `#4a7c59`
- Light neutral backgrounds, dark text
- Tailwind utility classes throughout
- Responsive layout (mobile-friendly)

---

## Persistence

- All state (members, expenses, settlements) is persisted to `localStorage`
- State is rehydrated on page load
- Key: `squareup_state`

---

## Future Backend Migration

The following patterns are used to make migration straightforward:

- All state mutations go through a single `api.js` abstraction layer (currently wraps dispatch calls, later wraps fetch calls)
- Entity shapes match REST response payloads (IDs, timestamps on all records)
- No business logic in components — all calculations in pure utility functions
