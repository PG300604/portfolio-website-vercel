import axios from 'axios';

export async function writeGitHubData(filename, newData) {
  const token = import.meta.env.VITE_GH_TOKEN;
  const owner = import.meta.env.VITE_GH_OWNER;
  const repo = import.meta.env.VITE_GH_REPO;
  const branch = import.meta.env.VITE_GH_BRANCH || 'main';
  
  if (!token || !owner || !repo) {
    throw new Error('GitHub configuration missing in .env');
  }

  const url = `https://api.github.com/repos/${owner}/${repo}/contents/data/${filename}`;
  
  try {
    let currentSha = undefined;

    try {
      // Step 1: Get current SHA
      const getRes = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
        params: { ref: branch }
      });
      currentSha = getRes.data.sha;
    } catch (err) {
      if (err.response && err.response.status === 404) {
        // File does not exist, created without sha
      } else {
        throw err;
      }
    }

    // Step 2: PUT updated content to specified branch
    const payload = {
      message: `update: ${filename}`,
      content: btoa(unescape(encodeURIComponent(JSON.stringify(newData, null, 2)))),
      branch: branch
    };
    
    if (currentSha) {
      payload.sha = currentSha;
    }

    await axios.put(url, payload, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return true;
  } catch (error) {
    console.error(`Error writing to ${filename}:`, error);
    throw error;
  }
}

export async function uploadGitHubImage(file) {
  const token = import.meta.env.VITE_GH_TOKEN;
  const owner = import.meta.env.VITE_GH_OWNER;
  const repo = import.meta.env.VITE_GH_REPO;
  const branch = import.meta.env.VITE_GH_BRANCH || 'main';
  
  if (!token || !owner || !repo) {
    throw new Error('GitHub configuration missing in .env');
  }

  // Generate clean unique filename
  const fileExt = file.name.split('.').pop();
  const cleanName = file.name.replace(/[^a-zA-Z0-9]/g, '_').split('_')[0] || 'upload';
  const filename = `${cleanName}_${Date.now()}.${fileExt}`;
  
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/uploads/${filename}`;
  
  // Convert file to base64
  const base64Data = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });

  const payload = {
    message: `upload: image ${filename}`,
    content: base64Data,
    branch: branch
  };

  await axios.put(url, payload, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/uploads/${filename}`;
}
