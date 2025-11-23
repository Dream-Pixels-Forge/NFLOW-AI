#!/usr/bin/env node

/**
 * Dependency verification script for NexusFlow
 * Checks if all required dependencies are properly installed
 */

import fs from 'fs';
import path from 'path';

interface DependencyCheckResult {
  success: boolean;
  missingDependencies: string[];
  incompatibleDependencies: string[];
  message: string;
  actionSteps: string[];
}

// Check if Node.js version is compatible (v18+)
const checkNodeVersion = (): boolean => {
  const [major] = process.version.slice(1).split('.').map(Number);
  return major >= 18;
};

// Check if package.json exists
const checkPackageJson = (): boolean => {
  return fs.existsSync(path.join(process.cwd(), 'package.json'));
};

// Validate package.json structure and check for dependencies
const validatePackageJson = (): { isValid: boolean; dependencies?: Record<string, string>; error?: string } => {
  try {
    const packagePath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

    if (!packageJson.dependencies) {
      return { isValid: false, error: 'No dependencies found in package.json' };
    }

    return { isValid: true, dependencies: packageJson.dependencies };
  } catch (error) {
    return { isValid: false, error: `Invalid package.json: ${(error as Error).message}` };
  }
};

// Check if specific dependencies exist in node_modules
const checkDependenciesExistence = (dependencies: Record<string, string>): { missing: string[], existing: string[] } => {
  const missing: string[] = [];
  const existing: string[] = [];
  const nodeModulesPath = path.join(process.cwd(), 'node_modules');

  if (!fs.existsSync(nodeModulesPath)) {
    // If node_modules doesn't exist, all dependencies are missing
    return {
      missing: Object.keys(dependencies),
      existing: []
    };
  }

  // Check if each dependency exists in node_modules
  for (const depName of Object.keys(dependencies)) {
    const depPath = path.join(nodeModulesPath, depName);
    if (fs.existsSync(depPath)) {
      existing.push(depName);
    } else {
      missing.push(depName);
    }
  }

  return { missing, existing };
};

// Check dependencies by looking for them in node_modules
const checkDependencies = async (): Promise<DependencyCheckResult> => {
  const validation = validatePackageJson();

  if (!validation.isValid) {
    return {
      success: false,
      missingDependencies: [],
      incompatibleDependencies: [],
      message: validation.error || "Package.json validation failed",
      actionSteps: [
        "Verify your package.json file is properly formatted",
        "Check for syntax errors in package.json"
      ]
    };
  }

  const { missing, existing } = checkDependenciesExistence(validation.dependencies!);

  if (missing.length > 0) {
    return {
      success: false,
      missingDependencies: missing,
      incompatibleDependencies: [],
      message: `Missing ${missing.length} dependencies`,
      actionSteps: [
        "Run 'npm install' to install missing dependencies",
        "Check your package.json for correct dependency names"
      ]
    };
  }

  return {
    success: true,
    missingDependencies: [],
    incompatibleDependencies: [],
    message: "All required dependencies are properly installed",
    actionSteps: []
  };
};

// Main execution
const main = async () => {
  console.log('🔍 NexusFlow Dependency Verification Tool');
  console.log('=====================================');

  // Check Node version
  if (!checkNodeVersion()) {
    console.error('❌ Node.js version requirement not met. Please use Node.js v18 or higher.');
    process.exit(1);
  }
  console.log('✅ Node.js version is compatible (v18+)');

  // Check for package.json
  if (!checkPackageJson()) {
    console.error('❌ package.json not found in current directory');
    process.exit(1);
  }
  console.log('✅ package.json found');

  // Validate package.json
  const packageValidation = validatePackageJson();
  if (!packageValidation.isValid) {
    console.error(`❌ Invalid package.json: ${packageValidation.error}`);
    process.exit(1);
  }
  console.log('✅ package.json is valid');

  // Check for node_modules
  const nodeModulesExists = fs.existsSync(path.join(process.cwd(), 'node_modules'));
  if (!nodeModulesExists) {
    console.log('⚠️  node_modules not found - dependencies may need to be installed');
  } else {
    console.log('✅ node_modules directory found');
  }

  // Perform detailed dependency check
  console.log('\n🔍 Checking dependencies...');
  const result = await checkDependencies();

  if (result.success) {
    console.log('\n✅ All dependencies verified successfully');
    console.log('🎉 NexusFlow application should start without dependency issues');
  } else {
    console.log('\n❌ Dependency issues detected');
    console.log(`📝 ${result.message}`);

    if (result.missingDependencies.length > 0) {
      console.log('\n📦 Missing dependencies:');
      result.missingDependencies.forEach(dep => {
        console.log(`   - ${dep}`);
      });
    }

    if (result.actionSteps.length > 0) {
      console.log('\n📋 Recommended actions:');
      result.actionSteps.forEach((step, index) => {
        console.log(`   ${index + 1}. ${step}`);
      });
    }
  }

  process.exit(result.success ? 0 : 1);
};

main().catch(err => {
  console.error('❌ Unexpected error during dependency verification:', err);
  process.exit(1);
});