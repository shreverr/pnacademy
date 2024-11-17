exports.handler = (event, context, callback) => {
  console.log(process.env.API_KEY);
  console.log(process.env.BASE_URL);
  console.log(`assessmentId: ${event.assessmentId}`);

  const url = `https://${process.env.BASE_URL}/v1/assessment/compute-results`;
  const token = process.env.API_KEY; 
  const payload = {
      assessmentId: event.assessmentId
  };

  fetch(url, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
  })
      .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
      })
      .then(data => {
          console.log('Response data:', data);
      })
      .catch(error => {
          console.error('Error:', error);
      });


  callback(null, 'Finished');
};