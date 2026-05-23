import React, { useState, Children, cloneElement, isValidElement } from 'react'

/**
 * Button + ButtonGroup primitive.
 *
 * Two visual variants — purple (primary action) and gray (icon/secondary).
 * Both have default / hover / active / disabled states.
 *
 *   variant="purple"   #6B3E66 / #7B4775 / #8B5185 / 50% opacity
 *   variant="gray"     #3C3E4B / #5A5E6B / #17373B + #03F9E3 stroke / 50% opacity
 *
 * `active` is the toggle/selected state, controlled by the caller (e.g. a
 * currently-selected graph type). Pressing the mouse also temporarily applies
 * the active visual so clicks feel reactive even for one-shot actions.
 *
 * When wrapped in <ButtonGroup>, children get a `position` automatically:
 * the leftmost rounds only its left corners, the rightmost rounds only its
 * right corners, anything in between has square corners. Standalone Buttons
 * keep all four corners rounded.
 */

const COLORS = {
  purple: {
    default: '#6B3E66',
    hover:   '#7B4775',
    active:  '#8B5185',
    text:    '#F5F5F6',
  },
  gray: {
    default:      '#3C3E4B',
    hover:        '#5A5E6B',
    active:       '#17373B',
    activeBorder: '#03F9E3',
    activeText:   '#03F9E3',
    text:         '#A0A4AF',
  },
}

const RADIUS = {
  single: 4,
  left:   '4px 0 0 4px',
  middle: 0,
  right:  '0 4px 4px 0',
}

export function Button({
  variant = 'gray',
  position = 'single',
  active = false,
  disabled = false,
  onClick,
  title,
  type = 'button',
  children,
  style: extraStyle = {},
  ...rest
}) {
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)

  // Pressed = mouse currently down → use the active visual so even one-shot
  // actions get the lighter shade on click. Toggle buttons pass active=true
  // for their selected state.
  const isOn = active || pressed
  const c = COLORS[variant] ?? COLORS.gray

  let bg
  let borderColor = 'transparent'
  let color

  if (variant === 'purple') {
    bg = isOn ? c.active : hovered ? c.hover : c.default
    color = c.text
  } else {
    if (isOn) {
      bg = c.active
      borderColor = c.activeBorder
      color = c.activeText
    } else {
      bg = hovered ? c.hover : c.default
      color = c.text
    }
  }

  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      title={title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false) }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        background: bg,
        border: `1px solid ${borderColor}`,
        borderRadius: RADIUS[position] ?? 4,
        color,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'default' : 'pointer',
        transition: 'background 0.12s, border-color 0.12s, opacity 0.12s, color 0.12s',
        font: 'inherit',
        padding: 0,
        boxSizing: 'border-box',
        ...extraStyle,
      }}
      {...rest}
    >
      {children}
    </button>
  )
}

/**
 * Wraps Buttons in a horizontal row, auto-assigning `position` to each child
 * so corner-rounding follows the group convention. `gap` defaults to 3 to
 * match the existing Overview work-center button group.
 */
export function ButtonGroup({ gap = 3, children, style = {}, ...rest }) {
  const arr = Children.toArray(children).filter(Boolean)
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap, ...style }} {...rest}>
      {arr.map((child, i) => {
        if (!isValidElement(child)) return child
        const position =
          arr.length === 1     ? 'single' :
          i === 0              ? 'left'   :
          i === arr.length - 1 ? 'right'  :
                                 'middle'
        return cloneElement(child, { position: child.props.position ?? position })
      })}
    </div>
  )
}

export default Button
