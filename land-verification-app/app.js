document.addEventListener('DOMContentLoaded', () => {
  
  // --- UI Views ---
  const views = {
    dashboard: document.getElementById('view-dashboard'),
    form: document.getElementById('view-form'),
    processing: document.getElementById('view-processing'),
    certificate: document.getElementById('view-certificate')
  };

  // --- Buttons & Triggers ---
  const btnStartVerify = document.getElementById('btn-start-verification');
  const btnViewRegistryScroll = document.getElementById('btn-view-registry-scroll');
  const btnFormBack = document.getElementById('btn-form-back');
  const btnCertBack = document.getElementById('btn-cert-back');
  const btnLoadDemo = document.getElementById('btn-load-demo');
  const btnPrintCert = document.getElementById('btn-print-certificate');
  const btnRemovePhoto = document.getElementById('btn-remove-photo');
  const navLogo = document.getElementById('nav-logo');
  
  // --- Form Elements ---
  const landForm = document.getElementById('land-verification-form');
  const inputOwnerName = document.getElementById('input-owner-name');
  const inputLandLocation = document.getElementById('input-land-location');
  const inputLandPhoto = document.getElementById('input-land-photo');
  const uploadContainer = document.getElementById('upload-container');
  const uploaderContentPrompt = document.getElementById('uploader-content-prompt');
  const uploaderPreviewContainer = document.getElementById('uploader-preview-container');
  const uploaderPreviewImage = document.getElementById('uploader-preview-image');
  
  // New Profile Photo Elements
  const inputProfilePhoto = document.getElementById('input-profile-photo');
  const profileUploadContainer = document.getElementById('profile-upload-container');
  const profileUploaderContentPrompt = document.getElementById('profile-uploader-content-prompt');
  const profilePreviewContainer = document.getElementById('profile-preview-container');
  const profilePreviewImage = document.getElementById('profile-preview-image');
  const btnRemoveProfile = document.getElementById('btn-remove-profile');
  
  // New Details Fields
  const inputSurveyNumber = document.getElementById('input-survey-number');
  const inputCropVariety = document.getElementById('input-crop-variety');
  const inputCultivationDate = document.getElementById('input-cultivation-date');
  
  // --- Scanner Components ---
  const scannerLandImage = document.getElementById('scanner-land-image');
  const scannerLogs = document.getElementById('scanner-logs');
  
  // --- Certificate Components ---
  const certOwner = document.getElementById('cert-owner');
  const certProfileAvatar = document.getElementById('cert-profile-avatar');
  const certLocation = document.getElementById('cert-location');
  const certSurveyNumber = document.getElementById('cert-survey-number');
  const certCropVariety = document.getElementById('cert-crop-variety');
  const certCropDate = document.getElementById('cert-crop-date');
  const certHash = document.getElementById('cert-hash');
  const certLandImage = document.getElementById('cert-land-image');
  const certTagCoords = document.getElementById('cert-tag-coords');
  const certTagTime = document.getElementById('cert-tag-time');
  const certQrCanvas = document.getElementById('cert-qr-canvas');
  
  // --- State Variables ---
  let selectedImageBase64 = null;
  let selectedProfileBase64 = null;
  let verifiedAssets = JSON.parse(localStorage.getItem('terratrust_registry') || '[]');

  // --- Initialization ---
  updateRegistryList();

  // --- View Switcher ---
  function showView(viewKey) {
    Object.keys(views).forEach(key => {
      if (key === viewKey) {
        views[key].classList.add('active');
      } else {
        views[key].classList.remove('active');
      }
    });
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // --- Navigation Controls ---
  btnStartVerify.addEventListener('click', () => {
    resetForm();
    showView('form');
  });

  btnViewRegistryScroll.addEventListener('click', () => {
    document.getElementById('registry-section').scrollIntoView({ behavior: 'smooth' });
  });

  btnFormBack.addEventListener('click', () => {
    showView('dashboard');
  });

  btnCertBack.addEventListener('click', () => {
    resetForm();
    showView('form');
  });

  navLogo.addEventListener('click', (e) => {
    e.preventDefault();
    showView('dashboard');
  });

  // --- Drag & Drop Image Handlers ---
  uploadContainer.addEventListener('click', (e) => {
    if (e.target !== btnRemovePhoto) {
      inputLandPhoto.click();
    }
  });

  uploadContainer.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadContainer.classList.add('dragover');
  });

  uploadContainer.addEventListener('dragleave', () => {
    uploadContainer.classList.remove('dragover');
  });

  uploadContainer.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadContainer.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageFile(files[0]);
    }
  });

  inputLandPhoto.addEventListener('change', (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleImageFile(files[0]);
    }
  });

  btnRemovePhoto.addEventListener('click', (e) => {
    e.stopPropagation();
    removePreview();
  });

  function handleImageFile(file) {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      selectedImageBase64 = event.target.result;
      uploaderContentPrompt.style.display = 'none';
      uploaderPreviewImage.src = selectedImageBase64;
      uploaderPreviewContainer.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }

  function removePreview() {
    selectedImageBase64 = null;
    inputLandPhoto.value = '';
    uploaderPreviewImage.src = '';
    uploaderPreviewContainer.style.display = 'none';
    uploaderContentPrompt.style.display = 'block';
  }

  // --- Profile Photo Handlers ---
  profileUploadContainer.addEventListener('click', (e) => {
    if (e.target !== btnRemoveProfile) {
      inputProfilePhoto.click();
    }
  });

  inputProfilePhoto.addEventListener('change', (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleProfileFile(files[0]);
    }
  });

  btnRemoveProfile.addEventListener('click', (e) => {
    e.stopPropagation();
    removeProfilePreview();
  });

  function handleProfileFile(file) {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file for the profile photo.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('Profile photo size exceeds 2MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      selectedProfileBase64 = event.target.result;
      profileUploaderContentPrompt.style.display = 'none';
      profilePreviewImage.src = selectedProfileBase64;
      profilePreviewContainer.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }

  function removeProfilePreview() {
    selectedProfileBase64 = null;
    inputProfilePhoto.value = '';
    profilePreviewImage.src = '';
    profilePreviewContainer.style.display = 'none';
    profileUploaderContentPrompt.style.display = 'flex';
  }

  // --- Reset Form ---
  function resetForm() {
    landForm.reset();
    removePreview();
    removeProfilePreview();
  }

  // --- Load Demo Action ---
  btnLoadDemo.addEventListener('click', () => {
    inputOwnerName.value = 'Johnathan Sterling';
    inputLandLocation.value = 'Plot 42A, Highland Valley Ridge (45.3840° N, 75.6972° W)';
    inputSurveyNumber.value = 'SV-8094/2026';
    inputCropVariety.value = 'Premium Basmati Rice (Paddy)';
    inputCultivationDate.value = '2026-06-15';
    
    // Set demo profile image as selected
    selectedProfileBase64 = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%236366f1"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>';
    profileUploaderContentPrompt.style.display = 'none';
    profilePreviewImage.src = selectedProfileBase64;
    profilePreviewContainer.style.display = 'block';

    // Set demo land image as selected
    selectedImageBase64 = 'default-land.jpg';
    uploaderContentPrompt.style.display = 'none';
    uploaderPreviewImage.src = 'default-land.jpg';
    uploaderPreviewContainer.style.display = 'block';
  });

  // --- Verification pipeline simulation ---
  landForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!selectedImageBase64) {
      alert('Please upload a land photo or load the demo sample.');
      return;
    }

    // Set Scanner Image
    scannerLandImage.src = selectedImageBase64;
    showView('processing');
    
    // Run verification logs
    runVerificationSequence();
  });

  function runVerificationSequence() {
    scannerLogs.innerHTML = '';
    const logs = [
      { text: 'Initializing satellite mapping gateway...', delay: 300 },
      { text: 'Connecting to GIS Global Registry database...', delay: 800 },
      { text: 'Comparing deed submission with satellite overlays...', delay: 1400 },
      { text: 'Extracting geotags and camera sensor metadata...', delay: 2000 },
      { text: 'Land boundaries verified: Satellite matching complete (100% confidence)...', delay: 2600 },
      { text: 'Creating cryptographic transaction hash on the registry...', delay: 3200 },
      { text: 'Authenticating registrar digital signature...', delay: 3800 },
      { text: 'Verification complete! Issuing certificate...', delay: 4400 }
    ];

    logs.forEach(log => {
      setTimeout(() => {
        const div = document.createElement('div');
        div.className = 'log-entry';
        div.textContent = log.text;
        scannerLogs.appendChild(div);
        scannerLogs.scrollTop = scannerLogs.scrollHeight;
      }, log.delay);
    });

    // Finished simulation transition
    setTimeout(() => {
      generateCertificate();
    }, 4800);
  }

  // --- Certificate Generation ---
  function generateCertificate() {
    const ownerName = inputOwnerName.value.trim();
    const location = inputLandLocation.value.trim();
    const surveyNumber = inputSurveyNumber.value.trim();
    const cropVariety = inputCropVariety.value.trim();
    const cultivationDate = inputCultivationDate.value;
    const hash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

    // Parse coordinates if available, else make random
    let coords = '45.3840° N, 75.6972° W';
    const coordMatch = location.match(/\(([^)]+)\)/);
    if (coordMatch) {
      coords = coordMatch[1];
    } else {
      const lat = (Math.random() * (90 - 1) + 1).toFixed(4);
      const lng = (Math.random() * (180 - 1) + 1).toFixed(4);
      coords = `${lat}° N, ${lng}° W`;
    }

    // Set Certificate Values
    certOwner.textContent = ownerName;
    certProfileAvatar.src = selectedProfileBase64 || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%236366f1"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>';
    certLocation.textContent = location;
    certSurveyNumber.textContent = surveyNumber;
    certCropVariety.textContent = cropVariety;
    certCropDate.textContent = cultivationDate;
    certHash.textContent = hash;
    certLandImage.src = selectedImageBase64;
    certTagCoords.textContent = coords;
    certTagTime.textContent = timestamp;

    // Draw unique Canvas QR Code
    drawMockQRCode(hash);

    // Save to LocalStorage registry
    const newAsset = {
      id: verifiedAssets.length + 1,
      owner: ownerName,
      profileImage: selectedProfileBase64,
      location: location,
      surveyNumber: surveyNumber,
      cropVariety: cropVariety,
      cropDate: cultivationDate,
      hash: hash,
      date: new Date().toLocaleDateString(),
      image: selectedImageBase64,
      coords: coords
    };
    
    verifiedAssets.unshift(newAsset); // Add to beginning
    localStorage.setItem('terratrust_registry', JSON.stringify(verifiedAssets));
    
    // Update dashboard list
    updateRegistryList();

    // Show Certificate View
    showView('certificate');
  }

  // --- Draw QR Code ---
  function drawMockQRCode(hashText) {
    const ctx = certQrCanvas.getContext('2d');
    certQrCanvas.width = 100;
    certQrCanvas.height = 100;
    
    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 100, 100);

    // Draw QR markers (corners)
    ctx.fillStyle = '#0f172a';
    
    // Top-Left
    ctx.fillRect(5, 5, 25, 25);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(9, 9, 17, 17);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(13, 13, 9, 9);
    
    // Top-Right
    ctx.fillRect(70, 5, 25, 25);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(74, 9, 17, 17);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(78, 13, 9, 9);

    // Bottom-Left
    ctx.fillRect(5, 70, 25, 25);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(9, 74, 17, 17);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(13, 78, 9, 9);

    // Fill in mock random noise based on hash characters
    ctx.fillStyle = '#0f172a';
    let seed = 0;
    for (let i = 0; i < hashText.length; i++) {
      seed += hashText.charCodeAt(i);
    }
    
    for (let x = 35; x < 65; x += 5) {
      for (let y = 5; y < 95; y += 5) {
        if (((x * y + seed) % 7) > 2) {
          ctx.fillRect(x, y, 4, 4);
        }
      }
    }

    for (let x = 5; x < 35; x += 5) {
      for (let y = 35; y < 65; y += 5) {
        if (((x * y + seed) % 7) > 2) {
          ctx.fillRect(x, y, 4, 4);
        }
      }
    }

    for (let x = 65; x < 95; x += 5) {
      for (let y = 35; y < 95; y += 5) {
        if (((x * y + seed) % 5) > 1) {
          ctx.fillRect(x, y, 4, 4);
        }
      }
    }
  }

  // --- Update Registry List & Stats ---
  function updateRegistryList() {
    const listContainer = document.getElementById('registry-list-container');
    const placeholder = document.getElementById('registry-placeholder');
    const verifiedCountBadge = document.getElementById('stat-verified-count');

    // Update NavBar count
    verifiedCountBadge.textContent = verifiedAssets.length;

    if (verifiedAssets.length === 0) {
      placeholder.style.display = 'block';
      return;
    }

    placeholder.style.display = 'none';
    
    // Clear list except placeholder
    const listItems = listContainer.querySelectorAll('.registry-item');
    listItems.forEach(item => item.remove());

    verifiedAssets.forEach(asset => {
      const item = document.createElement('div');
      item.className = 'registry-item';
      
      item.innerHTML = `
        <div class="item-left">
          <img src="${asset.image}" class="item-img" alt="${asset.owner}'s Land">
          <div class="item-info">
            <span class="item-title">${asset.owner}</span>
            <span class="item-desc">${asset.location}</span>
          </div>
        </div>
        <div class="item-right">
          <span class="badge badge-verified">Verified</span>
          <button class="btn-text btn-view-cert" data-id="${asset.id}">View Certificate</button>
          <button class="btn-text btn-delete-cert btn-text-danger" data-id="${asset.id}" style="margin-left: 0.75rem;">Delete</button>
        </div>
      `;

      listContainer.appendChild(item);
    });

    // Add click listeners to View Certificate buttons
    const viewButtons = listContainer.querySelectorAll('.btn-view-cert');
    viewButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.target.getAttribute('data-id'));
        const asset = verifiedAssets.find(a => a.id === id);
        if (asset) {
          loadAssetCertificate(asset);
        }
      });
    });

    // Add click listeners to Delete Certificate buttons
    const deleteButtons = listContainer.querySelectorAll('.btn-delete-cert');
    deleteButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.target.getAttribute('data-id'));
        if (confirm('Are you sure you want to remove this verified land record from the registry?')) {
          verifiedAssets = verifiedAssets.filter(a => a.id !== id);
          localStorage.setItem('terratrust_registry', JSON.stringify(verifiedAssets));
          updateRegistryList();
        }
      });
    });
  }

  // --- Load Existing Certificate from Registry ---
  function loadAssetCertificate(asset) {
    certOwner.textContent = asset.owner;
    certProfileAvatar.src = asset.profileImage || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%236366f1"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>';
    certLocation.textContent = asset.location;
    certSurveyNumber.textContent = asset.surveyNumber || 'N/A';
    certCropVariety.textContent = asset.cropVariety || 'N/A';
    certCropDate.textContent = asset.cropDate || 'N/A';
    certHash.textContent = asset.hash;
    certLandImage.src = asset.image;
    certTagCoords.textContent = asset.coords;
    
    // Mock date to original timestamp or current date if empty
    certTagTime.textContent = asset.date + ' UTC';

    // Draw QR Code
    drawMockQRCode(asset.hash);

    // Switch view
    showView('certificate');
  }

  // --- Print / Save Certificate PDF ---
  btnPrintCert.addEventListener('click', () => {
    window.print();
  });
  
});
