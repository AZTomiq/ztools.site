document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('bmi-form');
  const resultBox = document.getElementById('result-box');
  const bmiValueEl = document.getElementById('bmi-value');
  const bmiCategoryEl = document.getElementById('bmi-category');
  const feedbackEl = document.getElementById('bmi-feedback');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const heightCm = parseFloat(document.getElementById('height').value);
    const weightKg = parseFloat(document.getElementById('weight').value);

    if (!heightCm || !weightKg) return;

    // BMI Formula: weight (kg) / [height (m)]^2
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    const roundedBMI = bmi.toFixed(1);

    bmiValueEl.textContent = roundedBMI;

    let category = '';
    let colorClass = '';
    let feedback = '';

    // IDI & WPRO (Asian Standard)
    if (bmi < 18.5) {
      category = 'Nhẹ cân (Gầy)';
      colorClass = 'text-warning';
      feedback = 'Bạn cần bổ sung dinh dưỡng để tăng cân.';
    } else if (bmi < 23) {
      category = 'Bình thường';
      colorClass = 'text-success';
      feedback = 'Tuyệt vời! Hãy duy trì chế độ ăn uống và luyện tập hiện tại.';
    } else if (bmi < 25) {
      category = 'Thừa cân (Tiền béo phì)';
      colorClass = 'text-warning';
      feedback = 'Bạn nên chú ý ăn uống lành mạnh và vận động nhiều hơn.';
    } else if (bmi < 30) {
      category = 'Béo phì độ I';
      colorClass = 'text-danger';
      feedback = 'Cảnh báo! Bạn nên giảm cân để tránh nguy cơ bệnh lý.';
    } else {
      category = 'Béo phì độ II';
      colorClass = 'text-danger';
      feedback = 'Nguy hiểm! Hãy tham khảo ý kiến bác sĩ để giảm cân an toàn.';
    }

    bmiCategoryEl.textContent = category;
    bmiCategoryEl.className = colorClass; // Simple class assignment, need CSS
    feedbackEl.textContent = feedback;

    resultBox.style.display = 'block';
    resultBox.scrollIntoView({ behavior: 'smooth' });
  });
});
