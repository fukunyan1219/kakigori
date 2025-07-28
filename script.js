document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll('.item');
  const grandTotalEl = document.getElementById('grandTotal');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const resetBtn = document.getElementById('resetBtn');
  const cashTotalEl = document.getElementById('cashTotal');
  const paypayTotalEl = document.getElementById('paypayTotal');

  // 🔢 合計金額の更新
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

  // 💾 売上保存と反映
  function savePayment(grandTotal) {
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    const key = paymentMethod === 'cash' ? 'cashTotal' : 'paypayTotal';
    const current = Number(localStorage.getItem(key)) || 0;
    const newTotal = current + grandTotal;
    localStorage.setItem(key, newTotal);
    updatePaymentDisplay();
  }

  // 👁 累計売上の表示更新
  function updatePaymentDisplay() {
    cashTotalEl.textContent = localStorage.getItem('cashTotal') || 0;
    paypayTotalEl.textContent = localStorage.getItem('paypayTotal') || 0;
  }

  // 🔄 入力と表示のリセット
  function resetInputs() {
    items.forEach(item => {
      const input = item.querySelector('.count-input');
      input.value = 0;
      item.querySelector('.total-price').textContent = '0';
    });
    grandTotalEl.textContent = '0';
  }

  // ➕ 各商品の加算ボタンと手入力
  items.forEach(item => {
    const button = item.querySelector('.add-btn');
    const input = item.querySelector('.count-input');

    button.addEventListener('click', () => {
      input.value = Number(input.value) + 1;
      updateTotal();
    });

    input.addEventListener('input', () => {
      updateTotal();
    });
  });

  // 💳 決済ボタンイベント
  checkoutBtn.addEventListener('click', () => {
    const total = Number(grandTotalEl.textContent);
    if (total > 0) {
      savePayment(total);  // 売上に加算
      resetInputs();       // 入力リセット
    } else {
      alert("商品を追加してください！");
    }
  });

  // 🔄 リセットボタンイベント
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

  // 🔁 初期化
  updateTotal();
  updatePaymentDisplay();
});
