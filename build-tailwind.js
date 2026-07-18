#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const tailwindRoot = '/opt/nvm/versions/node/v22.16.0/lib/node_modules/tailwindcss';
const { compile } = require(path.join(tailwindRoot, 'dist/lib.js'));

async function main() {
  const input = fs.readFileSync(path.join(tailwindRoot, 'index.css'), 'utf8');
  const compiler = await compile(input, {
    base: tailwindRoot,
    from: path.join(tailwindRoot, 'index.css'),
    loadStylesheet: async (id, base) => {
      const resolved = path.resolve(base, id);
      return {
        path: resolved,
        base: path.dirname(resolved),
        content: fs.readFileSync(resolved, 'utf8')
      };
    }
  });

  const sourceFiles = ['index.html', 'core.js', 'screens-learn.js', 'screens-apply.js'];
  const source = sourceFiles.map(file => fs.readFileSync(path.join(__dirname, file), 'utf8')).join('\n');
  const rawTokens = source.match(/-?[A-Za-z0-9_!@#$%&*+.,:;?()[\]{}=\/\\'"-]+/g) || [];
  const candidates = new Set(rawTokens.map(token => token.replace(/^["']+|["']+$/g, '')).filter(Boolean));
  // Explicitly retain utilities assembled through conditional expressions or used by runtime-generated markup.
  [
    'sr-only','pointer-events-none','hidden','block','inline','inline-flex','flex','grid','relative','absolute','fixed','sticky',
    'text-cyan-300','text-violet-300','text-emerald-300','text-amber-300','text-rose-300',
    'bg-cyan-400/10','bg-violet-400/10','bg-emerald-400/10','bg-amber-300/10','bg-rose-400/10',
    'border-cyan-300/20','border-violet-300/20','border-emerald-300/20','border-amber-300/20','border-rose-300/20',
    'md:flex','md:hidden','sm:flex-row','lg:grid-cols-2','opacity-45','opacity-55'
  ].forEach(item => candidates.add(item));

  const css = compiler.build(Array.from(candidates));
  fs.writeFileSync(path.join(__dirname, 'tailwind.css'), css);
  console.log(`Built tailwind.css with ${candidates.size} candidate tokens (${Buffer.byteLength(css)} bytes).`);
}

main().catch(error => { console.error(error); process.exit(1); });
