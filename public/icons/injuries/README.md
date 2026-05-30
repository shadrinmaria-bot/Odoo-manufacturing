# Custom injury icons

Drop custom per-injury-type SVG files into this folder to override the inline
fallback icons rendered by the Safety Incident Report modal.

## Convention

Each injury type is referenced by its `id` (see `INJURY_TYPES` in
`src/components/modals/SafetyIncidentModal.jsx`). The icon file for that type
must be named `<id>.svg` exactly.

- **Viewbox:** `0 0 24 24`
- **Color:** monochrome white (`fill="white"` / `stroke="white"`) — the icon
  sits on a dark tile and selection state tints the tile, not the icon, so
  the SVG itself does not need to handle color inheritance.
- **Size:** the rendered slot is ~24px inside a ~50px tile; keep strokes
  proportional (e.g. `stroke-width="1.8"`).

Any missing file falls back to the inline `fallbackIcon` defined in the
modal, so partial uploads are safe.

## Expected filenames (11)

| Filename                | Injury type label                            |
| ----------------------- | -------------------------------------------- |
| `overexertion.svg`      | Overexertion involving outside sources       |
| `other-exertions.svg`   | Other exertions or bodily reactions          |
| `repetitive.svg`        | Repetitive motions involving microtasks      |
| `fall-same.svg`         | Falls on the same level                      |
| `roadway.svg`           | Roadway incidents by motorized vehicles      |
| `struck-against.svg`    | Struck against object or equipment           |
| `struck-by.svg`         | Struck by object or equipment                |
| `slip.svg`              | Slip or trip without fall                    |
| `fall-lower.svg`        | Falls to lower level                         |
| `caught.svg`            | Caught in equipment or objects               |
| `other.svg`             | Other…                                       |
