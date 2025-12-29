#!/usr/bin/env node

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Validate we're in a git repository
function isGitRepo() {
  try {
    execSync('git rev-parse --git-dir', { cwd: rootDir, stdio: 'ignore' });

    return true;
  } catch {
    return false;
  }
}

// Check for uncommitted changes
function hasUncommittedChanges() {
  try {
    const status = execSync('git status --porcelain', {
      cwd: rootDir,
      encoding: 'utf-8',
    });

    return status.trim().length > 0;
  } catch {
    return false;
  }
}

// Validate version format (semver)
function isValidVersion(version) {
  const semverRegex = /^\d+\.\d+\.\d+(-[\w.]+)?(\+[\w.]+)?$/;

  return semverRegex.test(version);
}

// Read package.json files
let rootPackageJson;
let stoopPackageJson;

try {
  rootPackageJson = JSON.parse(
    readFileSync(join(rootDir, 'package.json'), 'utf-8')
  );
  stoopPackageJson = JSON.parse(
    readFileSync(join(rootDir, 'packages', 'stoop', 'package.json'), 'utf-8')
  );
} catch (error) {
  console.error('❌ Failed to read package.json:', error.message);
  process.exit(1);
}

const rootVersion = rootPackageJson.version;
const stoopVersion = stoopPackageJson.version;

if (!stoopVersion) {
  console.error('❌ No version found in packages/stoop/package.json');
  process.exit(1);
}

if (!isValidVersion(stoopVersion)) {
  console.error(`❌ Invalid version format: ${stoopVersion}. Expected semver format (e.g., 1.0.0)`);
  process.exit(1);
}

// Warn if versions don't match
if (rootVersion !== stoopVersion) {
  console.warn(`⚠️  Version mismatch: root (${rootVersion}) vs packages/stoop (${stoopVersion})`);
  console.warn('   Publishing with packages/stoop version:', stoopVersion);
}

const version = stoopVersion;

const tag = `v${version}`;

// Get the last git tag
function getLastTag() {
  try {
    const tags = execSync('git tag --sort=-version:refname', {
      cwd: rootDir,
      encoding: 'utf-8',
    })
      .trim()
      .split('\n')
      .filter(Boolean);

    return tags[0] || null;
  } catch {
    return null;
  }
}

// Get commits since last tag
function getCommitsSinceLastTag() {
  const lastTag = getLastTag();

  // If no tag exists, get all commits (but limit to reasonable number)
  if (!lastTag) {
    try {
      const commits = execSync(
        'git log --pretty=format:"%s" --no-merges -100',
        {
          cwd: rootDir,
          encoding: 'utf-8',
        }
      )
        .trim()
        .split('\n')
        .filter(Boolean);

      return commits;
    } catch {
      return [];
    }
  }

  // Check if tag exists in current branch
  try {
    execSync(`git rev-parse ${lastTag}`, { cwd: rootDir, stdio: 'ignore' });
  } catch {
    // Tag doesn't exist in current branch, get all commits
    try {
      const commits = execSync(
        'git log --pretty=format:"%s" --no-merges -100',
        {
          cwd: rootDir,
          encoding: 'utf-8',
        }
      )
        .trim()
        .split('\n')
        .filter(Boolean);

      return commits;
    } catch {
      return [];
    }
  }

  // Get commits since last tag
  try {
    const commits = execSync(
      `git log ${lastTag}..HEAD --pretty=format:"%s" --no-merges --first-parent`,
      {
        cwd: rootDir,
        encoding: 'utf-8',
      }
    )
      .trim()
      .split('\n')
      .filter(Boolean);

    return commits;
  } catch {
    return [];
  }
}

// Sanitize commit message for markdown
function sanitizeCommitMessage(commit) {
  // Take only first line (subject)
  const firstLine = commit.split('\n')[0].trim();

  // Escape markdown special characters but keep basic formatting
  return firstLine
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\*/g, '\\*')
    .replace(/_/g, '\\_')
    .replace(/#/g, '\\#')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]');
}

// Categorize commits based on conventional commits or keywords
function categorizeCommits(commits) {
  const categories = {
    Added: [],
    Changed: [],
    Fixed: [],
    Other: [],
    Removed: [],
  };

  commits.forEach((commit) => {
    const sanitized = sanitizeCommitMessage(commit);
    const lower = commit.toLowerCase();

    if (lower.startsWith('feat:') || lower.startsWith('add:')) {
      categories.Added.push(sanitized.replace(/^(feat|add):\s*/i, ''));
    } else if (lower.startsWith('fix:') || lower.startsWith('bugfix:')) {
      categories.Fixed.push(sanitized.replace(/^(fix|bugfix):\s*/i, ''));
    } else if (
      lower.startsWith('change:') ||
      lower.startsWith('update:') ||
      lower.startsWith('refactor:') ||
      lower.startsWith('chore:')
    ) {
      categories.Changed.push(
        sanitized.replace(/^(change|update|refactor|chore):\s*/i, '')
      );
    } else if (lower.startsWith('remove:') || lower.startsWith('delete:') || lower.startsWith('removed:')) {
      categories.Removed.push(
        sanitized.replace(/^(remove|delete|removed):\s*/i, '')
      );
    } else {
      categories.Other.push(sanitized);
    }
  });

  return categories;
}

