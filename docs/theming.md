
# Theming

Noctra uses data attributes and CSS variables.

## Provider

```tsx
<NoctraProvider theme="dark" density="default" radiusMode="default" accent="violet">
  <App />
</NoctraProvider>
```

## Theme mode

| Mode     | Purpose                                        |
| -------- | ---------------------------------------------- |
| `dark`   | Primary Noctra identity                        |
| `light`  | Light UI support                               |
| `system` | Reserved for future system preference behavior |

## Density

| Density       | Purpose                               |
| ------------- | ------------------------------------- |
| `compact`     | Data-heavy dashboards                 |
| `default`     | Standard application UI               |
| `comfortable` | Marketing, docs, and spacious layouts |

## Radius mode

| Radius    | Purpose                          |
| --------- | -------------------------------- |
| `sharp`   | Dense enterprise/productivity UI |
| `default` | Standard Noctra balance          |
| `rounded` | Softer SaaS/product UI           |

## Accent mode

| Accent    | Purpose                  |
| --------- | ------------------------ |
| `violet`  | Default Noctra identity  |
| `indigo`  | Cooler developer-tool UI |
| `blue`    | Product/admin UI         |
| `cyan`    | Technical/data UI        |
| `emerald` | Success/ops-oriented UI  |

## Token layers

Noctra token hierarchy:

1. Primitive tokens
2. Semantic tokens
3. Theme tokens
4. Component tokens
5. Variant tokens
6. State tokens
7. Utility tokens

Components should never use raw color values directly.