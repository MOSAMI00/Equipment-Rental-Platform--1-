/**
 * Migration script: Batch convert remaining .tsx files to .jsx
 * 
 * This script handles the mechanical conversion of:
 * 1. Removing TypeScript type annotations
 * 2. Removing type imports  
 * 3. Replacing react-router imports with @inertiajs/react
 * 4. Replacing mock-api imports with Inertia patterns
 * 
 * Run with: node src/migrate-tsx-to-jsx.cjs
 */
const fs = require('fs');
const path = require('path');

const SRC_DIR = path.resolve(__dirname, 'app');

function getAllFiles(dir, ext) {
  let results = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      results = results.concat(getAllFiles(fullPath, ext));
    } else if (item.name.endsWith(ext)) {
      results.push(fullPath);
    }
  }
  return results;
}

function transformContent(content, filePath) {
  let result = content;

  // Remove type-only imports: import type { ... } from '...';
  result = result.replace(/^import\s+type\s+\{[^}]*\}\s+from\s+['"][^'"]*['"];?\s*$/gm, '');
  
  // Remove `type` keyword from mixed imports: import { X, type Y } from '...'
  result = result.replace(/,\s*type\s+(\w+)/g, '');
  result = result.replace(/\{\s*type\s+(\w+)\s*,/g, '{');
  
  // Remove TypeScript interface declarations
  result = result.replace(/^(export\s+)?interface\s+\w+\s*(\{[\s\S]*?\n\})\s*$/gm, '');
  
  // Remove TypeScript type aliases
  result = result.replace(/^(export\s+)?type\s+\w+\s*=\s*[^;]+;\s*$/gm, '');
  
  // Remove generic type parameters: useState<Type>(...)
  result = result.replace(/useState<[^>]+>/g, 'useState');
  result = result.replace(/useRef<[^>]+>/g, 'useRef');
  result = result.replace(/useMemo<[^>]+>/g, 'useMemo');
  result = result.replace(/createContext<[^>]+>/g, 'createContext');
  
  // Remove type annotations from function parameters
  // e.g., (param: Type) → (param)
  result = result.replace(/:\s*React\.FormEvent\b/g, '');
  result = result.replace(/:\s*React\.ChangeEvent<[^>]*>/g, '');
  result = result.replace(/:\s*React\.MouseEvent<[^>]*>/g, '');
  result = result.replace(/:\s*React\.ReactNode\b/g, '');
  
  // Remove type annotations from destructured props: { children }: { children: ReactNode }
  result = result.replace(/\}\s*:\s*\{[^}]*\}/g, '}');
  
  // Remove simple type annotations: : string, : number, : boolean, etc.
  // Be careful not to match CSS/object literals
  result = result.replace(/(\w)\s*:\s*(?:string|number|boolean|any|void|null|undefined)\b(?!\s*[,;}\])=])/g, '$1');
  
  // Remove Record<...> type annotations
  result = result.replace(/:\s*Record<[^>]+>/g, '');
  
  // Remove as Type casts (simple ones)
  result = result.replace(/\s+as\s+\w+(?:\[\])?(?=[;,)\s}])/g, '');
  
  // Remove non-null assertions
  result = result.replace(/!(?=\.(get|set|find|filter|map|reduce|forEach|length|includes|some|every|sort))/g, '');
  result = result.replace(/!(?=\))/g, '');
  
  // Replace react-router imports
  result = result.replace(
    /import\s*\{([^}]*)\}\s*from\s*['"]react-router['"];?/g,
    (match, imports) => {
      const importList = imports.split(',').map(i => i.trim()).filter(Boolean);
      const inertiaImports = [];
      const removedImports = [];
      
      for (const imp of importList) {
        const name = imp.replace(/\s+as\s+\w+/, '').trim();
        if (name === 'Link' || name === 'NavLink') {
          inertiaImports.push('Link');
        } else if (name === 'useNavigate') {
          // Will be replaced with visit() from navigation helper
          removedImports.push(name);
        } else if (name === 'useLocation') {
          inertiaImports.push('usePage');
        } else if (name === 'useParams') {
          inertiaImports.push('usePage');
        } else if (['BrowserRouter', 'Routes', 'Route', 'Navigate', 'Outlet'].includes(name)) {
          removedImports.push(name);
        } else {
          inertiaImports.push(name);
        }
      }
      
      const unique = [...new Set(inertiaImports)];
      if (unique.length === 0) return '';
      return `import { ${unique.join(', ')} } from '@inertiajs/react';`;
    }
  );
  
  // Replace useNavigate() calls with visit()
  if (result.includes('useNavigate')) {
    result = result.replace(/const\s+navigate\s*=\s*useNavigate\(\);?/g, '');
    result = result.replace(/navigate\(/g, 'visit(');
    if (!result.includes("from '../../inertia/navigation'") && !result.includes("from '../inertia/navigation'")) {
      // Add visit import if needed
      const depth = filePath.split(path.sep).filter(p => p !== '').length - 
                     SRC_DIR.split(path.sep).filter(p => p !== '').length;
      const prefix = '../'.repeat(Math.max(depth - 1, 1));
      result = `import { visit } from '${prefix}inertia/navigation';\n${result}`;
    }
  }
  
  // Replace useLocation() with usePage()
  result = result.replace(/const\s*\{\s*pathname\s*\}\s*=\s*useLocation\(\);?/g, 
    'const { url: pathname } = usePage();');
  result = result.replace(/const\s+location\s*=\s*useLocation\(\);?/g,
    'const { url } = usePage();\n  const location = { pathname: url };');
    
  // Replace useParams()
  result = result.replace(/const\s*\{([^}]*)\}\s*=\s*useParams\(\);?/g, (match, params) => {
    return `const { props } = usePage();\n  // TODO: ${params.trim()} comes from props`;
  });
  
  // Replace useAuth() with usePage().props.auth
  result = result.replace(/import\s*\{[^}]*useAuth[^}]*\}\s*from\s*['"][^'"]*AuthContext['"];?/g, '');
  result = result.replace(/import\s*\{[^}]*makeMockUser[^}]*\}\s*from\s*['"][^'"]*AuthContext['"];?/g, '');

  // Replace mock-api imports
  result = result.replace(
    /import\s*\{[^}]*\}\s*from\s*['"][^'"]*data\/mock-api['"];?/g,
    ''
  );
  result = result.replace(
    /import\s*\{[^}]*\}\s*from\s*['"][^'"]*data\/mock['"];?/g, 
    ''
  );
  
  // Clean up empty lines
  result = result.replace(/\n{3,}/g, '\n\n');
  
  return result;
}