// Build changelog content from categorized commits
function buildChangelogContent(version, categories) {
  const today = new Date().toISOString().split('T')[0];
  let content = `## [${version}] - ${today}\n\n`;

  const hasAnyCommits =
    categories.Added.length > 0 ||
    categories.Changed.length > 0 ||
    categories.Fixed.length > 0 ||
    categories.Removed.length > 0 ||
    categories.Other.length > 0;

  if (!hasAnyCommits) {
    content += 'No changes documented.\n\n';

    return content;
  }

  // Add categorized commits in standard order
  if (categories.Added.length > 0) {
    content += '### Added\n\n';
    categories.Added.forEach((commit) => {
      content += `- ${commit}\n`;
    });
    content += '\n';
  }

  if (categories.Changed.length > 0) {
    content += '### Changed\n\n';
    categories.Changed.forEach((commit) => {
      content += `- ${commit}\n`;
    });
    content += '\n';
  }

  if (categories.Fixed.length > 0) {
    content += '### Fixed\n\n';
    categories.Fixed.forEach((commit) => {
      content += `- ${commit}\n`;
    });
    content += '\n';
  }

  if (categories.Removed.length > 0) {
    content += '### Removed\n\n';
    categories.Removed.forEach((commit) => {
      content += `- ${commit}\n`;
    });
    content += '\n';
  }

  if (categories.Other.length > 0) {
    content += '### Other\n\n';
    categories.Other.forEach((commit) => {
      content += `- ${commit}\n`;
    });
    content += '\n';
  }

  return content;
}

// Update CHANGELOG.md with commits
function updateChangelog(version, commits) {
  try {
    let changelog = readFileSync(join(rootDir, 'CHANGELOG.md'), 'utf-8');
    const categories = categorizeCommits(commits);
    const newContent = buildChangelogContent(version, categories);

    // Check if version entry already exists
    const versionRegex = new RegExp(
      `## \\[${version.replace(/\./g, '\\.')}\\] - ([\\d-]+)`,
      'i'
    );
    const existingMatch = changelog.match(versionRegex);

    if (existingMatch) {
      // Version entry exists, replace it with commits
      const versionSectionRegex = new RegExp(
        `## \\[${version.replace(/\./g, '\\.')}\\] - [\\d-]+\\n[\\s\\S]*?(?=\\n## |$)`,
        'i'
      );

      changelog = changelog.replace(versionSectionRegex, newContent.trim());
    } else {
      // Version entry doesn't exist, create it at the top (after header)
      const headerEnd = changelog.indexOf('\n## ');

      if (headerEnd !== -1) {
        changelog =
          changelog.slice(0, headerEnd) +
          '\n' +
          newContent +
          changelog.slice(headerEnd + 1);
      } else {
        changelog = changelog.trim() + '\n\n' + newContent;
      }
    }

    writeFileSync(join(rootDir, 'CHANGELOG.md'), changelog, 'utf-8');

    return true;
  } catch (error) {
    console.error('Error updating CHANGELOG.md:', error.message);

    return false;
  }
}

// Extract release notes from CHANGELOG.md
function getReleaseNotes(version) {
  try {
    const changelog = readFileSync(join(rootDir, 'CHANGELOG.md'), 'utf-8');
    const escapedVersion = version.replace(/\./g, '\\.');
    const versionRegex = new RegExp(
      `## \\[${escapedVersion}\\] - ([\\d-]+)\\n([\\s\\S]*?)(?=\\n## |$)`,
      'i'
    );
    const match = changelog.match(versionRegex);

    if (match && match[2]) {
      const notes = match[2].trim();

      return notes || `Release ${version}`;
    }

    return `Release ${version}`;
  } catch (error) {
    console.warn('Could not read CHANGELOG.md, using default release notes');

    return `Release ${version}`;
  }
}

// Check if GitHub CLI is installed
function hasGhCli() {
  try {
    execSync('gh --version', { stdio: 'ignore' });

    return true;
  } catch {
    return false;
  }
}

// Check if git tag already exists
function tagExists(tag) {
  try {
    execSync(`git rev-parse ${tag}`, { cwd: rootDir, stdio: 'ignore' });

    return true;
  } catch {
    return false;
  }
}

// Check if dist directory exists
function buildExists() {
  return existsSync(join(rootDir, 'packages', 'stoop', 'dist'));
}

