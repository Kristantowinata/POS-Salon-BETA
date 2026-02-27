# Reservations Page — Developer Documentation

> **File utama:** `src/pages/Reservations.tsx` (750 baris)  
> **Terakhir diupdate:** 2026-02-27

---

## Daftar Isi

1. [Overview & Arsitektur](#1-overview--arsitektur)
2. [Dependency Map (File yang Terlibat)](#2-dependency-map)
3. [Data Flow & State Management](#3-data-flow--state-management)
4. [Fitur 1: Quick Walk-in Form (Multi-Service)](#4-fitur-1-quick-walk-in-form)
5. [Fitur 2: Upcoming Appointments List](#5-fitur-2-upcoming-appointments-list)
6. [Fitur 3: Search & Date Filter](#6-fitur-3-search--date-filter)
7. [Fitur 4: Check-in](#7-fitur-4-check-in)
8. [Fitur 5: Checkout (Reservation → Checkout Sync)](#8-fitur-5-checkout-sync)
9. [Fitur 6: Edit Reservation Modal](#9-fitur-6-edit-reservation-modal)
10. [Fitur 7: Cancel Reservation Modal](#10-fitur-7-cancel-reservation-modal)
11. [Fitur 8: Statistics Dashboard](#11-fitur-8-statistics-dashboard)
12. [Fitur 9: Queue Load Indicator](#12-fitur-9-queue-load-indicator)
13. [Responsive Design (Desktop vs Mobile)](#13-responsive-design)
14. [API Endpoints yang Digunakan](#14-api-endpoints)
15. [Database Tables yang Terlibat](#15-database-tables)
16. [Troubleshooting](#16-troubleshooting)

---

## 1. Overview & Arsitektur

Halaman Reservations adalah pusat operasional salon yang menangani **lifecycle lengkap customer** dari saat datang (walk-in) sampai siap bayar (checkout). Page ini memiliki layout **dua kolom**:

```
┌─────────────────────────────────┬──────────────────────┐
│  Main Content Area              │  Right Sidebar       │
│  ┌───────────────────────────┐  │  ┌────────────────┐  │
│  │ Header + Search + Tabs   │  │  │ Quick Walk-in  │  │
│  ├───────────────────────────┤  │  │ Form           │  │
│  │ Stats Overview (4 cards) │  │  │ (Multi-service)│  │
│  ├───────────────────────────┤  │  │                │  │
│  │ Upcoming Appointments    │  │  │                │  │
│  │ - Card 1 (Check-in/     │  │  ├────────────────┤  │
│  │   Checkout/Edit/Cancel)  │  │  │ Queue Load     │  │
│  │ - Card 2 ...             │  │  │ Indicator      │  │
│  └───────────────────────────┘  │  └────────────────┘  │
└─────────────────────────────────┴──────────────────────┘
```

**Di mobile:** Sidebar disembunyikan. Ada **FAB (Floating Action Button)** di kanan bawah yang membuka walk-in form sebagai bottom sheet overlay.

---

## 2. Dependency Map

### Frontend

| File | Peran |
|------|-------|
| `src/pages/Reservations.tsx` | Komponen halaman utama (750 baris) |
| `src/hooks/useReservations.ts` | React Query hooks: `useReservations`, `useReservation`, `useCreateWalkIn`, `useCheckInReservation`, `useUpdateReservation`, `useCancelReservation` |
| `src/services/reservation.client.ts` | API client: `list`, `getById`, `createWalkIn`, `create`, `update`, `checkIn`, `cancel` |
| `src/lib/types.ts` | Type definitions: `Reservation`, `ReservationStatus`, `ReservationType` |
| `src/lib/query-client.ts` | Query key factories: `queryKeys.reservations.list()`, `.detail()`, `.all` |
| `src/hooks/useServices.ts` | Fetch daftar layanan salon (untuk dropdown walk-in form) |
| `src/hooks/useStylists.ts` | Fetch daftar stylist (untuk dropdown walk-in form) |
| `src/components/ui/Button.tsx` | Reusable button component (`variant`, `size`, `icon`) |
| `src/components/ui/LoadingSpinner.tsx` | Loading state component |
| `src/components/ui/ErrorAlert.tsx` | Error state component with retry button |
| `src/components/ui/EmptyState.tsx` | Empty state component |

### Backend

| File | Peran |
|------|-------|
| `backend/app/api/v1/reservations/route.ts` | `GET /reservations` (list), `POST /reservations` (create/walk-in) |
| `backend/app/api/v1/reservations/[id]/route.ts` | `GET /reservations/:id`, `PATCH /reservations/:id` (edit/cancel) |
| `backend/app/api/v1/reservations/[id]/check-in/route.ts` | `POST /reservations/:id/check-in` |
| `backend/app/lib/services/reservation.service.ts` | Business logic: `list`, `getById`, `create`, `update`, `cancel`, `checkIn`, `walkIn` |
| `backend/app/lib/validators/reservation.schema.ts` | Zod schemas: `createReservationSchema`, `updateReservationSchema`, `walkInSchema` |

### Database

| Table | Peran |
|-------|-------|
| `reservations` | Data reservasi utama (status, waktu, customer, stylist) |
| `reservation_services` | Junction table: service apa saja yang dipilih per reservasi |
| `customers` | Data pelanggan (nama, telepon, avatar) |
| `stylists` | Data stylist (nama, role, availability) |
| `services` | Data layanan (nama, harga, durasi) |

---

## 3. Data Flow & State Management

### Data Fetching (React Query)

```
useServices()          → GET /api/v1/services        → services[]
useStylists()          → GET /api/v1/stylists         → stylists[]
useReservations(params)→ GET /api/v1/reservations     → { items[], total, page, limit }
```

Setiap query di-cache oleh React Query dengan key factory dari `queryKeys`. Setelah mutasi sukses, query terkait di-invalidate otomatis agar data ter-refresh.

### Local State

| State | Type | Kegunaan |
|-------|------|----------|
| `dateTab` | `'today'│'tomorrow'│'week'` | Tab filter tanggal aktif |
| `searchQuery` | `string` | Input search bar (belum di-submit) |
| `activeSearch` | `string` | Search term yang aktif setelah Enter |
| `walkinForm` | `{ name, phone }` | Data customer di walk-in form |
| `serviceRows` | `ServiceRow[]` | Dynamic service basket (multi-row) |
| `showWalkinMobile` | `boolean` | Toggle bottom sheet walk-in di mobile |
| `editingReservation` | `Reservation│null` | Reservation yang sedang di-edit (modal) |
| `editForm` | `{ stylistId, notes }` | Data edit form |
| `cancellingId` | `string│null` | ID reservation yang akan di-cancel (modal) |

### Derived State (useMemo)

```typescript
stats = {
    total:     reservations.length,
    checkedIn: reservations.filter(status === 'checked_in').length,
    pending:   reservations.filter(status === 'pending' || 'confirmed').length,
    walkIns:   reservations.filter(type === 'walk_in').length,
}
```

### Visibility Filter

```typescript
visibleReservations = reservations.filter(
    r => r.status !== 'cancelled' && r.status !== 'completed' && r.status !== 'no_show'
);
```

Hanya menampilkan reservasi yang masih aktif (pending/confirmed/checked_in).

---

## 4. Fitur 1: Quick Walk-in Form

**Lokasi:** Right sidebar (desktop) / Bottom sheet (mobile)  
**Tujuan:** Register customer walk-in + pilih multi-service + assign stylist per service

### Cara Kerja

1. **Customer Info:** Kasir input nama + telepon (opsional)
2. **Service Basket (Dynamic Rows):**
   - Dimulai dengan 1 row kosong
   - Setiap row memiliki: `[Service ▼] — [Stylist ▼] — [✕ Remove]`
   - Tombol `(+) Add Service` menambah row baru
   - Counter `"N selected"` ditampilkan di header
3. **Submit:**
   - Validasi: nama harus diisi, minimal 1 service dipilih
   - Kirim `POST /reservations` dengan `service_items[]` (per-service stylist pairing)
   - Backend: upsert customer (by phone), create reservation, auto check-in
   - Success: toast notification, reset form, refresh list

### State Architecture (ServiceRow)

```typescript
interface ServiceRow {
    id: number;        // Unique key per row (auto-incremented)
    serviceId: string; // UUID service yang dipilih
    stylistId: string; // UUID stylist yang dipilih ('' = any)
}
```

**Fungsi helper:**
- `addServiceRow()` — Append row baru
- `removeServiceRow(id)` — Hapus row (minimal 1 harus ada)
- `updateServiceRow(id, field, value)` — Update field di row tertentu

### API Payload

```json
{
    "customer_name": "John Doe",
    "customer_phone": "+628123456789",
    "service_items": [
        { "service_id": "uuid-1", "stylist_id": "uuid-stylist-a" },
        { "service_id": "uuid-2", "stylist_id": "uuid-stylist-b" },
        { "service_id": "uuid-3" }
    ]
}
```

### Backend Processing (`ReservationService.walkIn()`)

```
1. Upsert customer → by phone lookup, create if not found
2. Extract service_ids[] dari service_items
3. Pick first stylist as reservation-level stylist_id
4. Create reservation (type='walk_in', status='confirmed')
5. Insert ke reservation_services (service links)
6. Auto check-in → update status ke 'checked_in'
7. Return reservation data
```

### Cache Invalidation

Setelah walk-in sukses, query berikut di-invalidate:
- `queryKeys.reservations.all` (refresh daftar appointment)
- `queryKeys.dashboard.all` (refresh dashboard stats)
- `queryKeys.customers.all` (customer baru mungkin dibuat)

---

## 5. Fitur 2: Upcoming Appointments List

**Lokasi:** Main content area
**Tujuan:** Menampilkan semua appointment aktif (sorted by scheduled_at ASC)

### Anatomy Appointment Card

```
┌──────────────────────────────────────────────────────────┐
│ ┌────────┐ ┌──────────────────────────┐  ┌─────────┐   │
│ │ 10:30  │ │ Avatar  John Doe         │  │Confirmed│   │
│ │  AM    │ │    ✂ Haircut + Creambath  │  └─────────┘   │
│ └────────┘ │    👤 Stylist: Dina       │                │
│            │    🏷️ Walk-in             │  [Check-in]    │
│            └──────────────────────────┘  [✏️] [🚫]     │
└──────────────────────────────────────────────────────────┘
```

### Data yang Ditampilkan per Card

| Elemen | Source |
|--------|--------|
| Time (10:30 AM) | `reservation.scheduled_at` → `formatTime()` |
| Customer name | `reservation.customers?.name ?? 'Unknown'` |
| Avatar/Initials | `reservation.customers?.avatar_url` atau `getInitials()` |
| Service names | `reservation.reservation_services?.map(rs => rs.services?.name).join(' + ')` |
| Stylist | `reservation.stylists?.name` |
| Walk-in badge | Conditional: `reservation.type === 'walk_in'` |
| Status badge | `getStatusBadge(reservation.status)` — warna berbeda per status |

### Visual Cues

| Status | Border Kiri | Time Color |
|--------|-------------|------------|
| `pending` / `confirmed` | Violet (`border-l-primary`) | Violet |
| `checked_in` | Blue (`border-l-blue-500`) | Blue |

### Action Buttons (Conditional Logic)

| Kondisi | Button yang Muncul |
|---------|--------------------|
| `status === 'pending'` or `'confirmed'` | **Check-in** (green), Edit, Cancel |
| `status === 'checked_in'` | **Checkout** (primary/violet), Edit |

> **Penting:** Saat `checked_in`, tombol **Cancel** dihilangkan karena customer sudah dilayani. Tombol **Checkout** mengarahkan ke `/checkout?reservationId={id}`.

---

## 6. Fitur 3: Search & Date Filter

### Date Filter Tabs

3 tab: `Today` / `Tomorrow` / `This Week`

```typescript
function getDateRange(tab): string | undefined {
    'today'    → '2026-02-27'              // ISO date string
    'tomorrow' → '2026-02-28'
    'week'     → undefined                 // Backend returns all upcoming
}
```

Tab dipetakan ke query param `date` pada API call `GET /reservations?date=2026-02-27`.

### Search Bar

- **Trigger:** Hanya pada **Enter key press** (bukan on every keystroke)
- **Flow:**
  1. User ketik → disimpan di `searchQuery` (local state)
  2. User tekan Enter → `setActiveSearch(searchQuery)` → trigger refetch
  3. `useReservations({ search: activeSearch })` kirim ke API
- **Clear button (✕):** Reset `searchQuery` dan `activeSearch`
- **Loading indicator:** Spinner muncul saat `reservationsFetching && activeSearch`

### Backend Search Logic

```typescript
// Di ReservationService.list():
// 1. Cari customer IDs yang cocok
const { data: matchingCustomers } = await supabase
    .from('customers')
    .select('id')
    .ilike('name', `%${search}%`);

// 2. Filter reservations by customer IDs
query = query.in('customer_id', customerIds);
```

> **Alasan pattern ini:** Supabase `.ilike()` pada foreign table column (`customers.name`) tidak berfungsi dengan benar — ia mengembalikan semua row dengan nama customer sebagai NULL daripada memfilter. Workaround: pre-query customer IDs dulu, lalu filter.

---

## 7. Fitur 4: Check-in

**Trigger:** Tombol "Check-in" pada card dengan status `pending` atau `confirmed`  
**API:** `POST /reservations/:id/check-in`

### Flow

```
User klik "Check-in"
  → checkInMutation.mutate(reservation.id)
    → POST /api/v1/reservations/:id/check-in
      → Backend: verify status != 'checked_in'
      → Backend: update status='checked_in', set checked_in_at=now()
    → onSuccess: showToast("Customer checked in!")
    → invalidate: reservations.all, dashboard.all
```

### Backend Validation

```typescript
if (reservation.status === 'checked_in') {
    throw new AppError(ErrorCode.RESERVATION_ALREADY_CHECKED_IN, 'Already checked in.');
}
```

---

## 8. Fitur 5: Checkout (Reservation → Checkout Sync)

**Trigger:** Tombol "Checkout" pada card dengan status `checked_in`  
**Navigasi:** `navigate('/checkout?reservationId={reservation.id}')`

### Flow End-to-End

```
Reservations Page                         Checkout Page
┌───────────────┐                        ┌────────────────────┐
│ Card (checked_│  ── klik Checkout ──►  │ Sync Banner        │
│ in status)    │                        │ Cart: pre-loaded   │
│ [Checkout btn]│                        │ Customer: locked   │
└───────────────┘                        │ [Edit cart] [Pay]  │
                                         └────────────────────┘
```

### Apa yang Terjadi di Checkout.tsx

1. **Read URL param:** `useSearchParams().get('reservationId')`
2. **Fetch reservation:** `useReservation(reservationId)` → data termasuk `customers`, `reservation_services`, `stylists`
3. **Auto-populate cart** (via `useEffect`):
   ```typescript
   const cartItems = reservation.reservation_services
       .filter(rs => rs.services)
       .map(rs => ({
           id: rs.services.id,
           name: rs.services.name,
           type: 'service',
           price: rs.services.price,
           quantity: 1,
           duration: rs.services.duration_minutes,
           stylist: reservation.stylist_id,
       }));
   setCart(cartItems);
   ```
4. **Auto-set customer:** `setSelectedCustomer(reservation.customers)` (locked, tidak bisa diganti)
5. **Show sync banner:** "Order synced from reservation — N services pre-loaded"
6. **Cart tetap editable:** Bisa tambah produk, hapus service, atur diskon
7. **Pass reservation_id** saat checkout: `CheckoutInput.reservation_id = reservationId`

### Dua Mode Checkout

| Mode | Trigger | Customer | Cart |
|------|---------|----------|------|
| **From Reservation** | URL punya `?reservationId=xxx` | Auto dari reservation (locked) | Pre-loaded |
| **Direct Walk-in** | Buka `/checkout` dari sidebar | Manual pilih (editable) | Manual |

---

## 9. Fitur 6: Edit Reservation Modal

**Trigger:** Tombol edit (pencil icon ✏️) pada setiap card  
**UI:** Full-screen modal overlay dengan backdrop blur

### Yang Bisa Diedit

| Field | Input Type |
|-------|------------|
| Stylist | Dropdown (semua stylists, includes inactive) |
| Notes | Textarea |

### Flow

```
1. handleEditOpen(reservation) → simpan di editingReservation, populate editForm
2. User ubah data di modal
3. handleEditSave() → updateMutation.mutate({ id, data: { stylist_id, notes, version } })
4. API: PATCH /reservations/:id → body: { stylist_id, notes, version }
5. Backend: optimistic locking check (version must match)
6. onSuccess: toast + close modal + invalidate cache
```

### Optimistic Locking (Risk 7)

Backend mengecek `version` field:
```typescript
.update(updateData)
.eq('id', id)
.eq('version', input.version)  // Must match current version
```

Jika ada conflict (2 kasir edit bersamaan), error: "Reservation was modified. Please refresh and retry."

---

## 10. Fitur 7: Cancel Reservation Modal

**Trigger:** Tombol cancel (block icon 🚫) pada card dengan status bukan `checked_in`  
**UI:** Centered confirmation dialog

### Flow

```
1. setCancellingId(reservation.id) → buka modal
2. User klik "Yes, Cancel" → handleCancelConfirm()
3. cancelMutation.mutate({ id, version: reservation.version })
4. API: PATCH /reservations/:id → body: { status: 'cancelled', version }
5. onSuccess: toast + close modal + invalidate cache
```

> **Catatan:** Card dengan status `checked_in` **tidak** menampilkan tombol cancel. Ini karena customer yang sudah check-in tidak boleh dibatalkan.

---

## 11. Fitur 8: Statistics Dashboard

**Lokasi:** 4 card di atas daftar appointment  
**Data source:** Computed dari `reservations[]` menggunakan `useMemo`

| Card | Hitung Dari | Icon | Color |
|------|-------------|------|-------|
| Total Bookings | `reservations.length` | `event` | Violet |
| Checked In | `status === 'checked_in'` | `check_circle` | Green |
| Pending | `status === 'pending' ∪ 'confirmed'` | `schedule` | Orange |
| Walk-ins | `type === 'walk_in'` | `person_add` | Pink |

Statistik otomatis update saat data berubah (date tab / search filter).

---

## 12. Fitur 9: Queue Load Indicator

**Lokasi:** Bottom section dari right sidebar (desktop only)  
**Tujuan:** Visual feedback tentang beban antrian salon

### Logic

```typescript
level = checkedIn <= 3 ? 'Low' : checkedIn <= 6 ? 'Medium' : 'High'
color = Low → green, Medium → orange, High → red
width = Math.min(checkedIn * 10, 100) + '%'
```

Progress bar berwarna dan teks level berubah sesuai jumlah customer yang sedang `checked_in`.

---

## 13. Responsive Design

### Desktop (≥ 1280px / `xl:`)

- Layout dua kolom: Main area + right sidebar (`w-96`)
- Walk-in form ditampilkan di sidebar
- Stats grid 4 kolom
- Appointment card horizontal layout

### Tablet (768px–1279px / `md:`)

- Sidebar tersembunyi (`hidden xl:flex`)
- FAB muncul di kanan bawah
- Walk-in form sebagai bottom sheet overlay (slide-up animation)
- Stats grid 4 kolom
- Appointment card horizontal layout

### Mobile (< 768px)

- Sidebar tersembunyi
- FAB muncul
- Walk-in form sebagai bottom sheet overlay dengan max-height 85vh
- Stats grid **2 kolom**
- Appointment card **vertical** layout (stack)
- Header dengan padding-left untuk hamburger menu (`pl-14`)

---

## 14. API Endpoints

### List Reservations
```
GET /api/v1/reservations?date=2026-02-27&search=John&page=1&limit=20
```
Response: `{ items: Reservation[], total: number, page: number, limit: number }`

### Get Reservation Detail
```
GET /api/v1/reservations/:id
```
Response: `Reservation` (dengan nested `customers`, `stylists`, `reservation_services.services`)

### Create Walk-in
```
POST /api/v1/reservations
Body: {
    customer_name: string,
    customer_phone?: string,
    service_items: [{ service_id: string, stylist_id?: string }],
    notes?: string
}
```
Backend otomatis **detect walk-in** dari kehadiran field `customer_name`.

### Create Booking
```
POST /api/v1/reservations
Body: {
    customer_id: string,
    stylist_id?: string,
    type: 'booking',
    scheduled_at: string (ISO),
    service_ids: string[],
    notes?: string
}
```

### Update Reservation
```
PATCH /api/v1/reservations/:id
Body: { stylist_id?, notes?, status?, version: number }
```

### Check-in
```
POST /api/v1/reservations/:id/check-in
```

### Cancel (via Update)
```
PATCH /api/v1/reservations/:id
Body: { status: 'cancelled', version: number }
```

---

## 15. Database Tables

### `reservations`
```sql
id UUID PRIMARY KEY
customer_id UUID → customers(id)
stylist_id UUID → stylists(id)
type reservation_type ('booking'|'walk_in')
status reservation_status ('pending'|'confirmed'|'checked_in'|'completed'|'cancelled'|'no_show')
scheduled_at TIMESTAMPTZ
estimated_duration_min INTEGER
time_range TSTZRANGE              -- Auto-computed by trigger
checked_in_at TIMESTAMPTZ
completed_at TIMESTAMPTZ
notes TEXT
version INTEGER DEFAULT 1        -- Optimistic locking
created_by UUID → users(id)
```

### `reservation_services`
```sql
id UUID PRIMARY KEY
reservation_id UUID → reservations(id) ON DELETE CASCADE
service_id UUID → services(id)
created_at TIMESTAMPTZ
```

---

## 16. Troubleshooting

### Search mengembalikan "Unknown" sebagai nama customer
**Penyebab:** Supabase `.ilike()` pada foreign table column memfilter join, bukan row.  
**Solusi:** Backend sekarang pre-query customer IDs yang cocok, lalu filter reservation by `.in('customer_id', ids)`.

### Walk-in gagal — "At least one service is required"
**Penyebab:** Semua `serviceRows` kosong (tidak ada `serviceId` yang dipilih).  
**Validasi frontend:** `serviceRows.filter(r => r.serviceId).length === 0`.

### Optimistic lock error — "Reservation was modified"
**Penyebab:** 2 kasir mengedit reservasi yang sama secara bersamaan.  
**Solusi:** Refresh halaman dan coba lagi. Backend mengecek `version` field.

### Walk-in customer duplikat
**Penyebab/Solusi:** Backend melakukan upsert by phone. Jika phone diberikan dan sudah ada di DB, customer existing dipakai. Jika tidak ada phone, customer baru selalu dibuat.

### Checkout button tidak muncul
**Penyebab:** Tombol checkout hanya muncul pada card dengan `status === 'checked_in'`. Pastikan customer sudah di-check-in terlebih dahulu.
