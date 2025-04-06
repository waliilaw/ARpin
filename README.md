# ARpin - Web Archive Extension for Brave

<p align="center">
  <img width="128" height="128" src="src/assets/icons/app/icon-128.png">
  <h1 align="center">ARpin</h1>
</p>

<p align="center">
  A Brave browser extension for permanent web archiving using Arweave blockchain
</p>

## Features

- Archive web pages permanently on the Arweave blockchain
- Connect with ArConnect wallet for seamless transactions
- AI-powered content tagging using Arweave's AO processes
- Local caching of archived page metadata for quick access
- Search through archived content using Arweave GraphQL
- View archived pages directly from Arweave storage
- Customizable settings for Arweave node and AI preferences

## Installation

1. Install the extension from the Chrome Web Store (coming soon)
2. Install [ArConnect](https://arconnect.io) wallet extension
3. Configure your Arweave wallet through ArConnect
4. Open ARpin and connect your wallet

## Usage

### Archiving a Page

1. Click the ARpin extension icon while on any web page
2. Connect your ArConnect wallet if not already connected
3. Click "Archive" to store the current page on Arweave
4. Wait for the transaction to be confirmed
5. The page is now permanently archived!

### Viewing Archived Pages

1. Click the ARpin extension icon
2. Search for previously archived pages
3. Click on any result to view the archived version
4. View transaction details and metadata on Arweave

### Settings

Configure ARpin through the extension options:

- Arweave Node: Choose your preferred Arweave gateway
- AI Tagging: Enable/disable automatic content tagging
- Local Cache: Configure metadata caching preferences
- Display: Customize the extension's appearance

## Development

### Prerequisites

- Node.js 16 or later
- npm or yarn
- Brave browser

### Setup

1. Clone the repository:
```bash
git clone https://github.com/wali/arpin.git
cd arpin
```

2. Install dependencies:
```bash
npm install
```

3. Build the extension:
```bash
npm run build
```

4. Load the extension in Brave:
- Open brave://extensions
- Enable Developer mode
- Click "Load unpacked"
- Select the `dist/chrome` directory

### Development Commands

- `npm run build`: Build the extension
- `npm run build:prod`: Build production version
- `npm run build:prod:zip`: Build production package
- `npm run start`: Start development server
- `npm run inspect`: Analyze bundle size

## Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) first.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Arweave](https://arweave.org) for the permanent storage protocol
- [ArConnect](https://arconnect.io) for the wallet integration

## Continuous Integration

This project uses GitHub Actions for continuous integration:

- Tests run on Node.js 16.x and 18.x
- Code coverage is reported to Codecov
- Automatic releases are created on the main branch
- Build artifacts are attached to releases

## Requirements

- Brave browser
- ArConnect wallet extension
