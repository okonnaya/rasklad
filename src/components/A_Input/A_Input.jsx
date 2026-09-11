import './A_Input.scss'
export default function A_Input({
  value = '',
  placeholder,
  handleInput,
  handleSubmit,
  onFocus,
  onBlur
}) {
  return (
    <input
      className="A_Input"
      value={value}
      placeholder={placeholder}
      aria-label="Поиск по сайту"
      onFocus={onFocus}
      onBlur={onBlur}
      onChange={(event) => handleInput(event.target.value)}
      onKeyDown={(event) => {
        if (event.key === 'Enter') handleSubmit()
      }}
    />
  )
}
