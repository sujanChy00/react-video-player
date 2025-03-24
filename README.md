# React Video Player

A modern, customizable video player built with React, TanStack Router, and Tailwind CSS.

## Features

- Custom video controls
- Responsive design
- Keyboard shortcuts
- Modern UI with Shadcn components
- Built with TypeScript for type safety

## Tech Stack

- React 19
- TanStack Router for routing
- Tailwind CSS for styling
- Shadcn UI components
- Vite for build tooling
- TypeScript
- Vitest for testing

## Getting Started

### Prerequisites

- Node.js (latest LTS version)
- pnpm package manager

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/react-video-player.git
cd react-video-player
```

2. Install dependencies:

```bash
pnpm install
```

3. Start the development server:

```bash
pnpm start
```

The application will be available at `http://localhost:3000`

## Building for Production

To create a production build:

```bash
pnpm build
```

The built files will be in the `dist` directory.

## Testing

Run the test suite:

```bash
pnpm test
```

## Project Structure

```
├── src/
│   ├── components/     # Reusable components
│   ├── routes/        # TanStack Router routes
│   ├── lib/           # Utility functions
│   ├── styles/        # Global styles
│   └── main.tsx       # Application entry point
├── public/            # Static assets
└── tests/             # Test files
```

## Adding New Components

This project uses Shadcn UI components. To add a new component:

```bash
pnpx shadcn@latest add button
```

## Development

### File-based Routing

The project uses TanStack Router's file-based routing system. Routes are automatically generated from files in the `src/routes` directory.

### Styling

- Tailwind CSS for utility-first styling
- CSS variables for theming
- Shadcn UI components for consistent design

## License

[MIT License](LICENSE)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
