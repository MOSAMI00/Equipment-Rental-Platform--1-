/**
 * Post-migration import rewriter.
 * 
 * Rewrites imports in ALL .jsx and .js files to:
 * 1. Replace mock-api formatCurrency/formatRentalDate imports with utils/formatters
 * 2. Replace useAuth imports with usePage().props.auth pattern
 * 3. Replace useRentalPlatform with usePage().props  
 * 4. Replace remaining react-router references
 *
 * Run with: node src/rewrite-imports.cjs
 */
const fs = require('fs');
const path = require('path');

const SRC_DIR = path.resolve(__dirname, 'app');

function getAllFiles(dir, extensions) {
  let results = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      results = results.concat(getAllFiles(fullPath, extensions));
    } else if (extensions.some(ext => item.name.endsWith(ext))) {
      results.push(fullPath);
    }
  }
  return results;
}

function computeRelativePath(fromFile, toModule) {
  const fromDir = path.dirname(fromFile);
  let rel = path.relative(fromDir, path.resolve(SRC_DIR, toModule)).replace(/\\/g, '/');
  if (!rel.startsWith('.')) rel = './' + rel;
  return rel;
}

function rewriteImports(content, filePath) {
  let result = content;
  let changed = false;

  // 1. Replace mock-api imports for formatting functions
  const formatFuncs = ['formatCurrency', 'formatRentalDate', 'formatRentalDateRange', 'calculateRentalDays', 'isRentalStartingSoon'];
  
  result = result.replace(
    /import\s*\{([^}]*)\}\s*from\s*['"]([^'"]*data\/mock-api|[^'"]*data\/mock)['"]\s*;?/g,
    (match, importList, importPath) => {
      const imports = importList.split(',').map(i => i.trim()).filter(Boolean);
      const formatImports = [];
      const otherImports = [];
      
      for (const imp of imports) {
        const name = imp.replace(/\s+as\s+\w+/, '').trim();
        if (formatFuncs.includes(name)) {
          formatImports.push(imp);
        } else if (['getEquipmentSnapshot', 'getTenantProfile', 'getOwnerEquipmentSnapshots'].includes(name)) {
          // These mock data functions should be removed — data comes from props
          continue;
        } else if (['useRentalPlatform', 'useTenantRentals', 'useRentalById', 'useDisputes', 'useRentals'].includes(name)) {
          // These mock hooks should be removed — data comes from props
          continue;
        } else {
          otherImports.push(imp);
        }
      }
      
      const lines = [];
      if (formatImports.length > 0) {
        const relPath = computeRelativePath(filePath, 'utils/formatters');
        lines.push(`import { ${formatImports.join(', ')} } from '${relPath}';`);
        changed = true;
      }
      // Drop other mock imports entirely
      if (otherImports.length > 0) {
        lines.push(`// TODO: Remove mock imports, use Inertia props instead: ${otherImports.join(', ')}`);
        changed = true;
      }
      
      if (lines.length === 0) {
        changed = true;
        return '';
      }
      return lines.join('\n');
    }
  );

  // 2. Replace AuthContext imports
  result = result.replace(
    /import\s*\{([^}]*)\}\s*from\s*['"][^'"]*auth\/AuthContext['"]\s*;?/g,
    (match, importList) => {
      changed = true;
      const imports = importList.split(',').map(i => i.trim()).filter(Boolean);
      const hasUseAuth = imports.some(i => i.includes('useAuth'));
      if (hasUseAuth) {
        return "import { usePage } from '@inertiajs/react';\n// Auth: use usePage().props.auth instead of useAuth()";
      }
      return '// Removed mock auth import';
    }
  );

  // 3. Replace react-router imports in already-converted jsx files  
  result = result.replace(
    /import\s*\{([^}]*)\}\s*from\s*['"]react-router['"]\s*;?/g,
    (match, importList) => {
      changed = true;
      const imports = importList.split(',').map(i => i.trim()).filter(Boolean);
      const inertiaImports = new Set();
      
      for (const imp of imports) {
        const name = imp.replace(/\s+as\s+\w+/, '').trim();
        if (name === 'Link' || name === 'NavLink') {
          inertiaImports.add('Link');
        } else if (name === 'useLocation' || name === 'useParams') {
          inertiaImports.add('usePage');
        } else if (['BrowserRouter', 'Routes', 'Route', 'Navigate', 'Outlet', 'useNavigate'].includes(name)) {
          // Remove completely
        } else {
          inertiaImports.add(name);
        }
      }
      
      if (inertiaImports.size === 0) return '';
      return `import { ${[...inertiaImports].join(', ')} } from '@inertiajs/react';`;
    }
  );

  // 4. Replace type-only import lines that might still be in JSX files
  result = result.replace(/^import\s+type\s+\{[^}]*\}\s+from\s+['"][^'"]*['"];?\s*$/gm, () => {
    changed = true;
    return '';
  });

  // Clean up
  result = result.replace(/\n{3,}/g, '\n\n');

  return { result, changed };
}

const allFiles = getAllFiles(SRC_DIR, ['.jsx', '.js']);
console.log(`Scanning ${allFiles.length} JS/JSX files for import rewrites...`);

let updated = 0;
for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  const { result, changed } = rewriteImports(content, file);
  
  if (changed) {
    fs.writeFileSync(file, result, 'utf-8');
    console.log(`UPDATED: ${path.relative(SRC_DIR, file)}`);
    updated++;
  }
}

console.log(`\nDone! Updated imports in ${updated} files.`);
