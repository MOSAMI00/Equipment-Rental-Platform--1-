/**
 * Fix broken auto-conversion artifacts in .jsx and .js files.
 * 
 * 1. Fix "import * from" → restore "import * as Name from" 
 * 2. Remove lingering TypeScript type annotations from function params
 * 3. Fix broken React.forwardRef type params
 *
 * Run with: node src/fix-auto-conversion.cjs
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

function fixContent(content) {
  let result = content;
  let changed = false;

  // Fix "import * from" → detect what the namespace import should be
  // In TSX the pattern was: import * as React from "react"
  // The auto-conversion broke it to: import * from "react"
  const namespaceMap = {
    '"react"': 'React',
    "'react'": 'React',
    '"@radix-ui/react-accordion"': 'AccordionPrimitive',
    "'@radix-ui/react-accordion'": 'AccordionPrimitive',
    '"@radix-ui/react-alert-dialog"': 'AlertDialogPrimitive',
    "'@radix-ui/react-alert-dialog'": 'AlertDialogPrimitive',
    '"@radix-ui/react-aspect-ratio"': 'AspectRatioPrimitive',
    "'@radix-ui/react-aspect-ratio'": 'AspectRatioPrimitive',
    '"@radix-ui/react-avatar"': 'AvatarPrimitive',
    "'@radix-ui/react-avatar'": 'AvatarPrimitive',
    '"@radix-ui/react-checkbox"': 'CheckboxPrimitive',
    "'@radix-ui/react-checkbox'": 'CheckboxPrimitive',
    '"@radix-ui/react-collapsible"': 'CollapsiblePrimitive',
    "'@radix-ui/react-collapsible'": 'CollapsiblePrimitive',
    '"@radix-ui/react-context-menu"': 'ContextMenuPrimitive',
    "'@radix-ui/react-context-menu'": 'ContextMenuPrimitive',
    '"@radix-ui/react-dialog"': 'DialogPrimitive',
    "'@radix-ui/react-dialog'": 'DialogPrimitive',
    '"@radix-ui/react-dropdown-menu"': 'DropdownMenuPrimitive',
    "'@radix-ui/react-dropdown-menu'": 'DropdownMenuPrimitive',
    '"@radix-ui/react-hover-card"': 'HoverCardPrimitive',
    "'@radix-ui/react-hover-card'": 'HoverCardPrimitive',
    '"@radix-ui/react-label"': 'LabelPrimitive',
    "'@radix-ui/react-label'": 'LabelPrimitive',
    '"@radix-ui/react-menubar"': 'MenubarPrimitive',
    "'@radix-ui/react-menubar'": 'MenubarPrimitive',
    '"@radix-ui/react-navigation-menu"': 'NavigationMenuPrimitive',
    "'@radix-ui/react-navigation-menu'": 'NavigationMenuPrimitive',
    '"@radix-ui/react-popover"': 'PopoverPrimitive',
    "'@radix-ui/react-popover'": 'PopoverPrimitive',
    '"@radix-ui/react-progress"': 'ProgressPrimitive',
    "'@radix-ui/react-progress'": 'ProgressPrimitive',
    '"@radix-ui/react-radio-group"': 'RadioGroupPrimitive',
    "'@radix-ui/react-radio-group'": 'RadioGroupPrimitive',
    '"@radix-ui/react-scroll-area"': 'ScrollAreaPrimitive',
    "'@radix-ui/react-scroll-area'": 'ScrollAreaPrimitive',
    '"@radix-ui/react-select"': 'SelectPrimitive',
    "'@radix-ui/react-select'": 'SelectPrimitive',
    '"@radix-ui/react-separator"': 'SeparatorPrimitive',
    "'@radix-ui/react-separator'": 'SeparatorPrimitive',
    '"@radix-ui/react-slider"': 'SliderPrimitive',
    "'@radix-ui/react-slider'": 'SliderPrimitive',
    '"@radix-ui/react-switch"': 'SwitchPrimitive',
    "'@radix-ui/react-switch'": 'SwitchPrimitive',
    '"@radix-ui/react-tabs"': 'TabsPrimitive',
    "'@radix-ui/react-tabs'": 'TabsPrimitive',
    '"@radix-ui/react-toggle"': 'TogglePrimitive',
    "'@radix-ui/react-toggle'": 'TogglePrimitive',
    '"@radix-ui/react-toggle-group"': 'ToggleGroupPrimitive',
    "'@radix-ui/react-toggle-group'": 'ToggleGroupPrimitive',
    '"@radix-ui/react-tooltip"': 'TooltipPrimitive',
    "'@radix-ui/react-tooltip'": 'TooltipPrimitive',
    '"recharts"': 'RechartsPrimitive',
    "'recharts'": 'RechartsPrimitive',
    '"react-resizable-panels"': 'ResizablePrimitive',
    "'react-resizable-panels'": 'ResizablePrimitive',
  };

  result = result.replace(/import\s+\*\s+from\s+(["'][^"']+["'])/g, (match, moduleSpec) => {
    const alias = namespaceMap[moduleSpec];
    if (alias) {
      changed = true;
      return `import * as ${alias} from ${moduleSpec}`;
    }
    // Unknown namespace import — try to guess from module name
    const moduleName = moduleSpec.replace(/['"]/g, '');
    const parts = moduleName.split('/');
    let guess = parts[parts.length - 1]
      .replace(/^react-/, '')
      .replace(/-(\w)/g, (_, c) => c.toUpperCase());
    guess = guess.charAt(0).toUpperCase() + guess.slice(1) + 'Primitive';
    changed = true;
    return `import * as ${guess} from ${moduleSpec}`;
  });

  // Remove lingering TS type annotations from function params
  // Pattern: }: TypeName) { → }) {
  result = result.replace(/}\s*:\s*\w+(?:Props|Type|Options|Config|State)\s*\)/g, (match) => {
    changed = true;
    return '})';
  });

  // Remove React.forwardRef type params: React.forwardRef<HTMLElement, Props>(...)
  result = result.replace(/React\.forwardRef<[^>]+>/g, (match) => {
    changed = true;
    return 'React.forwardRef';
  });

  // Remove React.ComponentPropsWithoutRef<...> and similar
  result = result.replace(/:\s*React\.ComponentPropsWithoutRef<[^>]+>/g, () => {
    changed = true;
    return '';
  });
  result = result.replace(/:\s*React\.ComponentProps<[^>]+>/g, () => {
    changed = true;
    return '';
  });
  result = result.replace(/:\s*React\.HTMLAttributes<[^>]+>/g, () => {
    changed = true;
    return '';
  });
  result = result.replace(/:\s*React\.ButtonHTMLAttributes<[^>]+>/g, () => {
    changed = true;
    return '';
  });
  result = result.replace(/:\s*React\.TdHTMLAttributes<[^>]+>/g, () => {
    changed = true;
    return '';
  });
  result = result.replace(/:\s*React\.ThHTMLAttributes<[^>]+>/g, () => {
    changed = true;
    return '';
  });
  result = result.replace(/:\s*React\.InputHTMLAttributes<[^>]+>/g, () => {
    changed = true;
    return '';
  });
  result = result.replace(/:\s*React\.SelectHTMLAttributes<[^>]+>/g, () => {
    changed = true;
    return '';
  });
  result = result.replace(/:\s*React\.TextareaHTMLAttributes<[^>]+>/g, () => {
    changed = true;
    return '';
  });
  result = result.replace(/:\s*React\.LabelHTMLAttributes<[^>]+>/g, () => {
    changed = true;
    return '';
  });
  result = result.replace(/:\s*React\.OlHTMLAttributes<[^>]+>/g, () => {
    changed = true;
    return '';
  });

  // Remove VariantProps<typeof ...> type annotations
  result = result.replace(/&\s*VariantProps<typeof\s+\w+>/g, () => {
    changed = true;
    return '';
  });
  result = result.replace(/:\s*VariantProps<typeof\s+\w+>/g, () => {
    changed = true;
    return '';
  });

  return { result, changed };
}

const allFiles = getAllFiles(SRC_DIR, ['.jsx', '.js']);
console.log(`Scanning ${allFiles.length} files for auto-conversion fixes...`);

let fixed = 0;
for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  const { result, changed } = fixContent(content);
  
  if (changed) {
    fs.writeFileSync(file, result, 'utf-8');
    console.log(`FIXED: ${path.relative(SRC_DIR, file)}`);
    fixed++;
  }
}

console.log(`\nDone! Fixed ${fixed} files.`);