// Main publish function
async function publish() {
  console.log(`🚀 Publishing version ${version}...\n`);

  // Pre-flight checks
  if (!isGitRepo()) {
    console.error('❌ Not in a git repository');
    process.exit(1);
  }

  if (hasUncommittedChanges()) {
    console.warn('⚠️  You have uncommitted changes in your working directory.');
    console.warn('   Consider committing or stashing them before publishing.\n');
    // Don't exit, just warn
  }

  if (!buildExists()) {
    console.error('❌ dist/ directory not found. Run "bun run build" first.');
    process.exit(1);
  }

  if (tagExists(tag)) {
    console.error(`❌ Git tag ${tag} already exists.`);
    console.error('   If you want to republish, delete the tag first:');
    console.error(`   git tag -d ${tag} && git push origin :refs/tags/${tag}`);
    process.exit(1);
  }

  // Step 0: Update CHANGELOG.md with commits
  console.log('📝 Updating CHANGELOG.md with commits...');
  const commits = getCommitsSinceLastTag();

  if (commits.length > 0) {
    console.log(`   Found ${commits.length} commit(s) since last release`);
    if (updateChangelog(version, commits)) {
      console.log('✅ Successfully updated CHANGELOG.md\n');
    } else {
      console.warn('⚠️  Could not update CHANGELOG.md, continuing anyway...\n');
    }
  } else {
    console.log('   No new commits found, skipping CHANGELOG update\n');
  }

  // Step 1: Create git tag
  console.log(`🏷️  Creating git tag ${tag}...`);
  try {
    execSync(`git tag ${tag}`, {
      cwd: rootDir,
      stdio: 'inherit',
    });
    console.log(`✅ Successfully created git tag ${tag}\n`);
  } catch (error) {
    console.error(`❌ Failed to create git tag ${tag}`);
    process.exit(1);
  }

  // Step 2: Publish to npm
  console.log('📦 Publishing to npm...');
  const stoopPackageDir = join(rootDir, 'packages', 'stoop');
  
  // Check for OTP argument
  const otpArg = process.argv.find(arg => arg.startsWith('--otp='));
  const otp = otpArg ? otpArg.split('=')[1] : null;
  const publishCommand = otp ? `npm publish --otp=${otp}` : 'npm publish';
  
  if (otp) {
    console.log('   Using OTP for 2FA authentication...');
  }
  
  try {
    execSync(publishCommand, {
      cwd: stoopPackageDir,
      stdio: 'inherit',
    });
    console.log('✅ Successfully published to npm\n');
  } catch (error) {
    console.error('❌ Failed to publish to npm');
    console.error('   The git tag was created but npm publish failed.');
    console.error(`   You may want to delete the tag: git tag -d ${tag}`);
    process.exit(1);
  }

  // Step 3: Push git tag to remote
  console.log(`📤 Pushing git tag ${tag} to remote...`);
  try {
    execSync(`git push origin ${tag}`, {
      cwd: rootDir,
      stdio: 'inherit',
    });
    console.log(`✅ Successfully pushed git tag ${tag}\n`);
  } catch (error) {
    console.warn(`⚠️  Failed to push git tag ${tag} to remote`);
    console.warn('   You may need to push it manually:');
    console.warn(`   git push origin ${tag}`);
  }

  // Step 4: Create GitHub release
  console.log('🏷️  Creating GitHub release...');

  if (!hasGhCli()) {
    console.warn(
      '⚠️  GitHub CLI (gh) is not installed. Skipping GitHub release creation.'
    );
    console.warn('   Install it with: brew install gh (macOS) or visit https://cli.github.com/');
    console.warn(`   Then manually create a release: gh release create ${tag} --title "${tag}" --notes "..."`);
    console.log(`\n🎉 Successfully published ${version} to npm!`);

    return;
  }

  // Check if already authenticated
  try {
    execSync('gh auth status', { stdio: 'ignore' });
  } catch {
    console.warn('⚠️  GitHub CLI is not authenticated. Skipping GitHub release creation.');
    console.warn('   Run: gh auth login');
    console.warn(`   Then manually create a release: gh release create ${tag} --title "${tag}" --notes "..."`);
    console.log(`\n🎉 Successfully published ${version} to npm!`);

    return;
  }

  const releaseNotes = getReleaseNotes(version);

  try {
    // Check if release already exists
    try {
      execSync(`gh release view ${tag}`, { stdio: 'ignore' });
      console.log(`⚠️  Release ${tag} already exists. Skipping GitHub release creation.`);
      console.log(`\n🎉 Successfully published ${version} to npm!`);

      return;
    } catch {
      // Release doesn't exist, create it
    }

    // Use a temporary file for release notes to avoid shell escaping issues
    const notesFile = join(rootDir, '.release-notes.txt');

    try {
      writeFileSync(notesFile, releaseNotes, 'utf-8');
      execSync(
        `gh release create ${tag} --title "${tag}" --notes-file "${notesFile}"`,
        {
          cwd: rootDir,
          stdio: 'inherit',
        }
      );
      unlinkSync(notesFile);
      console.log(`✅ Successfully created GitHub release ${tag}\n`);
    } catch (releaseError) {
      // Clean up temp file on error
      try {
        unlinkSync(notesFile);
      } catch {
        // Ignore cleanup errors
      }
      throw releaseError;
    }
  } catch (error) {
    console.error('❌ Failed to create GitHub release');
    console.error('   You can manually create it with:');
    console.error(`   gh release create ${tag} --title "${tag}" --notes "..."`);
    // Don't exit - npm publish succeeded, that's the important part
  }

  console.log(`🎉 Successfully published ${version} to npm and GitHub!`);
}

publish().catch((error) => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});