// Find all .tsx files
const tsxFiles = getAllFiles(SRC_DIR, '.tsx');
const tsFiles = getAllFiles(SRC_DIR, '.ts');

console.log(`Found ${tsxFiles.length} .tsx files`);
console.log(`Found ${tsFiles.length} .ts files`);

let converted = 0;

for (const file of tsxFiles) {
  const jsxFile = file.replace(/\.tsx$/, '.jsx');
  
  // Skip if .jsx already exists (we already converted it manually)
  if (fs.existsSync(jsxFile)) {
    console.log(`SKIP (jsx exists): ${path.relative(SRC_DIR, file)}`);
    continue;
  }
  
  const content = fs.readFileSync(file, 'utf-8');
  const transformed = transformContent(content, file);
  
  fs.writeFileSync(jsxFile, transformed, 'utf-8');
  console.log(`CONVERTED: ${path.relative(SRC_DIR, file)} → .jsx`);
  converted++;
}

for (const file of tsFiles) {
  const jsFile = file.replace(/\.ts$/, '.js');
  
  // Skip if .js already exists
  if (fs.existsSync(jsFile)) {
    console.log(`SKIP (js exists): ${path.relative(SRC_DIR, file)}`);
    continue;
  }
  
  const content = fs.readFileSync(file, 'utf-8');
  const transformed = transformContent(content, file);
  
  fs.writeFileSync(jsFile, transformed, 'utf-8');
  console.log(`CONVERTED: ${path.relative(SRC_DIR, file)} → .js`);
  converted++;
}

console.log(`\nDone! Converted ${converted} files.`);
console.log('\nNext steps:');
console.log('1. Delete the old .tsx and .ts source files');
console.log('2. Update import paths that reference .tsx → .jsx');
console.log('3. Review converted files for manual fixes needed');
