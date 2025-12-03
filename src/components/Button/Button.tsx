import './Button.css'

const Button: React.FC<{
  color: 'blue' | 'gray' | 'light-blue' | 'orange' | 'pink' | 'purple'
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  text: string
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type']
}> = ({ color, text: label, onClick, type = 'button' }) => (
  <button className={`btn-base btn-${color}`} onClick={onClick} type={type}>
    {label}
  </button>
)

export default Button
