import { existsSync, readFileSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const projectRoot = fileURLToPath(new URL('..', import.meta.url))
const distDir = resolve(projectRoot, 'dist')

if (!existsSync(distDir)) {
	throw new Error('dist/ not found. Run the build first.')
}

const manifestPath = resolve(distDir, 'manifest.json')
if (!existsSync(manifestPath)) {
	throw new Error('dist/manifest.json not found. Ensure the build copies the manifest into dist/.')
}

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
const version = String(manifest.version ?? '').trim()
if (!version) {
	throw new Error('manifest.json version is missing or invalid')
}

const rawName = String(manifest.name ?? 'extension').trim() || 'extension'
const slug = rawName
	.toLowerCase()
	.replace(/[^a-z0-9]+/g, '-')
	.replace(/^-+|-+$/g, '')

const zipName = `${slug}-v${version}.zip`
const zipPath = resolve(distDir, zipName)

if (existsSync(zipPath)) {
	rmSync(zipPath)
}

execFileSync('zip', [
	'-r',
	zipName,
	'.',
	'-x',
	'*.DS_Store',
	'**/*.DS_Store',
	'*.zip'
], { cwd: distDir, stdio: 'inherit' })

console.log(`Created ${zipPath}`)
