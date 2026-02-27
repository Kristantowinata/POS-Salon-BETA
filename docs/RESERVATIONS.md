# Reservations Page — Developer Documentation

> **File utama:** `src/pages/Reservations.tsx` (~850 baris)  
> **Terakhir diupdate:** 2026-02-27

---

## Daftar Isi

1. [Overview & Arsitektur](#1-overview--arsitektur)
2. [Dependency Map](#2-dependency-map)
3. [Data Flow & State Management](#3-data-flow--state-management)
4. [Fitur 1: Quick Walk-in Form (Multi-Service)](#4-fitur-1-quick-walk-in-form)
5. [Fitur 2: Upcoming Appointments List (Card Truncation + Accordion)](#5-fitur-2-upcoming-appointments-list)
6. [Fitur 3: Search & Date Filter](#6-fitur-3-search--date-filter)
7. [Fitur 4: Check-in](#7-fitur-4-check-in)
8. [Fitur 5: Checkout Sync](#8-fitur-5-checkout-sync)
9. [Fitur 6: Edit Reservation Modal](#9-fitur-6-edit-reservation-modal)
10. [Fitur 7: Cancel & Void Flow](#10-fitur-7-cancel--void-flow)
11. [Fitur 8: Quick-Swap Stylist (Inline Popover)](#11-fitur-8-quick-swap-stylist)
12. [Fitur 9: Stylist Overlap Warning](#12-fitur-9-stylist-overlap-warning)
13. [Fitur 10: Guest Mapping (Anonymous Walk-ins)](#13-fitur-10-guest-mapping)
14. [Fitur 11: Statistics Dashboard](#14-fitur-11-statistics-dashboard)
15. [Fitur 12: Queue Load Indicator](#15-fitur-12-queue-load-indicator)
16. [Responsive Design (Mobile Sticky Footer)](#16-responsive-design)
17. [API Endpoints](#17-api-endpoints)
18. [Database Tables & Indexes](#18-database-tables--indexes)
19. [Troubleshooting](#19-troubleshooting)

---

## 1. Overview & Arsitektur

Halaman Reservations adalah pusat operasional salon yang menangani **lifecycle lengkap customer** dari saat datang (walk-in) sampai siap bayar (checkout). Layout **dua kolom**:

```
┌─────────────────────────────────┬──────────────────────┐
│  Main Content Area              │  Right Sidebar       │
│  ┌───────────────────────────┐  │  ┌────────────────┐  │
│  │ Header + Search + Tabs   │  │  │ Quick Walk-in  │  │
│  ├───────────────────────────┤  │  │ Form (🟢/🔴)  │  │
│  │ Stats Overview (4 cards) │  │  │ Multi-service  │  │
│  ├───────────────────────────┤  │  ├────────────────┤  │
│  │ Appointment Cards        │  │  │ Queue Load     │  │
│  │  • Truncated services    │  │  │ Indicator      │  │
│  │  • Quick-swap stylist    │  │  └────────────────┘  │
│  │  • ⋮ Overflow menu       │  │                      │
│  └───────────────────────────┘  │                      │
└─────────────────────────────────┴──────────────────────┘
```

**Di mobile:** Sidebar tersembunyi. **FAB** di kanan bawah → bottom sheet overlay dengan **sticky submit** button.

---

## 2. Dependency Map

### Frontend

| File | Peran |
|------|-------|
| `src/pages/Reservations.tsx` | Komponen halaman utama (~850 baris) |
| `src/hooks/useReservations.ts` | React Query hooks (7 hooks) |
| `src/services/reservation.client.ts` | API client (7 endpoints) |
| `src/lib/types.ts` | `Reservation`, `ReservationStatus`, `ReservationType` |
| `src/hooks/useServices.ts` | Daftar layanan untuk dropdown |
| `src/hooks/useStylists.ts` | Daftar stylist untuk dropdown |

### Backend

| File | Peran |
|------|-------|
| `backend/app/api/v1/reservations/route.ts` | `GET` list, `POST` create/walk-in |
| `backend/app/api/v1/reservations/[id]/route.ts` | `GET` detail, `PATCH` update/void |
| `backend/app/api/v1/reservations/[id]/check-in/route.ts` | `POST` check-in |
| `backend/app/lib/services/reservation.service.ts` | Business logic |
| `backend/app/lib/validators/reservation.schema.ts` | Zod schemas |
| `backend/supabase/migrations/007_guest_name_trigram.sql` | `guest_name` col + `pg_trgm` index |

---

## 3. Data Flow & State Management

### Local State

| State | Type | Kegunaan |
|-------|------|----------|
| `dateTab` | `'today'│'tomorrow'│'week'` | Tab filter tanggal |
| `searchQuery` / `activeSearch` | `string` | Input vs committed search |
| `walkinForm` | `{ name, phone }` | Data customer walk-in |
| `serviceRows` | `ServiceRow[]` | Dynamic service basket |
| `showWalkinMobile` | `boolean` | Mobile bottom sheet toggle |
| `editingReservation` | `Reservation│null` | Edit modal target |
| `cancellingId` | `string│null` | Cancel confirmation target |
| `voidingId` / `voidReason` | `string│null` / `string` | **Void flow** target + reason |
| `expandedCards` | `Set<string>` | **Card truncation** — which cards are expanded |
| `swapTarget` | `{ reservationId, version }│null` | **Quick-swap** popover target |
| `overflowMenuId` | `string│null` | **Three-dot** overflow menu target |

### Derived State (useMemo)

| Computed | Logic |
|----------|-------|
| `stats` | Counts of total, checked_in, pending, walk_ins |
| `stylistBusyCount` | `Record<stylistId, count>` — count `checked_in` per stylist |

---

## 4. Fitur 1: Quick Walk-in Form

**Lokasi:** Right sidebar (desktop) / Bottom sheet with **sticky footer** (mobile)

### Service Basket (Dynamic Rows)

Setiap row: `[Service ▼] — [Stylist 🟢/🔴 ▼] — [✕]`

**Stylist dropdown** menampilkan availability:
```
🟢 Dina Pratiwi (Senior)
🔴 Michael Wijaya (Junior) — Serving 2
```

Jika stylist busy dipilih → soft confirm: *"Stylist ini sedang melayani N pelanggan lain. Tetap lanjutkan?"*

### Backend Processing

```
1. Jika phone ada → upsert customer (by phone)
2. Jika phone kosong → customer_id = NULL, simpan guest_name
3. Extract service_ids dari service_items
4. Create reservation (walk_in, confirmed)
5. Store guest_name jika anonymous
6. Auto check-in
```

---

## 5. Fitur 2: Upcoming Appointments List

### Card Truncation (Max 2 Services)

```
Collapsed (default):  ✂ Haircut, Coloring  [+3 more]
Expanded (on click):  ✂ Haircut, Coloring, Creambath, Hair Spa, Treatment
                      (each as a badge in flex-wrap grid)
```

- State: `expandedCards: Set<string>` — toggle via `toggleCardExpand(id)`
- Badge `+N more` menggunakan warna primary
- Expanded view menggunakan `animate-scale-in` animation

### Action Buttons (Status-dependent)

| Status | Buttons |
|--------|---------|
| `pending` / `confirmed` | **Check-in** (green), ✏️ Edit, 🚫 Cancel |
| `checked_in` | **Checkout** (violet), **⋮ Overflow** (Edit + Void) |

### Three-dot Overflow Menu (⋮)

Hanya muncul untuk `checked_in` cards. Menu items:
- **Edit Reservation** → buka edit modal
- **Void Transaction** → buka void confirmation modal

### Clickable Stylist Name

Nama stylist pada card ditampilkan sebagai **underline dotted + swap_horiz icon**. Klik → buka quick-swap popover (lihat Fitur 8).

---

## 6. Fitur 3: Search & Date Filter

### Search Bar (Enter-key trigger only)

```
User ketik → searchQuery (local) → Enter → activeSearch → API refetch
```

**Backend uses pg_trgm GIN index** via migration `007_guest_name_trigram.sql` untuk fast `ilike` search on `customers.name`.

---

## 7. Fitur 4: Check-in

`POST /reservations/:id/check-in` → status = `checked_in`, set `checked_in_at = now()`

---

## 8. Fitur 5: Checkout Sync

Tombol "Checkout" pada `checked_in` cards → navigasi ke `/checkout?reservationId={id}`.

Checkout page auto-populates: cart (services), customer (locked), dan passes `reservation_id` ke backend.

---

## 9. Fitur 6: Edit Reservation Modal

Modal full-screen overlay. Fields: Assign Stylist (dropdown), Notes (textarea). Uses optimistic locking (`version` check).

---

## 10. Fitur 7: Cancel & Void Flow

### Cancel (Pre check-in)

Tombol 🚫 pada cards `pending`/`confirmed` → confirmation modal → `PATCH status='cancelled'`

### Void (Post check-in) — NEW

⋮ Menu → "Void Transaction" → modal with:
- Icon: `remove_shopping_cart`
- Warning text
- **Reason textarea** (optional)
- Confirm button

```typescript
// Audit trail in notes field:
notes = `VOID: ${reason || 'No reason given'} | ${timestamp}`
```

API: `PATCH /reservations/:id` → `{ status: 'cancelled', notes: auditNote, version }`

---

## 11. Fitur 8: Quick-Swap Stylist — NEW

**Trigger:** Klik nama stylist (underlined) pada appointment card  
**UI:** Inline popover di bawah card (bukan modal)

```
┌────────────────────────────────────────────┐
│ Quick-swap stylist:                        │
│ [🟢 Dina (current)] [🔴 Michael] [🟢 Ayu] │
└────────────────────────────────────────────┘
```

**One-click change:** Klik stylist → `PATCH /reservations/:id` di background → toast
- Current stylist: `bg-primary/20`, disabled
- Busy stylists: 🔴 indicator

**Close:** Click outside (via click-away overlay `z-20`)

---

## 12. Fitur 9: Stylist Overlap Warning — NEW

### Computed dari data yang sudah ada (no extra API)

```typescript
stylistBusyCount = useMemo(() => {
    const counts = {};
    reservations.forEach(r => {
        if (r.status === 'checked_in' && r.stylist_id) {
            counts[r.stylist_id] = (counts[r.stylist_id] || 0) + 1;
        }
    });
    return counts;
}, [reservations]);
```

### Tampilan di dropdown

```
🟢 Dina Pratiwi (Senior)            ← available
🔴 Michael Wijaya (Junior) — Serving 2  ← busy
```

### Soft confirm

Saat memilih busy stylist:
```
confirm("Stylist ini sedang melayani 2 pelanggan lain. Tetap lanjutkan?")
```

---

## 13. Fitur 10: Guest Mapping — NEW

### Masalah: Database bloating

Sebelumnya: setiap walk-in tanpa phone → row baru di `customers` → tabel membengkak.

### Solusi: `guest_name` column

```sql
-- Migration 007
ALTER TABLE reservations ADD COLUMN guest_name VARCHAR(255);
```

### Logic

| Phone | customer_id | guest_name | Display |
|-------|-------------|------------|---------|
| Ada | UUID (upserted) | NULL | `reservation.customers.name` |
| Kosong | NULL | "Tanto" | `reservation.guest_name` |

### Frontend display priority

```typescript
const customerName = reservation.guest_name ?? reservation.customers?.name ?? 'Guest';
```

---

## 14. Fitur 11: Statistics Dashboard

4 stat cards computed dari reservations: Total Bookings, Checked In, Pending, Walk-ins.

---

## 15. Fitur 12: Queue Load Indicator

Progress bar di right sidebar: Low (green ≤3) / Medium (orange ≤6) / High (red >6).

---

## 16. Responsive Design

### Mobile Bottom Sheet — Sticky Footer

```
┌─────────────────────────┐
│ ⚡ Quick Walk-in         │ ← shrink-0 header
├─────────────────────────┤
│ [Customer Name]         │
│ [Phone Number]          │ ← overflow-y-auto body
│ [Service 1 ▼] [Stylist] │   max-h-[40vh] for
│ [Service 2 ▼] [Stylist] │   service rows
│ [+ Add Service]         │
├─────────────────────────┤
│ [▶ Start Order]         │ ← sticky bottom (always visible)
└─────────────────────────┘
```

**Key:** Bottom sheet menggunakan `flex flex-col`, content area `flex-1 overflow-y-auto`, submit button tetap visible di bawah.

---

## 17. API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/reservations?date=&search=&page=` | List reservations |
| `GET` | `/reservations/:id` | Get detail (with joins) |
| `POST` | `/reservations` | Create booking or walk-in |
| `PATCH` | `/reservations/:id` | Update / Cancel / **Void** |
| `POST` | `/reservations/:id/check-in` | Check-in |

### Void via PATCH

```json
{
    "status": "cancelled",
    "notes": "VOID: Customer berubah pikiran | 2/27/2026, 4:00:00 PM",
    "version": 3
}
```

---

## 18. Database Tables & Indexes

### `reservations`
```sql
id UUID PRIMARY KEY
customer_id UUID → customers(id)  -- NULL for anonymous
stylist_id UUID → stylists(id)
guest_name VARCHAR(255)           -- NEW: for anonymous walk-ins
type reservation_type
status reservation_status
scheduled_at TIMESTAMPTZ
estimated_duration_min INTEGER
time_range TSTZRANGE
checked_in_at TIMESTAMPTZ
notes TEXT                        -- Also stores VOID audit trail
version INTEGER DEFAULT 1
created_by UUID → users(id)
```

### Indexes (Migration 007)
```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX idx_customers_name_trgm ON customers USING GIN (name gin_trgm_ops);
```

---

## 19. Troubleshooting

### Search mengembalikan "Unknown"
**Solusi:** Backend pre-queries customer IDs via `ilike`, then filters reservations. pg_trgm index accelerates this.

### Walk-in customer duplikat
**Solusi (Updated):** Jika phone kosong → **tidak** membuat customer row. Nama disimpan di `guest_name`. Jika phone ada → upsert by phone.

### Checkout button tidak muncul
**Penyebab:** Hanya muncul pada `status === 'checked_in'`. Check-in dulu.

### Void button tidak muncul
**Penyebab:** Void hanya tersedia via ⋮ overflow menu pada cards `checked_in`. Untuk cards `pending`/`confirmed`, gunakan Cancel biasa.

### Quick-swap gagal — "Reservation was modified"
**Penyebab:** Optimistic lock conflict. Halaman perlu di-refresh karena version mismatch. Data akan auto-invalidate setelah error.
