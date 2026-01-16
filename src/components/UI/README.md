# UI Components

Reusable UI components for the medical cabinet application.

## Components

### Card
Card component with colored borders.

```jsx
import { Card } from './components/UI';

<Card borderColor="violet" className="mb-4">
  <h3>Card Title</h3>
  <p>Card content</p>
</Card>
```

**Props:**
- `children` (required): Card content
- `borderColor`: 'violet' | 'rose' | 'cyan' | 'green' | 'blue' (default: 'violet')
- `className`: Additional CSS classes

---

### StatCard
Statistics card with icon, title, value, and optional subtitle.

```jsx
import { StatCard } from './components/UI';

<StatCard
  icon={<IconComponent />}
  title="Total Patients"
  value="1,234"
  subtitle="+12% from last month"
  iconBgColor="bg-violet-100"
/>
```

**Props:**
- `icon` (required): Icon element or component
- `title` (required): Card title
- `value` (required): Main statistic value
- `subtitle`: Optional subtitle text
- `iconBgColor`: Background color for icon (default: 'bg-violet-100')

---

### Button
Button with multiple variants.

```jsx
import { Button } from './components/UI';

<Button variant="primary" onClick={handleClick}>
  Click Me
</Button>
```

**Props:**
- `children` (required): Button content
- `variant`: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'outline' (default: 'primary')
- `onClick`: Click handler
- `disabled`: Disabled state (default: false)
- `className`: Additional CSS classes
- `type`: 'button' | 'submit' | 'reset' (default: 'button')

---

### Input
Input field with label, error message, and optional icon.

```jsx
import { Input } from './components/UI';

<Input
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errors.email}
  icon={<MailIcon />}
  placeholder="Enter your email"
  required
/>
```

**Props:**
- `label`: Input label text
- `type`: Input type (default: 'text')
- `value`: Input value
- `onChange`: Change handler
- `error`: Error message to display
- `icon`: Optional icon element
- `placeholder`: Placeholder text
- `required`: Required field indicator (default: false)

---

### Modal
Reusable modal with header, body, and footer.

```jsx
import { Modal, Button } from './components/UI';

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Modal Title"
  footer={
    <>
      <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
      <Button variant="primary" onClick={handleSubmit}>Submit</Button>
    </>
  }
>
  <p>Modal content goes here</p>
</Modal>
```

**Props:**
- `isOpen` (required): Modal visibility state
- `onClose` (required): Close handler
- `title` (required): Modal title
- `children` (required): Modal body content
- `footer`: Modal footer content

---

### Table
Responsive table with pagination.

```jsx
import { Table, Button } from './components/UI';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { 
    key: 'status', 
    label: 'Status',
    render: (row) => <Badge variant={row.status}>{row.status}</Badge>
  }
];

<Table
  columns={columns}
  data={patients}
  onRowClick={(row) => console.log(row)}
  actions={(row) => (
    <>
      <Button variant="ghost" onClick={() => handleEdit(row)}>Edit</Button>
      <Button variant="danger" onClick={() => handleDelete(row)}>Delete</Button>
    </>
  )}
  currentPage={1}
  totalPages={10}
  onPageChange={(page) => setPage(page)}
/>
```

**Props:**
- `columns` (required): Array of column definitions with key, label, render
- `data` (required): Array of data objects
- `onRowClick`: Row click handler
- `actions`: Function returning action buttons for each row
- `currentPage`: Current page number
- `totalPages`: Total number of pages
- `onPageChange`: Page change handler

---

### Badge
Colored badge for statuses.

```jsx
import { Badge } from './components/UI';

<Badge variant="success">Active</Badge>
<Badge variant="danger">Expired</Badge>
<Badge variant="warning">Pending</Badge>
```

**Props:**
- `children` (required): Badge content
- `variant`: 'success' | 'danger' | 'warning' | 'info' | 'default' (default: 'default')
- `className`: Additional CSS classes

---

### Autocomplete
Autocomplete input for searching with keyboard navigation.

```jsx
import { Autocomplete } from './components/UI';

<Autocomplete
  label="Search Patients"
  value={searchQuery}
  onChange={setSearchQuery}
  onSelect={(patient) => selectPatient(patient)}
  options={patients.map(p => ({
    id: p.id,
    label: p.name,
    subtitle: p.email
  }))}
  placeholder="Type to search..."
  loading={isLoading}
/>
```

**Props:**
- `label`: Input label
- `value` (required): Current input value
- `onChange` (required): Input change handler
- `onSelect` (required): Option select handler
- `options`: Array of option objects with id, label, name, subtitle
- `placeholder`: Placeholder text
- `loading`: Loading state (default: false)

**Keyboard Navigation:**
- `ArrowDown`: Move to next option (wraps to first)
- `ArrowUp`: Move to previous option (wraps to last)
- `Enter`: Select highlighted option
- `Escape`: Close dropdown

---

## Theme Colors

The components use the medical cabinet theme with violet as the primary color:
- Primary: `#5B4FED` (violet-500)
- Secondary: `#4338CA` (violet-600)

## Importing Components

```jsx
// Import individual components
import { Card, Button, Input } from './components/UI';

// Or import all
import * as UI from './components/UI';
```
