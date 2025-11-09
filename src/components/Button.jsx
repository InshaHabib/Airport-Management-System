const Button = ({ children, onClick, variant = 'primary', type = 'button', disabled = false, className = '', icon }) => {
  const baseClasses = 'px-6 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl';
  
  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 text-white hover:from-purple-700 hover:via-violet-700 hover:to-fuchsia-700',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-purple-50 hover:text-purple-700 border border-gray-300',
    danger: 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800',
    success: 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${className} flex items-center justify-center gap-2`}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
};

export default Button;


