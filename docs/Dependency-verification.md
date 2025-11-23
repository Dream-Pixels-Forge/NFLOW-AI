# Dependency Verification Tool

## Overview
The NexusFlow Dependency Verification tool helps ensure all required dependencies are properly installed before starting the application. This prevents startup issues caused by missing or incompatible dependencies.

## Usage

### Command Line Verification
Run the dependency verification tool from the project root:

```bash
npm run check-deps
```

This will:
- Check if you're using Node.js v18+
- Verify package.json exists and is valid
- Check if node_modules exists
- Validate all dependencies are properly installed
- Provide clear error messages if issues are found
- Suggest specific actions to resolve issues

### API Endpoints
The application also provides API endpoints for dependency verification:

1. **GET `/api/dependencies/verify`** - Check dependency status
2. **GET `/api/startup/status`** - Check application startup status
3. **POST `/api/errors/dependency`** - Report dependency errors

## Error Handling
When dependency issues are detected, the tool provides:
- Clear identification of missing or incompatible dependencies
- Specific steps to resolve the issues
- Context-sensitive recommendations based on the type of problem

## Integration
The dependency verification is integrated into the application startup process to provide early detection of issues before the full application loads.