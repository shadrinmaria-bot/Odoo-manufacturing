import React from 'react'

/**
 * Icon — renders a Font Awesome or Odoo UI icon-font glyph.
 *
 * Pass `char` as a `\uXXXX` JS unicode escape (not a literal PUA character),
 * since literal PUA chars get stripped by some tooling.
 */
export default function Icon({ char, font = 'fa', size = 16, color, style = {} }) {
  const fontFamily = font === 'odoo' ? '"odoo_ui_icons"' : '"fontawesome"'
  return (
    <span
      aria-hidden="true"
      style={{
        fontFamily,
        fontSize:            size,
        color:               color ?? 'currentColor',
        lineHeight:          1,
        display:             'inline-block',
        fontStyle:           'normal',
        fontWeight:          'normal',
        fontVariant:         'normal',
        textTransform:       'none',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        ...style,
      }}
    >
      {char}
    </span>
  )
}
