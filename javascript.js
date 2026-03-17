// ===== FITUR DOWNLOAD REPO =====
async function downloadRepo(repoName, branch = 'main') {
    const token = document.getElementById('token').value;
    const username = document.getElementById('username').value;
    
    log(`📥 Downloading ${repoName}...`, 'info');
    
    try {
        // Get default branch kalo ga ada
        const repoInfo = await fetch(`https://api.github.com/repos/${username}/${repoName}`, {
            headers: { 'Authorization': `token ${token}` }
        }).then(r => r.json());
        
        const defaultBranch = repoInfo.default_branch || branch;
        
        // Download sebagai ZIP dari GitHub
        const downloadUrl = `https://api.github.com/repos/${username}/${repoName}/zipball/${defaultBranch}`;
        
        // Trigger download
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `${repoName}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        log(`✅ Downloaded: ${repoName}.zip`, 'success');
        return true;
    } catch (e) {
        log(`❌ Gagal download ${repoName}: ${e.message}`, 'error');
        return false;
    }
}

// ===== DOWNLOAD SEMUA REPO SEKALIGUS =====
async function downloadAllRepos() {
    const token = document.getElementById('token').value;
    const username = document.getElementById('username').value;
    
    if (!token || !username) {
        log('❌ Token dan Username wajib!', 'error');
        return;
    }
    
    log('🔥 MENDOWNLOAD SEMUA REPOSITORY...', 'warning');
    log('⏳ Ini bakal lama tergantung jumlah dan ukuran repo', 'info');
    
    try {
        // Ambil daftar semua repo
        const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, {
            headers: { 'Authorization': `token ${token}` }
        });
        
        const repos = await response.json();
        
        log(`📊 Total repo: ${repos.length}`, 'info');
        
        // Download satu per satu (biar ga kena rate limit)
        for (let i = 0; i < repos.length; i++) {
            const repo = repos[i];
            log(`[${i+1}/${repos.length}] Downloading ${repo.name}...`, 'info');
            
            // Trigger download
            const downloadUrl = `https://api.github.com/repos/${username}/${repo.name}/zipball/${repo.default_branch}`;
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = `${repo.name}.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            // Jeda biar ga kena rate limit
            await new Promise(r => setTimeout(r, 1000));
        }
        
        log('✅ SEMUA REPO BERHASIL DI-DOWNLOAD!', 'success');
        log('📁 Cek folder Downloads lu, semua file .zip ada di sana', 'info');
        
    } catch (e) {
        log(`❌ Error: ${e.message}`, 'error');
    }
}
