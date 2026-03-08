# Square Up — Build Workstreams

## Already Complete

- `src/types/` — models.ts, state.ts, api.ts
- `src/context/` — AppContext.tsx, reducer.ts (with localStorage persistence)
- `src/api/index.ts` — createApi dispatch wrapper
- `src/utils/` — format.ts, splits.ts, balances.ts, settlements.ts
- `src/hooks/useAppState.ts`
- `src/components/ui/` — Button, Input, Modal, Badge, EmptyState
- `src/components/layout/` — AppShell, Header, TabNav
- `src/components/members/` — MemberPanel, MemberList, MemberItem, AddMemberForm
- `src/components/expenses/` — ParticipantSelector, SplitTypeSelector
- `src/App.tsx` — rewritten with AppContextProvider, AppShell, Header, TabNav, MemberPanel, tab placeholders
- `src/main.tsx` — already correct, do not touch

---

## Workstream A — Expense Components + Page

**Independent. No dependency on WS-B or WS-C.**

### Interval 1: Split sub-components

- [ ] `src/components/expenses/EqualSplit.tsx`
  - Read-only preview. Shows each selected participant's name and their equal share.
  - Props: `participants: Participant[]`, `members: Member[]`, `shareAmount: number`
  - No inputs — purely display.

- [ ] `src/components/expenses/AmountSplit.tsx`
  - Per-participant number inputs for fixed dollar amounts.
  - Shows running sum vs. expense total. Highlights mismatch in red.
  - Props: `members: Member[]`, `participantIds: string[]`, `values: Record<string, number>`, `onChange: (memberId: string, value: number) => void`, `total: number`

- [ ] `src/components/expenses/PercentSplit.tsx`
  - Per-participant number inputs for percentage allocation (0–100).
  - Shows running total percentage. Highlights in red if not 100%.
  - Props: `members: Member[]`, `participantIds: string[]`, `values: Record<string, number>`, `onChange: (memberId: string, value: number) => void`
  - **Note:** `share` here is raw percentage (e.g. 50 = 50%). `ExpenseForm` is responsible for converting to dollar amounts before persisting the `Participant[]`.

### Interval 2: Expense list

- [ ] `src/components/expenses/ExpenseItem.tsx`
  - Card showing: description, formatted date, payer name, total amount (formatCurrency), split type Badge.
  - Below: list of participants with their dollar share (formatCurrency).
  - Edit and Delete buttons (variant="ghost" size="sm").
  - Props: `expense: Expense`, `members: Member[]`, `onEdit: () => void`, `onDelete: () => void`

- [ ] `src/components/expenses/ExpenseList.tsx`
  - Renders expenses sorted newest-first as ExpenseItem cards.
  - Shows `<EmptyState message="No expenses yet. Add one to get started!" />` when empty.
  - Props: `expenses: Expense[]`, `members: Member[]`, `onEdit: (id: string) => void`, `onDelete: (id: string) => void`

### Interval 3: Expense form

- [ ] `src/components/expenses/ExpenseForm.tsx`
  - Add/edit form. Fields: description (text), amount (number), payer (select from members), date (date input, defaults to today), participants (ParticipantSelector), split type (SplitTypeSelector).
  - Renders the appropriate split sub-component based on `splitType`:
    - `equal` → EqualSplit (preview only)
    - `amount` → AmountSplit (editable inputs)
    - `percent` → PercentSplit (editable inputs, convert to dollars on submit)
  - On submit: validates split totals, builds `Expense` object with `crypto.randomUUID()` and `new Date().toISOString()` timestamps, calls `onSave`.
  - If `initialExpense` is provided, pre-fills all fields (edit mode).
  - Props: `initialExpense?: Expense`, `members: Member[]`, `onSave: (expense: Expense) => void`, `onCancel: () => void`

### Interval 4: Page assembly

- [ ] `src/pages/ExpensesPage.tsx`
  - Zero-props component (reads from `useAppState()`).
  - Renders: "Add Expense" Button, ExpenseList.
  - Holds local state: `editingExpense: Expense | null`, `showForm: boolean`.
  - "Add Expense" opens a Modal containing ExpenseForm.
  - Edit button on ExpenseItem opens same Modal pre-filled with that expense.
  - onSave: calls `api.addExpense` or `api.editExpense` then closes modal.
  - onDelete: calls `api.deleteExpense`.

---

## Workstream B — Balance Components + Page

**Independent. No dependency on WS-A or WS-C. Simplest workstream.**

### Interval 1: Balance components

- [ ] `src/components/balances/BalanceItem.tsx`
  - Single member row: name, "Paid: $X", "Owed: $X", net label.
  - Net > 0: green text "gets back $X". Net < 0: red text "owes $X". Net = 0: muted "settled".
  - Props: `balance: Balance`, `member: Member`

