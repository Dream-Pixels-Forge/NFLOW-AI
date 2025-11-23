# Quickstart: NexusFlow with Dependency Fixes

**Feature**: 001-fix-dependencies-startup
**Date**: 2025-01-23
**Prerequisites**: Node.js v18+, npm

## Overview
This guide helps you quickly set up and run the NexusFlow application after dependency issues have been resolved.

## Prerequisites Verification
Before starting, verify your environment meets the requirements:

1. Check Node.js version: `node --version` (should be v18+)
2. Check npm version: `npm --version`

## Installation Steps

### 1. Clone or Download the Project
```bash
git clone <repository-url>
cd nexusflow
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Verify Dependencies
Run the dependency verification tool to ensure all required packages are properly installed:
```bash
npm run check-deps
```

### 4. Start the Application
```bash
npm run dev
# or
npm start
```

### 5. Access the Application
Open your browser to `http://localhost:3000` (or the address shown in your terminal)

## Dependency Verification Tool
The application now includes a dependency verification command to check for issues before startup:

```bash
npm run check-deps
```

This script will:
- Verify you're using Node.js v18+
- Check if package.json exists and is valid
- Verify node_modules exists
- Validate all dependencies are properly installed
- Provide clear error messages if issues are found
- Suggest specific actions to resolve issues

## Troubleshooting
If you encounter issues during setup:

1. **Clear and reinstall**: If dependency errors occur, try:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Check Node.js version**: Verify you're using Node.js v18+:
   ```bash
   node --version
   ```

3. **Use the verification tool**: Run `npm run check-deps` for detailed dependency status

## Next Steps
- Review the main README.md for complete application documentation
- Explore the agent commands using `/chat`, `/plan`, `/arch`, etc.
- Check the settings menu for backend configuration (Gemini or Ollama)