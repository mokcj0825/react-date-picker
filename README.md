# React Datepicker

A customizable date picker component for React applications with locale support and viewport-aware positioning.

## Features

- Date selection with calendar interface
- Locale support with automatic language detection from localStorage
- Viewport-aware dropdown positioning
- Dark mode support
- Customizable styling through CSS modules
- Date range restrictions (min/max dates)
- Week start configuration (Sunday or Monday)
- Disabled state support
- Responsive design
- TypeScript support

## Installation

```bash
npm install react-datepicker
```

## Basic Usage

```tsx
import React, { useState } from 'react';
import { Datepicker } from 'react-datepicker';

function App() {
  const [selectedDate, setSelectedDate] = useState<Date>();

  return (
    <Datepicker
      selectedDate={selectedDate}
      onDateChange={setSelectedDate}
      placeholder="Select a date"
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `selectedDate` | `Date` | - | Currently selected date |
| `onDateChange` | `(date: Date) => void` | - | Callback when date changes |
| `onDateSelected` | `(date: Date) => void` | - | Callback when date is selected |
| `placeholder` | `string` | - | Placeholder text (defaults to today's date) |
| `minDate` | `Date` | `new Date(0)` | Minimum selectable date |
| `maxDate` | `Date` | - | Maximum selectable date |
| `isDarkMode` | `boolean` | `false` | Enable dark mode styling |
| `styles` | `Record<string, string>` | - | Custom CSS module classes |
| `languageCodeKey` | `string` | - | localStorage key for language code |
| `weekStartsOn` | `0 \| 1` | `1` | Week start day (0 = Sunday, 1 = Monday) |
| `disabled` | `boolean` | `false` | Disable the datepicker |

## Locale Support

The component automatically detects the user's language preference from localStorage:

```tsx
// Set language in localStorage
localStorage.setItem('languageCode', 'zh');

// Use the language code key
<Datepicker
  languageCodeKey="languageCode"
  selectedDate={selectedDate}
  onDateChange={setSelectedDate}
/>
```

Supported language codes: `en`, `zh`, `ms`, `ja`, `ko`, `fr`, `de`, `es`, `pt`, `ru`, `ar`, `hi`

## Custom Styling

Pass a CSS module object to customize the appearance:

```tsx
import customStyles from './my-styles.module.css';

<Datepicker
  styles={customStyles}
  selectedDate={selectedDate}
  onDateChange={setSelectedDate}
/>
```

## Dark Mode

Enable dark mode styling:

```tsx
<Datepicker
  isDarkMode={true}
  selectedDate={selectedDate}
  onDateChange={setSelectedDate}
/>
```

## Date Range Restrictions

Set minimum and maximum selectable dates:

```tsx
<Datepicker
  minDate={new Date(2024, 0, 1)}
  maxDate={new Date(2024, 11, 31)}
  selectedDate={selectedDate}
  onDateChange={setSelectedDate}
/>
```

## Week Start Configuration

Configure which day the week starts on:

```tsx
// Start week on Sunday
<Datepicker weekStartsOn={0} />

// Start week on Monday (default)
<Datepicker weekStartsOn={1} />
```

## Disabled State

Disable the datepicker:

```tsx
<Datepicker
  disabled={true}
  selectedDate={selectedDate}
  onDateChange={setSelectedDate}
/>
```

## License

MIT
