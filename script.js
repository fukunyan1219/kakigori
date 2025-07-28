document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll('.item');
  const grandTotalEl = document.getElementById('grandTotal');

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

    saveData();
  }

  function saveData() {
    const data = {};
    items.forEach(item => {
      const name = item.dataset.name;
      const count = item.querySelector('.count-input').value;
      data[name] = count;
    });
    localStorage.setItem('salesData', JSON.stringify(data));
  }

  function loadData() {
    const saved = JSON.parse(localStorage.getItem('salesData') || '{}');
    items.forEach(item => {
      const name = item.dataset.name;
      const input = item.querySelector('.count-input');
      if (saved[name] !== undefined) {
        input.value = saved[name];
      } else {
        input.value = 0;
      }
    });
    updateTotal();
  }

  items.forEach(item => {
    const button = item.querySelector('.count-btn');
    const input = item.querySelector('.count-input');

    button.addEventListener('click', () => {
      input.value = Number(input.value) + 1;
      updateTotal();
    });

    input.addEventListener('input', () => {
      updateTotal();
    });
  });

  loadData();
});