- [ ] `src/components/balances/BalanceList.tsx`
  - List of BalanceItem rows.
  - Shows `<EmptyState message="Add members and expenses to see balances." />` when `balances` is empty.
  - Props: `balances: Balance[]`, `members: Member[]`

### Interval 2: Page assembly

- [ ] `src/pages/BalancesPage.tsx`
  - Zero-props component.
  - Calls `computeBalances(members, expenses, settlements)` from `../utils/balances`.
  - Renders `<BalanceList balances={...} members={members} />`.

---

## Workstream C — Settlement Components + Page

**Independent. No dependency on WS-A or WS-B.**

### Interval 1: Settlement components

- [ ] `src/components/settlements/SettledHistoryItem.tsx`
  - Single row: "{fromName} paid {toName} {formatCurrency(amount)}" + formatted date.
  - Muted zinc style (text-zinc-500), no action buttons.
  - Props: `settlement: Settlement`, `members: Member[]`

- [ ] `src/components/settlements/SettledHistory.tsx`
  - Collapsible section titled "Settled Transactions".
  - Toggle show/hide with a ghost button. Default: collapsed.
  - Renders list of SettledHistoryItem when expanded.
  - Returns null if `settlements` is empty.
  - Props: `settlements: Settlement[]`, `members: Member[]`

- [ ] `src/components/settlements/SettleUpItem.tsx`
  - Single suggestion row: "{fromName} pays {toName} {formatCurrency(amount)}".
  - "Mark as Settled" Button (variant="primary" size="sm") calls `onSettle`.
  - Props: `suggestion: DebtSuggestion`, `members: Member[]`, `onSettle: () => void`

- [ ] `src/components/settlements/SettleUpList.tsx`
  - List of SettleUpItem rows.
  - Shows `<EmptyState message="All settled up!" />` when `suggestions` is empty.
  - Props: `suggestions: DebtSuggestion[]`, `members: Member[]`, `onSettle: (suggestion: DebtSuggestion) => void`

### Interval 2: Page assembly

- [ ] `src/pages/SettleUpPage.tsx`
  - Zero-props component.
  - Computes: `const balances = computeBalances(members, expenses, settlements)` then `const suggestions = computeSimplifiedDebts(balances, members)`.
  - Note: `computeSimplifiedDebts` takes `(balances, members)` — second arg is `members: Member[]`.
  - Renders: SettleUpList + SettledHistory.
  - "Mark as Settled" handler: creates `Settlement` object with `crypto.randomUUID()`, timestamps, `fromId`, `toId`, `amount` from suggestion, calls `api.markSettled`.

---

## Workstream D — App Root Integration

**Blocked until WS-A, WS-B, and WS-C pages are all complete.**

- [ ] Update `src/App.tsx` — replace placeholder divs with real page components:
  - `'expenses'` → `<ExpensesPage />`
  - `'balances'` → `<BalancesPage />`
  - `'settle'` → `<SettleUpPage />`
  - All three pages are zero-props; no data passed via props.

- [ ] Delete `src/App.css` — Vite boilerplate, not imported by anything after the App.tsx rewrite.

---

## Dependency Graph

```
WS-A (Expenses: 7 components + ExpensesPage) ──┐
                                                 ├──> WS-D (App.tsx wiring)
WS-B (Balances: 2 components + BalancesPage) ───┤
                                                 │
WS-C (Settlements: 4 components + SettleUpPage)─┘
```

WS-A, WS-B, and WS-C are fully independent and can be assigned to separate react-engineer agents simultaneously.

WS-D is a single-file update that depends on all three being done first.

---

## Critical Notes for Engineers

1. **PercentSplit stores percentages, not dollars.** `PercentSplit.share` is a raw percentage (e.g. 50 for 50%). `ExpenseForm` must convert: `share_dollars = (percent / 100) * totalAmount` before building the `Participant[]` array to persist in the `Expense`.

2. **All pages are zero-props.** Pages read state via `useAppState()`. They must not accept any props — this is what allows WS-D to render them with `<ExpensesPage />` etc.

3. **`main.tsx` is correct as-is.** Do not modify it.

4. **`computeSimplifiedDebts` signature:** `(balances: Balance[], members: Member[]) => DebtSuggestion[]` — the second `members` argument is required.

5. **IDs and timestamps:** Always use `crypto.randomUUID()` for IDs, `new Date().toISOString()` for timestamps.

6. **Tailwind theme:** Custom colors `green-matte`, `green-matte-dark`, `green-matte-light` are available as utility classes (e.g. `bg-green-matte`, `text-green-matte`). Neutral palette is zinc family.
