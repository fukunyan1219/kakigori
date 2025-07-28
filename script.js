document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll('.item');
  const grandTotalEl = document.getElementById('grandTotal');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const resetBtn = document.getElementById('resetBtn');
  const cashTotalEl = document.getElementById('cashTotal');
  const paypayTotalEl = document.getElementById('paypayTotal');

  // 合計金額の更新
  function updateTotal() {
    let grandTotal = 0;
    items.forEach(item => {
      const price = Number(item.dataset.price);
      const input = item.querySelector('.count-input');
      let count = Number(input.value);
      if (isNaN(count)) count = 0;
      const total = price * count;
      item.querySelector('.total-price').textContent = total;
      grandTotal += total;
    });
    grandTotalEl.textContent = grandTotal;
  }

  // 売上保存と表示更新
  function savePayment(grandTotal) {
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    const key = paymentMethod === 'cash' ? 'cashTotal' : 'paypayTotal';
    const current = Number(localStorage.getItem(key)) || 0;
    const newTotal = current + grandTotal;
    localStorage.setItem(key, newTotal);
    updatePaymentDisplay();
  }

  // 累計売上表示更新
  function updatePaymentDisplay() {
    cashTotalEl.textContent = localStorage.getItem('cashTotal') || 0;
    paypayTotalEl.textContent = localStorage.getItem('paypayTotal') || 0;
  }

  // 入力と表示のリセット
  function resetInputs() {
    items.forEach(item => {
      const input = item.querySelector('.count-input');
      input.value = 0;
      item.querySelector('.total-price').textContent = '0';
    });
    grandTotalEl.textContent = '0';
  }

  // ＋ボタン、−ボタン、入力変更イベント登録
  items.forEach(item => {
    const addBtn = item.querySelector('.add-btn');
    const subBtn = item.querySelector('.sub-btn');
    const input = item.querySelector('.count-input');

    addBtn.addEventListener('click', () => {
      input.value = Number(input.value) + 1;
      updateTotal();
    });

    subBtn.addEventListener('click', () => {
      input.value = Number(input.value) - 1; // マイナスも許可
      updateTotal();
    });

    input.addEventListener('input', () => {
      updateTotal();
    });
  });

  // 決済ボタン
 checkoutBtn.addEventListener('click', () => {
  const total = Number(grandTotalEl.textContent);
  if (!isNaN(total)) {  // ゼロやマイナスもOK
    savePayment(total);
    resetInputs();
    alert('決済を反映しました');
  } else {
    alert('合計が正しくありません');
  }
});

  // リセットボタン（確認ダイアログ付き）
  resetBtn.addEventListener('click', () => {
    if (confirm('本当にすべてリセットしますか？')) {
      localStorage.removeItem('cashTotal');
      localStorage.removeItem('paypayTotal');
      resetInputs();
      updatePaymentDisplay();
      alert('リセットしました');
    }
  });

  // ページ読み込み時に累計表示更新
  updateTotal();
  updatePaymentDisplay();
});
