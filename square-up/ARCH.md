# Square Up — Architecture

## Directory Structure

```
square-up/
├── public/
├── src/
│   ├── main.tsx
│   ├── App.tsx                        # Root: context provider + tab routing
│   ├── index.css
│   │
│   ├── types/
│   │   ├── models.ts                  # Core domain types: Member, Expense, Settlement, Participant
│   │   ├── state.ts                   # AppState, Action (reducer union type)
│   │   └── api.ts                     # API action signatures (shared between local + future fetch layer)
│   │
│   ├── context/
│   │   ├── AppContext.tsx             # React context definition + provider
│   │   └── reducer.ts                 # All state mutations (members, expenses, settlements)
│   │
│   ├── api/
│   │   └── index.ts                   # Abstraction layer — wraps dispatch today, fetch later
│   │
│   ├── utils/
│   │   ├── splits.ts                  # Split calculation logic (equal, fixed amount, percent)
│   │   ├── balances.ts                # Per-person net balance computation
│   │   ├── settlements.ts             # Simplified debt graph algorithm (min transactions)
│   │   └── format.ts                  # Currency + date formatting helpers
│   │
│   ├── hooks/
│   │   └── useAppState.ts             # Consumes AppContext; exposes state + api actions
│   │
│   ├── components/
│   │   │
│   │   ├── layout/
│   │   │   ├── AppShell.tsx           # Outer layout wrapper (max-width, padding)
│   │   │   ├── Header.tsx             # App title + member management trigger
│   │   │   └── TabNav.tsx             # Tab bar: Expenses / Balances / Settle Up
│   │   │
│   │   ├── members/
│   │   │   ├── MemberPanel.tsx        # Slide-out or modal panel containing member management
│   │   │   ├── MemberList.tsx         # List of current members
│   │   │   ├── MemberItem.tsx         # Single member row with remove action
│   │   │   └── AddMemberForm.tsx      # Name input + add button
│   │   │
│   │   ├── expenses/
│   │   │   ├── ExpenseList.tsx        # Chronological list of expense cards
│   │   │   ├── ExpenseItem.tsx        # Single expense card (description, payer, shares, actions)
│   │   │   ├── ExpenseForm.tsx        # Add/edit form orchestrator (manages form state)
│   │   │   ├── ParticipantSelector.tsx # Checkbox list to pick expense participants
│   │   │   ├── SplitTypeSelector.tsx  # Toggle: Equal / Fixed Amounts / Percentages
│   │   │   ├── EqualSplit.tsx         # Read-only preview of equal split per participant
│   │   │   ├── AmountSplit.tsx        # Per-participant dollar amount inputs
│   │   │   └── PercentSplit.tsx       # Per-participant percentage inputs with live validation
│   │   │
│   │   ├── balances/
│   │   │   ├── BalanceList.tsx        # List of all member balance rows
│   │   │   └── BalanceItem.tsx        # Single member: paid, owed, net balance
│   │   │
│   │   ├── settlements/
│   │   │   ├── SettleUpList.tsx       # Active suggested payment transactions
│   │   │   ├── SettleUpItem.tsx       # Single payment suggestion + "Mark as Settled" button
│   │   │   ├── SettledHistory.tsx     # Collapsible section of past settled transactions
│   │   │   └── SettledHistoryItem.tsx # Single settled transaction row (muted, strikethrough)
│   │   │
│   │   └── ui/
│   │       ├── Button.tsx             # Reusable button (variants: primary, secondary, danger, ghost)
│   │       ├── Input.tsx              # Reusable text/number input with label + error state
│   │       ├── Modal.tsx              # Generic modal wrapper with backdrop + close
│   │       ├── Badge.tsx              # Small label chip (e.g., split type, payer tag)
│   │       └── EmptyState.tsx         # Placeholder for empty lists with a message
│   │
│   └── pages/
│       ├── ExpensesPage.tsx           # Composes: ExpenseList + add button + ExpenseForm in Modal
│       ├── BalancesPage.tsx           # Composes: BalanceList
│       └── SettleUpPage.tsx           # Composes: SettleUpList + SettledHistory
```

---

## State Shape

Managed by `useReducer` in `AppContext`. Persisted to `localStorage` under key `squareup_state`.

```ts
{
  members: Member[]
  expenses: Expense[]
  settlements: Settlement[]
}
```

See `SPEC.md` for full entity schemas.

---

## Data Flow

```
User interaction
  → Component calls action via useAppState()
    → api/index.js wraps and dispatches action
      → reducer.js mutates state
        → AppContext re-renders subscribers
          → localStorage syncs on every state change
```

---

## Types

All shared types live in `src/types/` and are imported wherever needed. No inline type definitions in component or utility files.

| File | Contents |
|---|---|
| `types/models.ts` | `Member`, `Expense`, `Participant`, `Settlement`, `SplitType` |
| `types/state.ts` | `AppState`, `Action` (discriminated union for the reducer) |
| `types/api.ts` | Function signatures for all API actions (used by both `api/index.ts` and future fetch layer) |

---

## Key Layers

### `api/index.ts`
The single point of contact for all data operations. Components never call `dispatch` directly.
Currently wraps dispatch; later will wrap `fetch` calls to the Fastify API.

```ts
import type { Dispatch } from 'react'
import type { Action } from '../types/state'
import type { ApiActions } from '../types/api'

export const createApi = (dispatch: Dispatch<Action>): ApiActions => ({
  addExpense: (expense) => dispatch({ type: 'ADD_EXPENSE', payload: expense }),
  // ...
})
```

### `utils/splits.ts`
Pure functions — no side effects. All types imported from `types/models.ts`.
- `calculateEqualSplit(amount: number, participantCount: number): number`
- `validateAmountSplit(participants: Participant[], total: number): { valid: boolean; error?: string }`
- `validatePercentSplit(participants: Participant[]): { valid: boolean; error?: string }`
- `normalizeToShares(expense: Expense): Participant[]` → always returns dollar shares

### `utils/balances.ts`
- `computeBalances(members: Member[], expenses: Expense[], settlements: Settlement[]): Balance[]`

### `utils/settlements.ts`
- `computeSimplifiedDebts(balances: Balance[]): DebtSuggestion[]`
  Uses a greedy min-transaction algorithm (sort creditors/debtors, match largest first).

### `hooks/useAppState.ts`
Single hook consumed by all components. Return type defined in `types/api.ts`.
```ts
const { members, expenses, settlements, addMember, removeMember,
        addExpense, editExpense, deleteExpense, markSettled } = useAppState()
```

---

## Routing

No router library — tab state is a single `activeTab` value in `App.jsx` (`'expenses' | 'balances' | 'settle'`). Pages are conditionally rendered.

---

## Styling Conventions

- Tailwind utility classes only — no custom CSS except `index.css` for base resets
- Accent color: `#4a7c59` (defined as a Tailwind custom color `green-matte`)
- Neutral palette: `zinc` (backgrounds, borders, muted text)
- All interactive elements have hover + focus-visible states
