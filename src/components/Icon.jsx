import React from 'react'

/**
 * Icon — renders a Font Awesome or Odoo UI icon-font glyph.
 *
 * IMPORTANT: pass `char` as a `\uXXXX` escape sequence (e.g. `''`), not
 * a literal Private Use Area character. Literal PUA chars get stripped when
 * round-tripped through some tooling, leaving an empty string and an
 * invisible icon.
 *
 * @param {string} char  Unicode glyph, expressed as a `\uXXXX` escape.
 * @param {'fa'|'odoo'} font  Which font face to use (default: 'fa').
 * @param {number} size  Pixel font-size (default: 16).
 * @param {string} color CSS color (default: currentColor).
 * @param {object} style Extra inline styles, merged last.
 */
export default function Icon({ char, font = 'fa', size = 16, color, style = {} }) {
  const fontFamily = font === 'odoo' ? '"odoo_ui_icons"' : '"fontawesome"'
  return (
    <span
      aria-hidden="true"
      style={{
        fontFamily,
        fontSize: size,
        color: color ?? 'currentColor',
        lineHeight: 1,
        display: 'inline-block',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fontVariant: 'normal',
        textTransform: 'none',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        ...style,
      }}
    >
      {char}
    </span>
  )
}
