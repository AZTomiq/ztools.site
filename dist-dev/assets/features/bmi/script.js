document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('bmi-form');
  const resultBox = document.getElementById('result-box');
  const bmiValueEl = document.getElementById('bmi-value');
  const bmiCategoryEl = document.getElementById('bmi-category');
  const feedbackEl = document.getElementById('bmi-feedback');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const heightCm = parseFloat(document.getElementById('height').value);
    const weightKg = parseFloat(document.getElementById('weight').value);

    if (!heightCm || !weightKg) return;

    // Use shared logic
    const bmiValue = BMILogic.calculateBMI(heightCm, weightKg);
    const categoryKey = BMILogic.getBMICategory(bmiValue);

    // Update UI
    bmiValueEl.textContent = bmiValue;

    // Get localized strings from the window (provided by EJS/i18next-like setup)
    // For simplicity, we use the classification table in the DOM or translation keys
    const resultMeta = getLocalizedResult(categoryKey);

    bmiCategoryEl.textContent = resultMeta.label;
    bmiCategoryEl.className = resultMeta.colorClass;
    feedbackEl.textContent = resultMeta.feedback;

    resultBox.style.display = 'block';
    resultBox.scrollIntoView({ behavior: 'smooth' });
  });

  function getLocalizedResult(categoryKey) {
    const isVi = document.documentElement.lang === 'vi';
    const config = {
      underweight: {
        label: isVi ? 'Nhẹ cân (Gầy)' : 'Underweight',
        colorClass: 'text-warning',
        feedback: isVi ? 'Bạn cần bổ sung dinh dưỡng để tăng cân.' : 'You may need to increase your nutritional intake.'
      },
      normal: {
        label: isVi ? 'Bình thường' : 'Normal',
        colorClass: 'text-success',
        feedback: isVi ? 'Tuyệt vời! Hãy duy trì chế độ ăn uống và luyện tập hiện tại.' : 'Great! Keep up your current diet and exercise.'
      },
      overweight: {
        label: isVi ? 'Thừa cân (Tiền béo phì)' : 'Overweight',
        colorClass: 'text-warning',
        feedback: isVi ? 'Bạn nên chú ý ăn uống lành mạnh và vận động nhiều hơn.' : 'Try to focus on a healthy diet and more activity.'
      },
      obese1: {
        label: isVi ? 'Béo phì độ I' : 'Obese Class I',
        colorClass: 'text-danger',
        feedback: isVi ? 'Cảnh báo! Bạn nên giảm cân để tránh nguy cơ bệnh lý.' : 'Warning! You should consider losing weight for your health.'
      },
      obese2: {
        label: isVi ? 'Béo phì độ II' : 'Obese Class II',
        colorClass: 'text-danger',
        feedback: isVi ? 'Nguy hiểm! Hãy tham khảo ý kiến bác sĩ để giảm cân an toàn.' : 'Danger! Please consult a doctor for safe weight loss.'
      }
    };
    return config[categoryKey];
  }
});
