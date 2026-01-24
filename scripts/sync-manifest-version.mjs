import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = fileURLToPath(new URL('..', import.meta.url))

const packageJsonPath = resolve(projectRoot, 'package.json')
const manifestPath = resolve(projectRoot, 'manifest.json')

const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))

if (typeof pkg.version !== 'string' || !pkg.version) {
	throw new Error('package.json version is missing or invalid')
}

manifest.version = pkg.version

writeFileSync(manifestPath, `${JSON.stringify(manifest, null, '\t')}\n`, 'utf8')
console.log(`Synced manifest version to ${pkg.version}`)
