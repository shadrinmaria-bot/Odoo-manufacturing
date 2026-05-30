# Worker avatars

Drop one image per worker here, named after the worker's `value` field in
`src/components/modals/SafetyIncidentModal.jsx` (the `WORKERS` array).

## Convention

- File name: `<worker value>.png` (e.g. `john-doe.png`).
- Square images, ideally ~80x80 or larger (they render as 26x26 round avatars
  in the Injured Worker dropdown).
- PNG with a transparent or solid background — the UI clips to a circle.

## Expected files

- `john-doe.png`
- `jane-smith.png`
- `mike-johnson.png`
- `sara-lee.png`

## Fallback

If a file is missing or fails to load, the UI shows a colored circle with the
worker's initials, so it's safe to add files incrementally.
