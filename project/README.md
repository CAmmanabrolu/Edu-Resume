# EduResume

EduResume is a blockchain-based educational credential management platform that allows educational institutions to issue verifiable credentials to students, which can be easily verified by potential employers and other stakeholders.

## Features

- **Issue Credentials**: Educational institutions can issue verifiable credentials to students
- **Verify Credentials**: Employers can verify the authenticity of credentials
- **Credential Management**: Users can view and manage their credentials
- **EDU Token Staking**: Stake EDU tokens for rewards and platform benefits
- **Blockchain Integration**: Secure and transparent credential verification using blockchain

## Technologies Used

- React
- TypeScript
- Tailwind CSS
- Vite
- Ethers.js for blockchain interaction
- MetaMask wallet integration

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- MetaMask browser extension (optional for full blockchain functionality)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/eduresume.git
   cd eduresume
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm run dev
   ```

4. The application will be available at `http://localhost:5173` (or another port if 5173 is in use)

## Environment Variables

The project uses the following environment variables:

```
VITE_APP_TITLE=EduResume
VITE_ENABLE_MOCK=true
VITE_ENVIRONMENT=production
VITE_EDU_TOKEN_ADDRESS=0x4eDuT0k3nAddr3ss00000000000000000000000
VITE_CREDENTIAL_NFT_ADDRESS=0xCr3d3nt1alNFTAddr3ss000000000000000000
VITE_EDU_CHAIN_ID=0x7a69
```

## Building for Production

```
npm run build
```

## Deployment

The project is configured for deployment on Vercel:

```
vercel --prod
```

## Project Structure

- `src/components`: React components
- `src/pages`: Page components
- `src/lib`: Utility functions including blockchain integration
- `src/store`: State management
- `src/styles`: CSS and style definitions

## License

[MIT License](LICENSE)

## Acknowledgements

- Built with React
- UI components from Shadcn UI
- Icons from Lucide React 