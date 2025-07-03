export function Navigation() {
  const navItems = [
    { name: 'Home', href: '/', current: true },
    { name: 'Blocks', href: '/blocks' },
    { name: 'Transactions', href: '/txs' },
    { name: 'Tokens', href: '/tokens' },
    { name: 'Charts', href: '/charts' },
    { name: 'API', href: '/api' },
  ];

  return (
    <nav className="hidden md:flex space-x-8">
      {navItems.map((item) => (
        <a
          key={item.name}
          href={item.href}
          className={`${
            item.current
              ? 'border-blue-500 text-gray-900'
              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
          } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors`}
        >
          {item.name}
        </a>
      ))}
    </nav>
  );
}
