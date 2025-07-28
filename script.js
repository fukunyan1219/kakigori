document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll('.item');
  const grandTotalEl = document.getElementById('grandTotal');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const resetBtn = document.getElementById('resetBtn');
  const cashTotalEl = document.getElementById('cashTotal');
  const paypayTotalEl = document.getElementById('paypayTotal');

  function updateTotal() {
    let grandTotal = 0;
    items.forEach(item => {
      const price = Number(item.dataset.price);
      const input = item.querySelector('.count-input');
      const count = Number(input.value) || 0;
      const total = price * count;
      item.querySelector('.total-price').textContent = total;
      grandTotal += total;
    });
    grandTotalEl.textContent = grandTotal;
  }

  function savePayment(grandTotal) {
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    const key = paymentMethod === 'cash' ? 'cashTotal' : 'paypayTotal';
    const current = Number(localStorage.getItem(key)) || 0;
    const newTotal = current + grandTotal;
    localStorage.setItem(key, newTotal);
    updatePaymentDisplay();
  }

  function updatePaymentDisplay() {
    cashTotalEl.textContent = localStorage.getItem('cashTotal') || 0;
    paypayTotalEl.textContent = localStorage.getItem('paypayTotal') || 0;
  }

  function resetInputs() {
    items.forEach(item => {
      const input = item.querySelector('.count-input');
      input.value = 0;
      item.querySelector('.total-price').textContent = '0';
    });
    grandTotalEl.textContent = '0';
  }

  items.forEach(item => {
    const addBtn = item.querySelector('.add-btn');
    const subBtn = item.querySelector('.sub-btn');
    const input = item.querySelector('.count-input');

    addBtn.addEventListener('click', () => {
      input.value = Number(input.value) + 1;
      updateTotal();
    });

     subBtn.addEventListener('click', () => {
    const current = Number(input.value);
    input.value = current - 1; // マイナスも許可
    updateTotal();
  });　

    
    input.addEventListener('input', () => {
      updateTotal();
    });
  });

  checkoutBtn.addEventListener('click', () => {
    const total = Number(grandTotalEl.textContent);
    if (total !== 0) {  // 0じゃなければ決済OK
  savePayment(total);
  resetInputs();
} else {
  alert("商品を追加してください！");
}
  });

  resetBtn.addEventListener('click', () => {
    const confirmReset = confirm('本当にすべてリセットしますか？');
    if (confirmReset) {
      localStorage.removeItem('cashTotal');
      localStorage.removeItem('paypayTotal');
      resetInputs();
      updatePaymentDisplay();
      alert('リセットしました');
    }
  });

  updateTotal();
  updatePaymentDisplay();
});
