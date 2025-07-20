// Find our date picker inputs and button on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
const gallery = document.getElementById('gallery');
const button = document.querySelector('.filters button');

// Your NASA API key
const apiKey = 'BgwOg9axaFH7KvrXSAHgbdQgIdGlo4LqmBMyBnAa';

// Call the setupDateInputs function from dateRange.js
setupDateInputs(startInput, endInput);

// Listen for button clicks to fetch images
button.addEventListener('click', () => {
  // Get the selected start and end dates
  const startDate = startInput.value;
  const endDate = endInput.value;

  // Show loading message
  gallery.innerHTML = `
    <div class="placeholder">
      <div class="placeholder-icon">🔄</div>
      <p>Loading space photos…</p>
    </div>
  `;

  // Build the NASA APOD API URL
  const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&start_date=${startDate}&end_date=${endDate}`;

  // Fetch images from NASA API
  fetch(url)
    .then(response => response.json())
    .then(data => {
      // Remove loading message and show gallery
      gallery.innerHTML = '';

      // If only one image is returned, wrap it in an array
      const images = Array.isArray(data) ? data : [data];

      // Loop through each image and create gallery items
      images.forEach(item => {
        // Only show images (not videos)
        if (item.media_type === 'image') {
          // Create a div for each gallery item
          const div = document.createElement('div');
          div.className = 'gallery-item';
          div.innerHTML = `
            <img src="${item.url}" alt="${item.title}" />
            <h3>${item.title}</h3>
            <p>${item.date}</p>
          `;
          // When clicked, open modal with details
          div.addEventListener('click', () => openModal(item));
          gallery.appendChild(div);
        }
      });

      // If no images found, show a message
      if (gallery.innerHTML === '') {
        gallery.innerHTML = `
          <div class="placeholder">
            <div class="placeholder-icon">🚫</div>
            <p>No space photos found for this date range.</p>
          </div>
        `;
      }
    })
    .catch(error => {
      // Show error message
      gallery.innerHTML = `
        <div class="placeholder">
          <div class="placeholder-icon">⚠️</div>
          <p>Error loading images. Please try again.</p>
        </div>
      `;
    });
});

// Function to open a modal with image details
function openModal(item) {
  // Create modal HTML
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
      <img src="${item.hdurl || item.url}" alt="${item.title}" style="width:100%;max-height:400px;object-fit:contain;" />
      <h2>${item.title}</h2>
      <p><strong>Date:</strong> ${item.date}</p>
      <p>${item.explanation}</p>
    </div>
  `;
  // Add modal to body
  document.body.appendChild(modal);

  // Close modal when X is clicked or background is clicked
  modal.querySelector('.close').onclick = () => modal.remove();
  modal.onclick = (e) => {
    if (e.target === modal) modal.remove();
  };
}

// Add basic modal styles (beginner-friendly)
const style = document.createElement('style');
style.textContent = `
  .modal {
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
    background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 1000;
  }
  .modal-content {
    background: #fff; padding: 20px; border-radius: 8px; max-width: 600px; width: 90%; position: relative;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  }
  .modal-content img { border-radius: 4px; margin-bottom: 15px; }
  .modal-content .close {
    position: absolute; top: 10px; right: 15px; font-size: 28px; cursor: pointer; color: #333;
  }
`;
document.head.appendChild(style);
