import { execSync } from 'child_process';
try {
  console.log('Installing dependencies...');
  execSync('npm install react-router-dom axios', { stdio: 'inherit' });
  console.log('Done!');
} catch (e) {
  console.error('Failed:', e);
}
