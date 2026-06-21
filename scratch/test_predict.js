async function testPrediction() {
  const payload = {
    age: 45,
    sex: 1, // Male
    TSH: 1.2,
    T3: 2.1,
    TT4: 104,
    FTI: 98
  };

  try {
    const response = await fetch('https://vivijumilia-model-xgboost.hf.space/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log('Response Status:', response.status);
    const data = await response.json();
    console.log('Response Data:', data);
  } catch (error) {
    console.error('Error contacting Flask API:', error);
  }
}

testPrediction();
