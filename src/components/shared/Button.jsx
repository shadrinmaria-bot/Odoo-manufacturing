import React, { Children, cloneElement, isValidElement } from 'react'
import './Button.css'

export function Button({
  variant   = 'gray',
  position  = 'single',
  active    = false,
  disabled  = false,
  onClick,
  title,
  type      = 'button',
  children,
  className: extraClassName = '',
  style: _ignored,
  ...rest
}) {
  const classes = [
    'btn',
    `btn--${variant}`,
    `btn--${position}`,
    active   ? 'btn--on' : '',
    extraClassName,
  ].filter(Boolean).join(' ')

  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      title={title}
      className={classes}
      {...rest}
    >
      {children}
    </button>
  )
}

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
