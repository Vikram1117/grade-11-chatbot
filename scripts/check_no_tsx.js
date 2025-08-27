// Scans the project directory for any .tsx files and exits with code 1 if any are found.
import fs from 'fs/promises'
import path from 'path'

async function findTsx(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  let found = []
  for (const e of entries) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) {
      // skip node_modules
      if (e.name === 'node_modules') continue
      const inner = await findTsx(full)
      found = found.concat(inner)
    } else if (e.isFile() && full.endsWith('.tsx')) {
      found.push(full)
    }
  }
  return found
}

;(async () => {
  const root = process.cwd()
  const found = await findTsx(root)
  if (found.length > 0) {
    console.error('ERROR: Found .tsx files which may cause parser issues in non-TS projects:')
    found.forEach(f => console.error('  -', f))
    process.exit(1)
  }
  console.log('No .tsx files found — safe to run.')
  process.exit(0)
})()